'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Download, Shield, Zap, Settings, Chrome, CheckCircle, BookOpen, Play, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GetStartedPage() {
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

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <div className="logo-glass p-4 rounded-2xl animate-glow">
                <Chrome className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 neon-text">Get Started with Agentic Advocate</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform your legal workflow with Chrome's Built-in AI. Follow these simple steps to install and use the extension.
            </p>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel p-8 rounded-2xl border-2 border-white/12 mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                <Download className="w-8 h-8 text-neon-cyan" />
                Download the Extension
              </h2>
              <p className="text-lg text-muted-foreground">
                Install Agentic Advocate from the Chrome Web Store or manually in developer mode
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel p-6 rounded-xl border border-white/12">
                <h3 className="text-xl font-semibold mb-4 text-center">Chrome Web Store (Recommended)</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                    <span>Visit the Chrome Web Store</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                    <span>Search for "Agentic Advocate"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                    <span>Click "Add to Chrome" to install</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass-panel p-6 rounded-xl border border-white/12">
                <h3 className="text-xl font-semibold mb-4 text-center">Manual Installation (Developer)</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                    <span>Clone the repository from GitHub</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                    <span>Build the extension using the provided scripts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                    <span>Load unpacked in Chrome Extensions Developer Mode</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <a 
                href="https://chrome.google.com/webstore/detail/agentic-advocate/your-extension-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-bold py-4 px-8 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300 text-lg"
              >
                <Download className="w-5 h-5" />
                Add to Chrome
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* How to Use Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">How to Use Agentic Advocate</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Settings,
                  title: 'Install & Configure',
                  description: 'Once installed, click the extension icon and configure your AI preferences.',
                  color: 'text-neon-cyan'
                },
                {
                  icon: Zap,
                  title: 'Enable AI Processing',
                  description: 'Choose between local (Gemini Nano) or remote fallback processing modes.',
                  color: 'text-neon-purple'
                },
                {
                  icon: Shield,
                  title: 'Privacy First Setup',
                  description: 'Configure privacy settings to ensure all processing happens locally.',
                  color: 'text-neon-green'
                },
                {
                  icon: Play,
                  title: 'Start Using',
                  description: 'Begin with document analysis, legal workflows, or tax planning assistance.',
                  color: 'text-neon-pink'
                }
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="glass-panel p-6 rounded-2xl border border-white/12 h-full group hover:glass-panel-hover transition-all duration-300">
                      <div className={`${step.color} mb-4 transition-transform group-hover:scale-110 duration-300`}>
                        <div className="p-3 rounded-xl bg-opacity-10 inline-block" style={{backgroundColor: `rgba(0, 240, 255, 0.1)`}}>
                          <Icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" strokeWidth={2} />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Detailed Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel p-8 rounded-2xl border-2 border-white/12"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-neon-cyan" />
              Detailed Instructions
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-neon-cyan pl-6 py-2">
                <h3 className="font-semibold text-lg mb-2">1. Installation Process</h3>
                <p className="text-muted-foreground">
                  After installing the extension from the Chrome Web Store, you'll see the Agentic Advocate icon in your Chrome toolbar. 
                  Click on it to open the popup and start using the AI-powered legal assistant.
                </p>
              </div>
              
              <div className="border-l-4 border-neon-purple pl-6 py-2">
                <h3 className="font-semibold text-lg mb-2">2. Initial Configuration</h3>
                <p className="text-muted-foreground">
                  The first time you open the extension, you'll need to configure your AI processing preferences. 
                  We recommend starting with the local processing mode (Gemini Nano) for maximum privacy.
                </p>
              </div>
              
              <div className="border-l-4 border-neon-green pl-6 py-2">
                <h3 className="font-semibold text-lg mb-2">3. Using Legal Features</h3>
                <p className="text-muted-foreground">
                  You can analyze legal documents, get tax planning assistance, and use auto-fill features for forms. 
                  Simply highlight text on any webpage and right-click to use the "Analyze with Agentic Advocate" context menu option.
                </p>
              </div>
              
              <div className="border-l-4 border-neon-pink pl-6 py-2">
                <h3 className="font-semibold text-lg mb-2">4. Privacy & Data Handling</h3>
                <p className="text-muted-foreground">
                  All processing happens locally on your device. Your data never leaves your computer unless you explicitly 
                  choose to connect to external AI services using your own API key in the settings.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}