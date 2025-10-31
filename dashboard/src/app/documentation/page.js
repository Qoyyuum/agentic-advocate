'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FileText, BookOpen, Chrome, Bot, Code } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DocumentationPage() {
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
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <div className="logo-glass p-4 rounded-2xl animate-glow">
                <BookOpen className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 neon-text">Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides and resources for Agentic Advocate Chrome Extension
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl border-2 border-white/12 space-y-8"
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <FileText className="w-6 h-6 text-neon-cyan" />
                Getting Started
              </h2>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Agentic Advocate is a Chrome extension that provides AI-powered legal assistance using Chrome's Built-in AI (Gemini Nano) with privacy-first design. This documentation covers installation, configuration, and usage of all features.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <div className="flex items-center gap-3 mb-4">
                      <Chrome className="w-5 h-5 text-neon-cyan" />
                      <h3 className="font-semibold text-lg">Extension Setup</h3>
                    </div>
                    <p>
                      Install the extension from Chrome Web Store or load it as an unpacked extension for development. Follow the setup wizard to configure your preferences.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <div className="flex items-center gap-3 mb-4">
                      <Bot className="w-5 h-5 text-neon-purple" />
                      <h3 className="font-semibold text-lg">AI Configuration</h3>
                    </div>
                    <p>
                      Configure AI processing mode (local Gemini Nano or remote fallback). The extension defaults to local processing for maximum privacy.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <div className="flex items-center gap-3 mb-4">
                      <Code className="w-5 h-5 text-neon-green" />
                      <h3 className="font-semibold text-lg">Developer Guide</h3>
                    </div>
                    <p>
                      For developers, this section covers the extension architecture, API integration, and customization options for advanced users.
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-neon-pink" />
                      <h3 className="font-semibold text-lg">Feature Reference</h3>
                    </div>
                    <p>
                      Detailed documentation on all features including document analysis, legal workflows, tax planning, and form auto-filling capabilities.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-white/10">
                  <h3 className="font-semibold text-lg mb-3 text-foreground">Quick Start Guide</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Install the extension from Chrome Web Store</li>
                    <li>Click the extension icon to open the popup</li>
                    <li>Configure AI processing in the settings (recommended: Local/Gemini Nano)</li>
                    <li>Start using features like document analysis, legal summarization, or tax planning</li>
                    <li>Use the context menu option "Analyze with Agentic Advocate" on any webpage text</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}