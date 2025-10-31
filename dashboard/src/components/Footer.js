'use client'

import { Bot, Github, Twitter, MessageCircle, FileText, BookOpen, Shield, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer id="about" className="relative border-t border-white/12">
      {/* Glass effect background */}
      <div className="absolute inset-0 glass-panel"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="logo-glass p-2 rounded-xl">
                <Bot className="w-7 h-7 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" strokeWidth={2} />
              </div>
              <span className="text-xl font-bold neon-text">Agentic Advocate</span>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              AI-powered legal assistant using Chrome Built-in AI.
              Privacy-first, offline-capable, and open source.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
              <span className="text-muted-foreground">Built for Chrome AI Challenge 2025</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors group">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors group">
                  <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Qoyyuum/agentic-advocate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors group"
                >
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-neon-cyan transition-colors group">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Documentation
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://developer.chrome.com/docs/ai/built-in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-neon-purple transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Chrome AI Docs
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-neon-purple transition-colors group">
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-neon-purple transition-colors group">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-neon-purple transition-colors group">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  License
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-white/12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-muted-foreground text-sm">
            © 2025 Agentic Advocate. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/Qoyyuum/agentic-advocate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-neon-cyan transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
