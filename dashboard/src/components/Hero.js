'use client'

import { Button } from './ui/button'
import { Download, BookOpen, Shield, Wifi, Code, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-card/50">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-cyan/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-neon-purple/10 via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Avatar/Icon representation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative logo-glass p-6 rounded-2xl animate-glow">
                <Sparkles className="w-16 h-16 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          >
            Your AI-Powered <br />
            <span className="neon-text text-glow">Legal Assistant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            Automate legal, compliance, and tax tasks with Chrome's Built-in AI.
            Privacy-first, offline-capable, and powered by Gemini Nano.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="https://github.com/Qoyyuum/agentic-advocate/releases/download/v1.0.0-beta/extension-v1.0.0-beta.zip" target="_blank" rel="noopener noreferrer">
            <Button variant="neon" size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              Install Extension
            </Button>
            </a>
            <Button variant="glass" size="lg" className="gap-2">
              <BookOpen className="w-5 h-5" />
              Learn More
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="glass-panel p-6 rounded-xl border border-white/12">
              <Shield className="w-8 h-8 text-neon-cyan mx-auto mb-3 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
              <span className="text-sm font-medium text-foreground">100% Privacy-First</span>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-white/12">
              <Wifi className="w-8 h-8 text-neon-purple mx-auto mb-3 drop-shadow-[0_0_8px_rgba(157,78,221,0.6)]" />
              <span className="text-sm font-medium text-foreground">Offline Capable</span>
            </div>
            <div className="glass-panel p-6 rounded-xl border border-white/12">
              <Code className="w-8 h-8 text-neon-green mx-auto mb-3 drop-shadow-[0_0_8px_rgba(0,255,133,0.6)]" />
              <span className="text-sm font-medium text-foreground">Free & Open Source</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
