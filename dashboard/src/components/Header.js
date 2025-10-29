export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold gradient-text">Agentic Advocate</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary-600 transition-colors">How It Works</a>
            <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors">About</a>
            <a href="https://github.com/adi0900/Google_Chrome25" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary-600 transition-colors">GitHub</a>
          </div>
          <button className="btn-primary">
            Get Started
          </button>
        </div>
      </nav>
    </header>
  )
}
