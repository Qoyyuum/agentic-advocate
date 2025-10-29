'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
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

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="neon-text">Powerful Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for legal, compliance, and tax automation in one privacy-focused extension.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-panel-hover h-full group">
                  <CardHeader>
                    <div className={`${feature.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
                      <div className="p-3 rounded-xl bg-opacity-10 inline-block" style={{backgroundColor: `rgba(0, 240, 255, 0.1)`}}>
                        <Icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" strokeWidth={2} />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
