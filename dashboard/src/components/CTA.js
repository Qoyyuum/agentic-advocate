'use client'

import { Button } from './ui/button'
import { Download, Github, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-background to-neon-purple/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-12 rounded-2xl border-2 border-white/12 text-center"
        >
          {/* Sparkles icon */}
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            whileInView={{ rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-neon-cyan/30 rounded-full blur-2xl"></div>
              <div className="relative logo-glass p-4 rounded-2xl animate-glow">
                <Sparkles className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Ready to Transform Your <br />
            <span className="neon-text text-glow">Legal Workflow?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Join thousands using Agentic Advocate for privacy-first legal automation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <a href="https://github.com/Qoyyuum/agentic-advocate/releases/download/v1.0.0-beta/extension-v1.0.0-beta.zip" target="_blank" rel="noopener noreferrer">
            <Button variant="neon" size="lg" className="gap-2 text-base">
              <Download className="w-5 h-5" />
              Install Now - It's Free
            </Button>
            </a>
            <a href="https://github.com/Qoyyuum/agentic-advocate" target="_blank" rel="noopener noreferrer">
            <Button variant="glass" size="lg" className="gap-2 text-base">
              <Github className="w-5 h-5" />
              View on GitHub
            </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
              Chrome AI Challenge 2025
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"></div>
              Open Source
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
              No Signup Required
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
