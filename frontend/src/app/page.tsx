'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Users, Shield, ExternalLink } from 'lucide-react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { EmptyState } from '@/components/EmptyState'
import { Footer } from '@/components/Footer'
import { ToastStack, type ToastData } from '@/components/Toast'
import { useWallet } from '@/hooks/useWallet'
import { FAUCET_URL } from '@/lib/contract'

export default function HomePage() {
  const wallet = useWallet()
  const [toasts, setToasts] = useState<ToastData[]>([])
  const toastId = useRef(0)

  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = String(++toastId.current)
    setToasts(prev => [...prev, { ...toast, id }])

    if (toast.type !== 'loading' && !toast.persistent) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 8000)
    }
    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Surface wallet errors as toasts
  useEffect(() => {
    if (wallet.error) {
      addToast({ type: 'error', title: wallet.error })
    }
  }, [wallet.error, addToast])

  return (
    <>
      <Header wallet={wallet} />

      <main id="main-content">
        <Hero
          onConnect={wallet.connect}
          isConnected={!!wallet.address}
        />

        <HowItWorks />

        {/* Features section: two-column editorial */}
        <section className="py-24 border-b border-paper-300">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left column */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-5"
              >
                <span className="label-micro mb-4 block">Architecture</span>
                <h2 className="display-lg text-3xl sm:text-4xl text-ink-900 mb-6">
                  No backend.
                  <br />
                  The contract
                  <br />
                  <span className="text-cobalt">is</span> the backend.
                </h2>
                <p className="text-ink-600 leading-relaxed mb-8">
                  On GenLayer, there are no servers, no databases, no API keys.
                  State, business logic, and AI judgment all live inside the
                  Intelligent Contract under validator consensus. The frontend
                  is a static SPA that talks directly to the chain.
                </p>
                <a
                  href="https://docs.genlayer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-cobalt hover:underline"
                >
                  Read the GenLayer docs
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>

              {/* Right column: editorial feature list */}
              <div className="lg:col-span-6 lg:col-start-7">
                <div className="border-t-2 border-ink-900">
                  {[
                    {
                      number: 'A',
                      icon: Zap,
                      title: 'AI under consensus',
                      text: 'The LLM judgment is re-run by multiple validators. Agreement on the decision confirms the verdict on-chain, not on one server.',
                    },
                    {
                      number: 'B',
                      icon: Shield,
                      title: 'Injection resistant',
                      text: 'User text is capped and treated as untrusted data. The AI prompt enforces strict rules that nothing in user input can override.',
                    },
                    {
                      number: 'C',
                      icon: Users,
                      title: 'Open deliberation',
                      text: 'Anyone can submit arguments. The contract evaluates quality based on reasoning, evidence, and relevance. No gatekeeping.',
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      className="grid grid-cols-[3rem_1fr] gap-x-5 py-7 border-b border-paper-300 group"
                    >
                      <span className="font-display text-3xl font-bold text-paper-300 group-hover:text-cobalt transition-colors leading-none select-none">
                        {feature.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <feature.icon className="w-4 h-4 text-ink-500 group-hover:text-cobalt transition-colors" />
                          <h3 className="font-display font-semibold text-base tracking-tight">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm text-ink-600 leading-relaxed">
                          {feature.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-24 border-b border-paper-300 bg-ink-900 text-paper-100">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-paper-100/70 mb-4 block">
                Get started
              </span>
              <h2 className="display-xl text-4xl sm:text-5xl lg:text-6xl text-paper-100 mb-6">
                Ready to
                <br />
                deliberate.
              </h2>
              <p className="text-paper-100/60 text-lg leading-relaxed mb-10">
                Connect your wallet to the GenLayer Bradbury testnet. Claim
                test GEN from the faucet. Submit your first argument and watch
                validators reach consensus on its quality.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                {!wallet.address ? (
                  <button
                    onClick={wallet.connect}
                    disabled={wallet.connecting}
                    className="group flex items-center gap-3 px-8 py-4 bg-paper-100 text-ink-900 font-display font-semibold text-sm tracking-wide hover:bg-paper-200 transition-colors disabled:opacity-50"
                  >
                    {wallet.connecting ? 'Connecting...' : 'Connect wallet'}
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
                  href={FAUCET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-paper-100/20 text-sm text-paper-100/70 hover:text-paper-100 hover:border-paper-100/50 transition-colors"
                >
                  Claim test GEN
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <EmptyState />
      </main>

      <Footer />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
