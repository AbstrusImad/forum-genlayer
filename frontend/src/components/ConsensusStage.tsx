'use client'

import { motion } from 'framer-motion'
import { Check, Clock, RotateCcw } from 'lucide-react'

interface ConsensusStageProps {
  status: string
  draft: { decision: string; score?: number; note?: string } | null
}

const STAGES = [
  { key: 'PENDING', label: 'Submitted' },
  { key: 'PROPOSING', label: 'Leader drafting' },
  { key: 'COMMITTING', label: 'Validators re-running' },
  { key: 'REVEALING', label: 'Consensus sealing' },
  { key: 'ACCEPTED', label: 'Confirmed' },
]

const STATUS_ORDER = STAGES.map(s => s.key)

function getStageIndex(status: string): number {
  if (status === 'FINALIZED') return STAGES.length - 1
  const idx = STATUS_ORDER.indexOf(status)
  return idx >= 0 ? idx : 0
}

export function ConsensusStage({ status, draft }: ConsensusStageProps) {
  const currentIdx = getStageIndex(status)
  const isTimeout = status === 'LEADER_TIMEOUT' || status === 'VALIDATORS_TIMEOUT'
  const isUndetermined = status === 'UNDETERMINED'
  const isCanceled = status === 'CANCELED'
  const isTerminal = isUndetermined || isCanceled

  return (
    <div className="border border-paper-300 bg-paper-50 p-6">
      {/* Stage header */}
      <div className="flex items-center justify-between mb-6">
        <span className="label-micro">Consensus progress</span>
        <span className="font-mono text-xs text-ink-500">{status}</span>
      </div>

      {/* Progress bar */}
      <div className="space-y-4">
        {/* Step indicators */}
        <div className="flex items-center gap-1">
          {STAGES.map((stage, i) => {
            const completed = i < currentIdx
            const active = i === currentIdx
            const Icon = completed ? Check : active ? Clock : null

            return (
              <div key={stage.key} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-center">
                  <div
                    className={`w-7 h-7 flex items-center justify-center text-xs border-2 transition-colors ${
                      completed
                        ? 'bg-success border-success text-white'
                        : active
                        ? 'border-cobalt text-cobalt bg-cobalt/5'
                        : 'border-paper-300 text-ink-500'
                    }`}
                  >
                    {Icon ? (
                      <Icon className="w-3.5 h-3.5" />
                    ) : (
                      <span className="font-mono">{i + 1}</span>
                    )}
                  </div>
                  {i < STAGES.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-1 transition-colors ${
                        i < currentIdx ? 'bg-success' : 'bg-paper-300'
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] font-mono text-center leading-tight ${
                    active ? 'text-cobalt' : completed ? 'text-success' : 'text-ink-500'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Timeout info */}
        {isTimeout && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20"
          >
            <RotateCcw className="w-4 h-4 text-warning animate-spin" />
            <span className="text-xs text-ink-600">
              Validators rotating leader. The network retries automatically. Still working.
            </span>
          </motion.div>
        )}

        {/* Error states */}
        {isTerminal && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 bg-danger/10 border border-danger/20"
          >
            <span className="text-xs text-ink-600">
              {isUndetermined
                ? 'Validators could not reach agreement. The transaction was not confirmed.'
                : 'The transaction was canceled.'}
            </span>
          </motion.div>
        )}

        {/* Leader draft preview */}
        {draft && !isTerminal && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid-rule-h pt-4"
          >
            <span className="label-micro mb-2 block">Leader draft (preview)</span>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-500">Decision:</span>
                <span
                  className={`font-mono text-xs font-medium ${
                    draft.decision === 'ACCEPT'
                      ? 'text-success'
                      : draft.decision === 'REJECT'
                      ? 'text-danger'
                      : 'text-cobalt'
                  }`}
                >
                  {draft.decision}
                </span>
              </div>
              {draft.score !== undefined && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-500">Score:</span>
                  <span className="font-mono text-xs tabular">{draft.score}/100</span>
                </div>
              )}
              {draft.note && (
                <p className="text-xs text-ink-600 italic leading-relaxed">
                  &ldquo;{draft.note}&rdquo;
                </p>
              )}
              <p className="text-[10px] text-ink-500 font-mono">
                Sealing under consensus. Final result may differ.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
