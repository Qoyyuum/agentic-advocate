'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FileText, Scale, Shield, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TermsOfServicePage() {
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
                <Scale className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 neon-text">Terms of Service</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Legal terms governing your use of Agentic Advocate Chrome Extension
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
                Terms of Service Agreement
              </h2>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  These Terms of Service ("Terms") govern your access to and use of the Agentic Advocate Chrome Extension ("Extension", "Service", "Software") provided by Agentic Advocate. By installing, accessing, or using the Extension, you agree to be bound by these Terms.
                </p>

                <div className="space-y-4">
                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-cyan">
                      <Shield className="w-5 h-5" strokeWidth={2} /> License and Use
                    </h3>
                    <p>
                      Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable license to install and use the Extension for your personal or internal business purposes only. You may not copy, modify, distribute, sell, or lease the Extension or any portion of it.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-purple">
                      <Users className="w-5 h-5" strokeWidth={2} /> User Responsibilities
                    </h3>
                    <p>
                      You are solely responsible for your use of the Extension and any content you input or process. You agree not to use the Extension for any illegal purpose or in violation of applicable laws. You are also responsible for maintaining the confidentiality of any personal information you process through the Extension.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-green">
                      <Shield className="w-5 h-5" strokeWidth={2} /> Data Privacy
                    </h3>
                    <p>
                      Our Privacy Policy, incorporated by reference into these Terms, describes how we collect, use, and share your information. By using the Extension, you consent to such processing in accordance with our Privacy Policy. The Extension is designed to process data locally on your device by default, with options for remote processing if enabled by you.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-pink">
                      <Scale className="w-5 h-5" strokeWidth={2} /> Disclaimer of Warranties
                    </h3>
                    <p>
                      THE EXTENSION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-cyan">
                      <FileText className="w-5 h-5" strokeWidth={2} /> Limitation of Liability
                    </h3>
                    <p>
                      TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL AGENTIC ADVOCATE, ITS AFFILIATES, OR THEIR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR DAMAGES FOR LOSS OF PROFITS, REVENUE, DATA, OR USE.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-xl border border-white/12">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-purple">
                      <Scale className="w-5 h-5" strokeWidth={2} /> Changes to Terms
                    </h3>
                    <p>
                      We may modify these Terms from time to time. If we make material changes, we will provide notice through the Extension or by other means. Your continued use of the Extension after the effective date of the updated Terms constitutes acceptance of the updated Terms.
                    </p>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground italic pt-8 border-t border-white/10">
                  These Terms of Service were last updated on October 31, 2025. Your use of the Extension is subject to the most recent version of these Terms.
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