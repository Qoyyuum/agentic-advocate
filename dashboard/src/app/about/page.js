'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Bot, Code, Users, Globe, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutPage() {
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
            <div className="flex justify-center mb-6">
              <div className="logo-glass p-4 rounded-2xl animate-glow">
                <Bot className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 neon-text">About Agentic Advocate</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionizing legal assistance with AI-powered automation and privacy-first design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-panel p-8 rounded-2xl border border-white/12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-neon-cyan/10">
                  <Sparkles className="w-6 h-6 text-neon-cyan" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Agentic Advocate is designed to democratize access to legal assistance by leveraging Chrome's built-in AI capabilities. 
                We believe that legal tools should be accessible, affordable, and above all, respectful of user privacy. 
                Our mission is to automate routine legal tasks while ensuring your sensitive information remains completely private.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-panel p-8 rounded-2xl border border-white/12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-neon-purple/10">
                  <Code className="w-6 h-6 text-neon-purple" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold">Open Source</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                As a commitment to transparency and community collaboration, Agentic Advocate is completely open source. 
                Developers and users can inspect, verify, and contribute to our codebase. 
                This approach ensures no hidden functionality that could compromise your privacy, and allows for continuous improvements from our community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-panel p-8 rounded-2xl border border-white/12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-neon-green/10">
                  <Globe className="w-6 h-6 text-neon-green" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold">Privacy First</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Privacy is at the core of our design philosophy. All processing happens locally on your device using Chrome's built-in AI. 
                We never store, transmit, or access your personal data. Your legal documents, conversations, and interactions remain completely private to you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-panel p-8 rounded-2xl border border-white/12"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-neon-pink/10">
                  <Users className="w-6 h-6 text-neon-pink" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold">For Everyone</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a legal professional looking to streamline routine tasks, a business trying to maintain compliance, 
                or an individual seeking to better understand legal documents, Agentic Advocate is designed to make legal assistance more accessible 
                and efficient for all users.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-panel p-8 rounded-2xl border border-white/12 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Built for Chrome AI Challenge 2025</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Agentic Advocate was developed as part of the Chrome AI Challenge 2025, showcasing the potential 
              of on-device AI processing for complex tasks like legal assistance while maintaining the highest 
              standards of privacy and security.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}