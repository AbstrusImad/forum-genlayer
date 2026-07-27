'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { FAUCET_URL } from '@/lib/contract'

export function EmptyState() {
  return (
    <section id="debates" className="py-24 border-b border-paper-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="label-micro mb-3 block">Debates</span>
          <h2 className="display-lg text-3xl sm:text-4xl text-ink-900">
            Active discussions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border border-paper-300 bg-paper-50 p-12 sm:p-16 text-center max-w-2xl mx-auto"
        >
          {/* SVG illustration */}
          <div className="mx-auto mb-8 w-32 h-32">
            <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Grid */}
              <line x1="0" y1="32" x2="128" y2="32" stroke="#d4d0c4" strokeWidth="0.5" />
              <line x1="0" y1="64" x2="128" y2="64" stroke="#d4d0c4" strokeWidth="0.5" />
              <line x1="0" y1="96" x2="128" y2="96" stroke="#d4d0c4" strokeWidth="0.5" />
              <line x1="32" y1="0" x2="32" y2="128" stroke="#d4d0c4" strokeWidth="0.5" />
              <line x1="64" y1="0" x2="64" y2="128" stroke="#d4d0c4" strokeWidth="0.5" />
              <line x1="96" y1="0" x2="96" y2="128" stroke="#d4d0c4" strokeWidth="0.5" />

              {/* Crosshair */}
              <line x1="44" y1="64" x2="84" y2="64" stroke="#2945c9" strokeWidth="1.5" />
              <line x1="64" y1="44" x2="64" y2="84" stroke="#2945c9" strokeWidth="1.5" />
              <circle cx="64" cy="64" r="3" fill="#2945c9" />

              {/* Corner marks */}
              <path d="M16 20 L16 16 L20 16" stroke="#0f0f12" strokeWidth="1" fill="none" />
              <path d="M108 16 L112 16 L112 20" stroke="#0f0f12" strokeWidth="1" fill="none" />
              <path d="M16 108 L16 112 L20 112" stroke="#0f0f12" strokeWidth="1" fill="none" />
              <path d="M108 112 L112 112 L112 108" stroke="#0f0f12" strokeWidth="1" fill="none" />
            </svg>
          </div>

          <h3 className="font-display text-xl font-semibold tracking-tight mb-3">
            No contract configured
          </h3>
          <p className="text-ink-600 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            This frontend is ready to connect to a GenLayer Intelligent Contract.
            Deploy the contract and set the address in the environment configuration
            to start reading live debate data from the Bradbury testnet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3 bg-ink-900 text-paper-100 text-sm font-medium hover:bg-ink-800 transition-colors"
            >
              Learn the process
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={FAUCET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-paper-300 text-sm text-ink-600 hover:text-ink-900 hover:border-ink-900 transition-colors"
            >
              Claim test GEN
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
