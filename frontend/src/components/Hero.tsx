'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HAS_CONTRACT } from '@/lib/contract'

interface HeroProps {
  onConnect: () => void
  isConnected: boolean
}

// Character-by-character reveal component
function RevealText({ text, className, baseDelay = 0 }: { text: string; className?: string; baseDelay?: number }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{
              duration: 0.8,
              delay: baseDelay + wi * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {wi < words.length - 1 && <span className="inline-block w-[0.3em]" />}
        </span>
      ))}
    </span>
  )
}

export function Hero({ onConnect, isConnected }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const sectionRef = useRef<HTMLElement>(null)
  const [loaded, setLoaded] = useState(false)

  // Cursor tracking with spring physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25, mass: 0.8 })
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25, mass: 0.8 })

  // Track mouse position relative to section
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    function onMouseMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    section.addEventListener('mousemove', onMouseMove)
    return () => section.removeEventListener('mousemove', onMouseMove)
  }, [mouseX, mouseY])

  // Trigger loaded state after mount
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Canvas with cursor-reactive crosshairs and progressive grid draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let w = 0
    let h = 0
    let time = 0
    let lastFrame = performance.now()
    let gridProgress = 0 // 0 to 1: progressive grid reveal

    function resize() {
      if (!canvas || !ctx) return
      w = canvas.parentElement?.clientWidth ?? window.innerWidth
      h = canvas.parentElement?.clientHeight ?? window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const gridSpacing = 48

    // Unsubscribe from spring values for canvas (use get() for perf)
    let cursorX = w * 0.72
    let cursorY = h * 0.45
    const unsubX = springX.on('change', (v) => { cursorX = v })
    const unsubY = springY.on('change', (v) => { cursorY = v })

    function draw(now: number) {
      if (!ctx) return
      const dt = (now - lastFrame) / 1000
      lastFrame = now
      time += dt * 0.18

      // Progressive grid: draws in over first 2 seconds
      gridProgress = Math.min(1, gridProgress + dt * 0.5)

      ctx.clearRect(0, 0, w, h)

      // Draw grid with progressive reveal (lines extend from center outward)
      ctx.strokeStyle = '#d4d0c4'
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.35 * gridProgress

      const cx_grid = w / 2
      const cy_grid = h / 2
      const maxDist = Math.sqrt(w * w + h * h) / 2
      const revealDist = gridProgress * maxDist

      for (let x = 0; x <= w; x += gridSpacing) {
        const dist = Math.abs(x - cx_grid)
        if (dist > revealDist) continue
        const lineAlpha = 1 - (dist / revealDist) * 0.6
        ctx.globalAlpha = 0.35 * lineAlpha * gridProgress
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y <= h; y += gridSpacing) {
        const dist = Math.abs(y - cy_grid)
        if (dist > revealDist) continue
        const lineAlpha = 1 - (dist / revealDist) * 0.6
        ctx.globalAlpha = 0.35 * lineAlpha * gridProgress
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Magnetic distortion near cursor
      ctx.globalAlpha = 1
      const distortRadius = 120
      const distortStrength = 12

      // Main crosshair follows cursor with spring physics
      const mainX = cursorX || w * 0.72
      const mainY = cursorY || h * 0.45
      const armLen = 60

      // Draw distortion field lines near cursor
      ctx.strokeStyle = '#2945c9'
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.15

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const rx = mainX + Math.cos(angle + time) * 40
        const ry = mainY + Math.sin(angle + time) * 40
        ctx.beginPath()
        ctx.moveTo(rx - 8, ry)
        ctx.lineTo(rx + 8, ry)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(rx, ry - 8)
        ctx.lineTo(rx, ry + 8)
        ctx.stroke()
      }

      // Main crosshair
      ctx.globalAlpha = 0.9
      ctx.strokeStyle = '#2945c9'
      ctx.lineWidth = 1.5

      // Horizontal arm with slight wave
      ctx.beginPath()
      ctx.moveTo(mainX - armLen, mainY)
      ctx.lineTo(mainX + armLen, mainY)
      ctx.stroke()

      // Vertical arm
      ctx.beginPath()
      ctx.moveTo(mainX, mainY - armLen)
      ctx.lineTo(mainX, mainY + armLen)
      ctx.stroke()

      // Center ring (not filled - more technical)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(mainX, mainY, 4, 0, Math.PI * 2)
      ctx.stroke()

      // Center dot
      ctx.fillStyle = '#2945c9'
      ctx.beginPath()
      ctx.arc(mainX, mainY, 1.5, 0, Math.PI * 2)
      ctx.fill()

      // Coordinate labels
      ctx.font = '10px "IBM Plex Mono", monospace'
      ctx.fillStyle = '#56565e'
      ctx.globalAlpha = 0.6
      ctx.fillText(`x:${Math.round(mainX)}`, mainX + armLen + 8, mainY + 4)
      ctx.fillText(`y:${Math.round(mainY)}`, mainX - 14, mainY - armLen - 8)

      // Distance readout
      const distFromCenter = Math.round(Math.sqrt(
        (mainX - w / 2) ** 2 + (mainY - h / 2) ** 2
      ))
      ctx.fillText(`d:${distFromCenter}`, mainX + armLen + 8, mainY + 16)

      // Secondary crosshair (autonomous, slower)
      const cx2 = w * 0.25 + Math.cos(time * 0.4) * 20
      const cy2 = h * 0.7 + Math.sin(time * 0.3) * 15
      ctx.strokeStyle = '#2945c9'
      ctx.globalAlpha = 0.2
      ctx.lineWidth = 0.5

      ctx.beginPath()
      ctx.moveTo(cx2 - 25, cy2)
      ctx.lineTo(cx2 + 25, cy2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx2, cy2 - 25)
      ctx.lineTo(cx2, cy2 + 25)
      ctx.stroke()

      // Measurement line between crosshairs
      ctx.setLineDash([3, 4])
      ctx.globalAlpha = 0.12
      ctx.beginPath()
      ctx.moveTo(mainX, mainY)
      ctx.lineTo(cx2, cy2)
      ctx.stroke()
      ctx.setLineDash([])

      animRef.current = requestAnimationFrame(draw)
    }

    // Visibility API
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current)
      } else {
        lastFrame = performance.now()
        animRef.current = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      unsubX()
      unsubY()
    }
  }, [springX, springY])

  // Status panel rows with staggered assembly
  const statusRows = [
    { label: 'Network', value: 'GenLayer Bradbury Testnet', mono: false },
    { label: 'Chain ID', value: '4221', mono: true },
    { label: 'Consensus', value: 'AI judgment under validator agreement', mono: false },
    { label: 'Contract', value: HAS_CONTRACT ? 'Deployed and active' : 'Not configured (see README)', mono: true, muted: true },
  ]

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Cursor-reactive crosshair canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left column: headline + CTA */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <span className="label-micro mb-6 block">
                AI-Moderated Deliberation
              </span>
            </motion.div>

            <h1 className="display-xl text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink-900 mb-6">
              <RevealText text="Arguments" baseDelay={0.3} />
              <br />
              <RevealText text="judged by" baseDelay={0.7} />
              <br />
              <RevealText text="consensus." className="text-cobalt" baseDelay={1.1} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-ink-600 text-lg max-w-xl mb-10 leading-relaxed"
            >
              Submit positions on controversial topics. GenLayer validators
              run AI judgment under consensus to evaluate argument quality.
              Build your deliberation reputation on-chain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="flex flex-wrap items-center gap-4"
            >
              {!isConnected ? (
                <motion.button
                  onClick={onConnect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 px-8 py-4 bg-ink-900 text-paper-100 font-display font-semibold text-sm tracking-wide hover:bg-ink-800 transition-colors"
                >
                  Connect wallet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ) : (
                <motion.a
                  href="#debates"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-3 px-8 py-4 bg-cobalt text-white font-display font-semibold text-sm tracking-wide hover:bg-cobalt-light transition-colors"
                >
                  Enter the forum
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              )}
              <a
                href="#how-it-works"
                className="text-sm text-ink-600 underline underline-offset-4 hover:text-ink-900 transition-colors"
              >
                How it works
              </a>
            </motion.div>
          </div>

          {/* Right column: status panel with staggered assembly */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:col-start-8"
          >
            <div className="border border-paper-300 bg-paper-50/80 backdrop-blur-sm p-6 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.4 }}
                className="flex items-center justify-between"
              >
                <span className="label-micro">Network status</span>
                <span className="flex items-center gap-1.5 text-xs text-success font-mono">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-subtle" />
                  Live
                </span>
              </motion.div>

              <div className="grid-rule-h" />

              <div className="space-y-4">
                {statusRows.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.5 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <span className="label-micro">{row.label}</span>
                    <p className={`${row.mono ? 'font-mono text-xs' : 'font-display text-sm font-medium'} mt-1 ${row.muted ? 'text-ink-500' : ''}`}>
                      {row.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="grid-rule-h" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 2.0 }}
                className="flex items-center gap-2 text-xs text-ink-500"
              >
                <span>Faucet:</span>
                <a
                  href="https://testnet-faucet.genlayer.foundation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cobalt hover:underline flex items-center gap-1"
                >
                  Claim test GEN
                  <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom edge rule */}
      <div className="absolute bottom-0 left-0 right-0 border-b border-paper-300" />
    </section>
  )
}
