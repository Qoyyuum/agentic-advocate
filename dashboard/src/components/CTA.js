export default function CTA() {
  return (
    <section className="section-container bg-gradient-primary">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Legal Workflow?
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Join thousands using Agentic Advocate for privacy-first legal automation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Install Now - It's Free
          </button>
          <button className="btn-secondary border-white text-white hover:bg-white/10">
            View on GitHub
          </button>
        </div>
        <p className="mt-6 text-white/70 text-sm">
          Built for Chrome AI Challenge 2025 • Open Source • No signup required
        </p>
      </div>
    </section>
  )
}
