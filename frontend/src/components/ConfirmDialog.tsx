'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  // Escape key handler
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  // Focus trap: move focus into dialog on open, restore on close
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement
      // Focus the cancel button (first interactive element)
      setTimeout(() => {
        dialogRef.current?.querySelector<HTMLElement>('button')?.focus()
      }, 50)
    } else if (previousFocus.current) {
      previousFocus.current.focus()
      previousFocus.current = null
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm cursor-default"
            onClick={onCancel}
            aria-label="Close dialog"
            tabIndex={-1}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative bg-paper-50 border border-paper-300 p-6 max-w-md w-full shadow-xl"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-ink-500 hover:text-ink-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-warning/40 flex items-center justify-center shrink-0" aria-hidden="true">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 id="confirm-dialog-title" className="font-display font-semibold text-lg tracking-tight mb-2">
                  {title}
                </h3>
                <p id="confirm-dialog-message" className="text-sm text-ink-600 leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                disabled={loading}
                className="px-5 py-2.5 text-sm text-ink-600 hover:text-ink-900 border border-paper-300 hover:border-ink-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                aria-busy={loading}
                className="px-5 py-2.5 text-sm font-medium bg-cobalt text-white hover:bg-cobalt-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {loading ? 'Processing...' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
