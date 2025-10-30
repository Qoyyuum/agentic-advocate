import '../styles/globals.css'

export const metadata = {
  title: 'Agentic Advocate - AI Legal Assistant',
  description: 'Privacy-first legal assistant powered by Chrome Built-in AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
