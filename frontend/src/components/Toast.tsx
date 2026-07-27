'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, Loader2, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'loading' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  title: string
  message?: string
  hash?: string
  explorerUrl?: string
  persistent?: boolean
}

interface ToastProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

const ICONS: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  loading: Loader2,
  info: Info,
}

const COLORS: Record<ToastType, string> = {
  success: 'text-success border-success/30',
  error: 'text-danger border-danger/30',
  loading: 'text-cobalt border-cobalt/30',
  info: 'text-ink-600 border-paper-300',
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const Icon = ICONS[toast.type]
  const colorClass = COLORS[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-paper-50 border ${colorClass.split(' ')[1]} p-4 shadow-lg flex gap-3`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colorClass.split(' ')[0]} ${toast.type === 'loading' ? 'animate-spin' : ''}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-900">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-ink-600 mt-1 leading-relaxed">{toast.message}</p>
        )}
        {toast.hash && toast.explorerUrl && (
          <a
            href={toast.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cobalt hover:underline font-mono mt-1.5 inline-block"
          >
            {toast.hash.slice(0, 10)}...{toast.hash.slice(-8)}
          </a>
        )}
      </div>
      {toast.type !== 'loading' && (
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 text-ink-500 hover:text-ink-900 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )
}

export function ToastStack({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
