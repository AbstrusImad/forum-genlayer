'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Brain, Scale, BarChart3 } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Submit a position',
    description: 'Choose a debate topic and submit your argument. Keep it concise, evidence-based, and under 600 characters.',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI evaluation',
    description: 'A leader validator runs AI judgment on your argument, scoring it on reasoning quality, relevance, and evidence.',
  },
  {
    number: '03',
    icon: Scale,
    title: 'Consensus reached',
    description: 'Multiple validators re-run the evaluation. Agreement on the decision confirms the verdict on-chain.',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Reputation builds',
    description: 'Your scores accumulate across debates. High-quality deliberation earns a verifiable on-chain reputation.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-b border-paper-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="label-micro mb-3 block">Process</span>
          <h2 className="display-lg text-3xl sm:text-4xl lg:text-5xl text-ink-900">
            How the forum works
          </h2>
        </motion.div>

        {/* Horizontal step rail */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px bg-paper-300" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Step marker */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 border-2 border-ink-900 flex items-center justify-center bg-paper-100 relative z-10">
                    <span className="font-display text-sm font-bold">{step.number}</span>
                  </div>
                  <div className="w-8 h-8 border border-paper-300 flex items-center justify-center text-ink-500">
                    <step.icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-lg mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-ink-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
