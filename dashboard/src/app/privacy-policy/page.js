'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Shield, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
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
                <Shield className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 neon-text">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your data privacy and security are our top priorities
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl border-2 border-white/12 space-y-8"
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Data Privacy & Protection</h2>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  At Agentic Advocate, we are committed to protecting your privacy. This Privacy Policy outlines our practices regarding the collection, use, and sharing of information when you use our Chrome Extension for AI-powered legal assistance.
                </p>

                <div className="glass-panel p-6 rounded-xl border border-white/12">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-cyan">
                    <Shield className="w-5 h-5" strokeWidth={2} /> No Data Collection
                  </h3>
                  <p>
                    We do not collect or share any of your personal data with us or any third parties. Your privacy is paramount, and we ensure that no user information is stored, tracked, or transmitted to our servers or any external services managed by us.
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-white/12">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-purple">
                    <Shield className="w-5 h-5" strokeWidth={2} /> AI Data Transmission
                  </h3>
                  <p>
                    The only data transmitted during your use of this extension is sent to your built-in AI (Gemini Nano) or Google's Gemini API, and only when you explicitly provide your Gemini API key in the settings. This happens only when you actively engage with the AI features and consent to using your own API key. We do not receive or store this data.
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-white/12">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-green">
                    <Shield className="w-5 h-5" strokeWidth={2} /> No Tracking, Analytics, or Profiling
                  </h3>
                  <p>
                    We do not use any tracking, analytics, or profiling technologies in our extension. No cookies, web beacons, or similar tracking technologies are used to monitor your usage or create user profiles. Your interaction with the extension remains completely private and local to your device unless you specifically choose to use an external AI service (as described above).
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-white/12">
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-neon-pink">
                    <Mail className="w-5 h-5" strokeWidth={2} /> Contact Us
                  </h3>
                  <p>
                    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: <a href="mailto:privacy@agenticadvocate.com" className="text-neon-cyan hover:underline">privacy@agenticadvocate.com</a>. We are committed to addressing any privacy-related inquiries promptly and transparently.
                  </p>
                </div>

                <p className="text-center text-sm text-muted-foreground italic pt-8 border-t border-white/10">
                  This Privacy Policy is effective as of October 31, 2025. We reserve the right to update this policy, with the latest version always available within the extension and on our website.
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