'use client'

import { Download, Settings, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: Download,
    number: '01',
    title: 'Install Extension',
    description: 'Add Agentic Advocate to Chrome from the Web Store or load it as an unpacked extension.',
    color: 'text-neon-cyan'
  },
  {
    icon: Settings,
    number: '02',
    title: 'Configure AI',
    description: 'Enable Gemini Nano for local processing or use remote fallback based on your preference.',
    color: 'text-neon-purple'
  },
  {
    icon: Zap,
    number: '03',
    title: 'Start Automating',
    description: 'Use AI chat, analyze documents, auto-fill forms, and get legal assistance on any webpage.',
    color: 'text-neon-green'
  },
  {
    icon: Shield,
    number: '04',
    title: 'Stay Private',
    description: 'All processing happens locally on your device. Your data never leaves your computer.',
    color: 'text-neon-pink'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative bg-gradient-to-b from-background to-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="neon-text">How It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with Agentic Advocate in just a few simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5">
            <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple via-neon-green to-neon-pink opacity-30"></div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Animated number badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full blur-xl"></div>
                    <div className={`relative w-20 h-20 rounded-full logo-glass flex items-center justify-center ${step.color} hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" strokeWidth={2} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full glass-panel border border-white/20 flex items-center justify-center text-xs font-bold neon-text">
                      {step.number}
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
