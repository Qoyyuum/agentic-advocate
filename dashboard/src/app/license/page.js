'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FileText, Code, Shield, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LicensePage() {
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
                <Code className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 neon-text">License</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Open Source License Information for Agentic Advocate Extension
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
                Open Source License
              </h2>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Agentic Advocate is an open source project licensed under the MIT License. This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, under certain conditions.
                </p>

                <div className="glass-panel p-6 rounded-xl border border-white/12">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-cyan">
                    <Code className="w-5 h-5" strokeWidth={2} /> MIT License
                  </h3>
                  <p className="font-mono text-sm leading-relaxed">
                    Copyright (c) 2025 Agentic Advocate<br /><br />

                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:<br /><br />

                    The above copyright notice and this permission notice shall be included in all
                    copies or substantial portions of the Software.<br /><br />

                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                    SOFTWARE.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-neon-purple" />
                      <h3 className="font-semibold text-lg">Permissions</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Commercial use</li>
                      <li>Modification</li>
                      <li>Distribution</li>
                      <li>Private use</li>
                    </ul>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-5 h-5 text-neon-green" />
                      <h3 className="font-semibold text-lg">Conditions</h3>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      <li>License and copyright notice</li>
                      <li>Same license requirement for distributed modifications</li>
                    </ul>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-white/12 mt-6">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-pink">
                    <BookOpen className="w-5 h-5" strokeWidth={2} /> Third-Party Libraries
                  </h3>
                  <p>
                    Agentic Advocate uses various open source libraries and dependencies. These components have their own licenses, which are incorporated by reference. The primary dependencies include:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>React and React DOM (MIT License)</li>
                    <li>Framer Motion (MIT License)</li>
                    <li>Lucide React (MIT License)</li>
                    <li>Tailwind CSS (MIT License)</li>
                    <li>Next.js (MIT License)</li>
                  </ul>
                  
                  <div className="mt-4 p-4 rounded-lg bg-background/50 border border-white/10 text-sm">
                    <p className="font-semibold mb-2 text-foreground">Attribution</p>
                    <p>This software includes components from various open source projects, each under their respective licenses.</p>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground italic pt-8 border-t border-white/10">
                  The Agentic Advocate extension is released as open source software under the MIT License. The source code is available on GitHub for review and contribution.
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