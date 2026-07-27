'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ExternalLink } from 'lucide-react'
import { useWallet } from '@/hooks/useWallet'
import { shortAddr, shortHash } from '@/lib/format'
import { EXPLORER, CONTRACT_ADDRESS, HAS_CONTRACT } from '@/lib/contract'

interface HeaderProps {
  wallet: ReturnType<typeof useWallet>
}

export function Header({ wallet }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    })
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper-100/90 backdrop-blur-sm border-b border-paper-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border-2 border-ink-900 flex items-center justify-center">
            <span className="font-display text-sm font-bold tracking-tighter">F</span>
          </div>
          <span className="font-display text-lg font-bold tracking-tight hidden sm:inline">
            FORUM
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-ink-600 hover:text-ink-900 transition-colors">
            How it works
          </a>
          <a href="#debates" className="text-sm text-ink-600 hover:text-ink-900 transition-colors">
            Debates
          </a>
          <a
            href="https://docs.genlayer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-1"
          >
            Docs
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>

        {/* Right side: network + wallet */}
        <div className="flex items-center gap-3">
          {/* Network badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-paper-300 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                wallet.isCorrectChain ? 'bg-success' : 'bg-warning'
              }`}
            />
            <span className="font-mono text-ink-600">
              {wallet.isCorrectChain ? 'Bradbury' : 'Wrong network'}
            </span>
          </div>

          {/* Wallet */}
          {wallet.address ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-ink-900 text-paper-100 text-sm font-medium hover:bg-ink-800 transition-colors"
                aria-label="Wallet menu"
              >
                <span className="w-2 h-2 rounded-full bg-cobalt" />
                <span className="font-mono text-xs">{shortAddr(wallet.address)}</span>
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-paper-50 border border-paper-300 shadow-lg p-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <span className="label-micro">Address</span>
                        <button
                          onClick={() => copyToClipboard(wallet.address!, 'address')}
                          className="block w-full text-left font-mono text-sm text-ink-900 hover:text-cobalt transition-colors"
                        >
                          {copied === 'address' ? 'Copied' : wallet.address}
                        </button>
                      </div>
                      <div>
                        <span className="label-micro">Balance</span>
                        <p className="font-mono text-sm tabular">
                          {wallet.balance ?? '...'} GEN
                        </p>
                      </div>
                      {HAS_CONTRACT && (
                        <div>
                          <span className="label-micro">Contract</span>
                          <button
                            onClick={() => copyToClipboard(CONTRACT_ADDRESS, 'contract')}
                            className="block w-full text-left font-mono text-xs text-cobalt hover:underline"
                          >
                            {copied === 'contract' ? 'Copied' : shortAddr(CONTRACT_ADDRESS)}
                          </button>
                        </div>
                      )}
                      <div className="grid-rule-h pt-3">
                        <button
                          onClick={() => {
                            wallet.disconnect()
                            setMenuOpen(false)
                          }}
                          className="w-full text-left text-sm text-danger hover:underline"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="px-4 py-1.5 bg-cobalt text-white text-sm font-medium hover:bg-cobalt-light transition-colors disabled:opacity-50"
            >
              {wallet.connecting ? 'Connecting...' : 'Connect'}
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-ink-600 hover:text-ink-900"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && !wallet.address && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-paper-300 bg-paper-50 overflow-hidden"
          >
            <nav className="px-6 py-4 flex flex-col gap-3">
              <a href="#how-it-works" className="text-sm text-ink-600 py-2">How it works</a>
              <a href="#debates" className="text-sm text-ink-600 py-2">Debates</a>
              <a
                href="https://docs.genlayer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-600 py-2 flex items-center gap-1"
              >
                Docs <ExternalLink className="w-3 h-3" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
