'use client'

import { Button } from './ui/button'
import { Bot, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="w-8 h-8 text-neon-cyan animate-glow" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold neon-text">Agentic Advocate</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-neon-cyan transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-neon-cyan transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-muted-foreground hover:text-neon-cyan transition-colors">
              About
            </a>
            <a
              href="https://github.com/adi0900/Google_Chrome25"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-neon-cyan transition-colors"
            >
              GitHub
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="neon" size="default" className="hidden md:inline-flex">
              Get Started
            </Button>
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fadeIn">
            <a href="#features" className="block text-muted-foreground hover:text-neon-cyan transition-colors py-2">
              Features
            </a>
            <a href="#how-it-works" className="block text-muted-foreground hover:text-neon-cyan transition-colors py-2">
              How It Works
            </a>
            <a href="#about" className="block text-muted-foreground hover:text-neon-cyan transition-colors py-2">
              About
            </a>
            <a
              href="https://github.com/adi0900/Google_Chrome25"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-muted-foreground hover:text-neon-cyan transition-colors py-2"
            >
              GitHub
            </a>
            <Button variant="neon" size="default" className="w-full">
              Get Started
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}
