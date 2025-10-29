export default function Hero() {
  return (
    <section className="relative bg-gradient-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Your AI-Powered <br />
            <span className="text-yellow-300">Legal Assistant</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Automate legal, compliance, and tax tasks with Chrome's Built-in AI.
            Privacy-first, offline-capable, and powered by Gemini Nano.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Install Extension
            </button>
            <button className="btn-secondary border-white text-white hover:bg-white/10">
              Learn More
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>100% Privacy-First</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Offline Capable</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Free & Open Source</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  )
}
