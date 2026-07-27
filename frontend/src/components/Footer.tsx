'use client'

import { ExternalLink } from 'lucide-react'
import { CONTRACT_ADDRESS, EXPLORER, FAUCET_URL, HAS_CONTRACT } from '@/lib/contract'
import { shortAddr } from '@/lib/format'

export function Footer() {
  return (
    <footer className="border-t border-paper-300 bg-paper-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 border-2 border-ink-900 flex items-center justify-center">
                <span className="font-display text-xs font-bold tracking-tighter">F</span>
              </div>
              <span className="font-display text-base font-bold tracking-tight">FORUM</span>
            </div>
            <p className="text-sm text-ink-600 leading-relaxed max-w-xs">
              AI-moderated debate platform built on GenLayer. Argument quality
              judged under validator consensus.
            </p>
          </div>

          {/* Resources */}
          <div>
            <span className="label-micro mb-4 block">Resources</span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://docs.genlayer.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-1"
                >
                  GenLayer docs
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/firstbatchxyz/genlayer-js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-1"
                >
                  genlayer-js
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={EXPLORER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-1"
                >
                  Block explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Network */}
          <div>
            <span className="label-micro mb-4 block">Network</span>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={FAUCET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-600 hover:text-ink-900 transition-colors flex items-center gap-1"
                >
                  Testnet faucet
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-sm text-ink-500">Bradbury Testnet</span>
              </li>
              <li>
                <span className="font-mono text-xs text-ink-500">Chain ID: 4221</span>
              </li>
            </ul>
          </div>

          {/* Contract */}
          <div>
            <span className="label-micro mb-4 block">Contract</span>
            {HAS_CONTRACT ? (
              <div className="space-y-2.5">
                <a
                  href={`${EXPLORER}/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cobalt hover:underline font-mono flex items-center gap-1"
                >
                  {shortAddr(CONTRACT_ADDRESS)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <span className="text-sm text-ink-500">Not configured</span>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="grid-rule-h mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-ink-500">
            Built on GenLayer. No tokens required beyond network fees.
          </span>
          <span className="text-xs text-ink-500 font-mono">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  )
}
