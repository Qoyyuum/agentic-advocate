'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
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

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-background to-neon-purple/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 neon-text">How It Works</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started with Agentic Advocate in just a few simple steps.
            </p>
          </motion.div>

          <div className="space-y-12 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-24 left-[50%] right-[50%] h-0.5 transform -translate-x-1/2">
              <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple via-neon-green to-neon-pink opacity-30 w-full"></div>
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Animated number badge */}
                  <div className="flex-shrink-0 relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full blur-xl"></div>
                      <div className={`relative w-24 h-24 rounded-full logo-glass flex items-center justify-center ${step.color} hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-10 h-10 drop-shadow-[0_0_8px_currentColor]" strokeWidth={2} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full glass-panel border border-white/20 flex items-center justify-center text-xs font-bold neon-text">
                        {step.number}
                      </div>
                    </motion.div>
                  </div>

                  <div className={`text-center md:text-${index % 2 === 0 ? 'left' : 'right'} flex-grow`}>
                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}