# Hydration Error Fix Guide

## Common Patterns That Cause Hydration Errors

### ❌ BAD: Direct Date/Random in Render
```jsx
function Component() {
  return <div>{Date.now()}</div>  // Different on server vs client!
}
```

### ✅ GOOD: Use useEffect or suppressHydrationWarning
```jsx
'use client'
function Component() {
  const [timestamp, setTimestamp] = useState(null)

  useEffect(() => {
    setTimestamp(Date.now())
  }, [])

  return <div suppressHydrationWarning>{timestamp}</div>
}
```

---

### ❌ BAD: Browser-Only API in SSR
```jsx
function Component() {
  const width = window.innerWidth  // Crashes on server!
  return <div>{width}</div>
}
```

### ✅ GOOD: Check typeof window
```jsx
'use client'
function Component() {
  const [width, setWidth] = useState(null)

  useEffect(() => {
    setWidth(window.innerWidth)
  }, [])

  return <div>{width ?? 'Loading...'}</div>
}
```

---

### ❌ BAD: Different SSR/Client HTML Structure
```jsx
function Component({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Server renders null, client renders children - MISMATCH!
  return mounted ? children : null
}
```

### ✅ GOOD: Consistent Structure
```jsx
function Component({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Always render wrapper, conditionally show content
  return <div style={{ opacity: mounted ? 1 : 0 }}>{children}</div>
}
```

---

## Framer Motion Specific Fixes

### ❌ BAD: Animations cause layout shift
```jsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  Content
</motion.div>
```

### ✅ GOOD: Disable on SSR
```jsx
'use client'
import { motion, LazyMotion, domAnimation } from 'framer-motion'

function Component() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  return (
    <LazyMotion features={domAnimation}>
      <motion.div
        initial={isClient ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
      >
        Content
      </motion.div>
    </LazyMotion>
  )
}
```

---

## Next.js 15 Specific: Suppress Warnings

Add to components with unavoidable mismatches:

```jsx
<html suppressHydrationWarning>
  <body suppressHydrationWarning>
    {children}
  </body>
</html>
```

**Use sparingly!** Only for:
- Theme toggles
- Browser extension interference
- Third-party scripts modifying DOM
