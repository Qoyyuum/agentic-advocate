const steps = [
  {
    number: '01',
    title: 'Install Extension',
    description: 'Add Agentic Advocate to Chrome from the Web Store or load it as an unpacked extension.'
  },
  {
    number: '02',
    title: 'Configure AI',
    description: 'Enable Gemini Nano for local processing or use remote fallback based on your preference.'
  },
  {
    number: '03',
    title: 'Start Automating',
    description: 'Use AI chat, analyze documents, auto-fill forms, and get legal assistance on any webpage.'
  },
  {
    number: '04',
    title: 'Stay Private',
    description: 'All processing happens locally on your device. Your data never leaves your computer.'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-container bg-white">
      <h2 className="section-title">How It Works</h2>
      <p className="section-subtitle">
        Get started with Agentic Advocate in just a few simple steps.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-30 -translate-x-1/2"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
