'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { HAS_CONTRACT } from '@/lib/contract'

interface HeroProps {
  onConnect: () => void
  isConnected: boolean
}

export function Hero({ onConnect, isConnected }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let w = 0
    let h = 0

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

    let time = 0
    let lastFrame = performance.now()
    const gridSpacing = 48

    function draw(now: number) {
      if (!ctx) return
      const dt = (now - lastFrame) / 1000
      lastFrame = now
      time += dt * 0.18
      ctx.clearRect(0, 0, w, h)

      // Draw grid
      ctx.strokeStyle = '#d4d0c4'
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.4

      for (let x = 0; x <= w; x += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y <= h; y += gridSpacing) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Animated crosshair
      ctx.globalAlpha = 1
      const cx = w * 0.72 + Math.sin(time) * 30
      const cy = h * 0.45 + Math.cos(time * 0.7) * 20
      const armLen = 60

      ctx.strokeStyle = '#2945c9'
      ctx.lineWidth = 1

      // Horizontal arm
      ctx.beginPath()
      ctx.moveTo(cx - armLen, cy)
      ctx.lineTo(cx + armLen, cy)
      ctx.stroke()

      // Vertical arm
      ctx.beginPath()
      ctx.moveTo(cx, cy - armLen)
      ctx.lineTo(cx, cy + armLen)
      ctx.stroke()

      // Center dot
      ctx.fillStyle = '#2945c9'
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fill()

      // Coordinate labels
      ctx.font = '10px "IBM Plex Mono", monospace'
      ctx.fillStyle = '#56565e'
      ctx.globalAlpha = 0.7
      ctx.fillText(`x:${Math.round(cx)}`, cx + armLen + 8, cy + 4)
      ctx.fillText(`y:${Math.round(cy)}`, cx - 12, cy - armLen - 8)

      // Second crosshair (slower)
      const cx2 = w * 0.28 + Math.cos(time * 0.5) * 15
      const cy2 = h * 0.65 + Math.sin(time * 0.3) * 10
      ctx.strokeStyle = '#2945c9'
      ctx.globalAlpha = 0.3
      ctx.lineWidth = 0.5

      ctx.beginPath()
      ctx.moveTo(cx2 - 30, cy2)
      ctx.lineTo(cx2 + 30, cy2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx2, cy2 - 30)
      ctx.lineTo(cx2, cy2 + 30)
      ctx.stroke()

      animRef.current = requestAnimationFrame(draw)
    }

    // Visibility API: pause when tab is hidden
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
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated crosshair canvas */}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="label-micro mb-6 block">
                AI-Moderated Deliberation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="display-xl text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-ink-900 mb-6"
            >
              Arguments
              <br />
              judged by
              <br />
              <span className="text-cobalt">consensus.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-ink-600 text-lg max-w-xl mb-10 leading-relaxed"
            >
              Submit positions on controversial topics. GenLayer validators
              run AI judgment under consensus to evaluate argument quality.
              Build your deliberation reputation on-chain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              {!isConnected ? (
                <button
                  onClick={onConnect}
                  className="group flex items-center gap-3 px-8 py-4 bg-ink-900 text-paper-100 font-display font-semibold text-sm tracking-wide hover:bg-ink-800 transition-colors"
                >
                  Connect wallet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <a
                  href="#debates"
                  className="group flex items-center gap-3 px-8 py-4 bg-cobalt text-white font-display font-semibold text-sm tracking-wide hover:bg-cobalt-light transition-colors"
                >
                  Enter the forum
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              )}
              <a
                href="#how-it-works"
                className="text-sm text-ink-600 underline underline-offset-4 hover:text-ink-900 transition-colors"
              >
                How it works
              </a>
            </motion.div>
          </div>

          {/* Right column: status panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="lg:col-span-5 lg:col-start-8"
          >
            <div className="border border-paper-300 bg-paper-50/80 backdrop-blur-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="label-micro">Network status</span>
                <span className="flex items-center gap-1.5 text-xs text-success font-mono">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-subtle" />
                  Live
                </span>
              </div>

              <div className="grid-rule-h" />

              <div className="space-y-4">
                <div>
                  <span className="label-micro">Network</span>
                  <p className="font-display text-sm font-medium mt-1">GenLayer Bradbury Testnet</p>
                </div>
                <div>
                  <span className="label-micro">Chain ID</span>
                  <p className="font-mono text-sm tabular mt-1">4221</p>
                </div>
                <div>
                  <span className="label-micro">Consensus</span>
                  <p className="text-sm mt-1">AI judgment under validator agreement</p>
                </div>
                <div>
                  <span className="label-micro">Contract</span>
                  <p className="font-mono text-xs mt-1 text-ink-500">
                    {HAS_CONTRACT ? 'Deployed and active' : 'Not configured (see README)'}
                  </p>
                </div>
              </div>

              <div className="grid-rule-h" />

              <div className="flex items-center gap-2 text-xs text-ink-500">
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom edge rule */}
      <div className="absolute bottom-0 left-0 right-0 border-b border-paper-300" />
    </section>
  )
}
