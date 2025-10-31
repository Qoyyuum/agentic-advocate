'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Bot, Scale, DollarSign, Lock, FileText, Mic, PenTool, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Bot,
    title: 'Chrome Built-in AI',
    description: 'Powered by Gemini Nano for on-device processing with complete privacy.',
    color: 'text-neon-cyan'
  },
  {
    icon: Scale,
    title: 'Legal Workflows',
    description: 'Document proofing, compliance automation, and RTI/complaint form autofill.',
    color: 'text-neon-purple'
  },
  {
    icon: DollarSign,
    title: 'Tax Planning',
    description: 'Context-aware salary structure analysis and tax optimization suggestions.',
    color: 'text-neon-green'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'All data stored locally with IndexedDB. No cloud uploads, ever.',
    color: 'text-neon-pink'
  },
  {
    icon: FileText,
    title: 'Document Management',
    description: 'Legal research, storage, and intelligent search across all your documents.',
    color: 'text-neon-cyan'
  },
  {
    icon: Mic,
    title: 'Multimodal Input',
    description: 'Audio-to-text transcription and image analysis for comprehensive assistance.',
    color: 'text-neon-purple'
  },
  {
    icon: PenTool,
    title: 'Auto-Fill Forms',
    description: 'Automatically detect and fill legal, compliance, and government forms.',
    color: 'text-neon-green'
  },
  {
    icon: MessageSquare,
    title: 'Persistent Chat',
    description: 'Continuous conversation memory for context-aware legal assistance.',
    color: 'text-neon-pink'
  }
]

export default function FeaturesPage() {
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

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 neon-text">Features</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for legal, compliance, and tax automation in one privacy-focused extension.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="glass-panel p-6 rounded-2xl border border-white/12 h-full group hover:glass-panel-hover transition-all duration-300">
                    <div className={`${feature.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
                      <div className="p-3 rounded-xl bg-opacity-10 inline-block" style={{backgroundColor: `rgba(0, 240, 255, 0.1)`}}>
                        <Icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" strokeWidth={2} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
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