const features = [
  {
    icon: '🤖',
    title: 'Chrome Built-in AI',
    description: 'Powered by Gemini Nano for on-device processing with complete privacy.'
  },
  {
    icon: '⚖️',
    title: 'Legal Workflows',
    description: 'Document proofing, compliance automation, and RTI/complaint form autofill.'
  },
  {
    icon: '💰',
    title: 'Tax Planning',
    description: 'Context-aware salary structure analysis and tax optimization suggestions.'
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'All data stored locally with IndexedDB. No cloud uploads, ever.'
  },
  {
    icon: '📄',
    title: 'Document Management',
    description: 'Legal research, storage, and intelligent search across all your documents.'
  },
  {
    icon: '🎙️',
    title: 'Multimodal Input',
    description: 'Audio-to-text transcription and image analysis for comprehensive assistance.'
  },
  {
    icon: '✍️',
    title: 'Auto-Fill Forms',
    description: 'Automatically detect and fill legal, compliance, and government forms.'
  },
  {
    icon: '💬',
    title: 'Persistent Chat',
    description: 'Continuous conversation memory for context-aware legal assistance.'
  }
]

export default function Features() {
  return (
    <section id="features" className="section-container bg-gray-50">
      <h2 className="section-title">Powerful Features</h2>
      <p className="section-subtitle">
        Everything you need for legal, compliance, and tax automation in one privacy-focused extension.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="card">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
