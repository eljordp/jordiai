import { useState, useEffect, useRef } from 'react'

interface Props {
  onStart: () => void
}

export default function BiosScreen({ onStart }: Props) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('')
  const [showStart, setShowStart] = useState(false)
  const [hoverStart, setHoverStart] = useState(false)
  const animRef = useRef<number>(0)

  const statuses = [
    { at: 0, text: 'Initializing environment...' },
    { at: 15, text: 'Loading assets...' },
    { at: 35, text: 'Building workspace...' },
    { at: 55, text: 'Preparing portfolio...' },
    { at: 75, text: 'Almost ready...' },
    { at: 95, text: 'Finalizing...' },
  ]

  useEffect(() => {
    let current = 0
    const target = 100
    const startTime = performance.now()
    const duration = 3000 // 3 seconds total

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      // Ease out curve — fast start, slow finish
      current = Math.round(target * (1 - Math.pow(1 - t, 3)))

      setProgress(current)

      // Update status text
      for (let i = statuses.length - 1; i >= 0; i--) {
        if (current >= statuses[i].at) {
          setStatusText(statuses[i].text)
          break
        }
      }

      if (current < target) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        setStatusText('Ready')
        setTimeout(() => setShowStart(true), 400)
      }
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.scanOverlay} />
      <div style={styles.vignetteOverlay} />

      <div style={styles.content}>
        {/* Logo / Name */}
        <div style={styles.logoSection}>
          <h1 style={styles.name}>JORDI</h1>
          <div style={styles.divider} />
          <p style={styles.tagline}>AI Engineer & Software Developer</p>
        </div>

        {/* Progress */}
        <div style={styles.progressSection}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`,
              }}
            />
          </div>
          <div style={styles.progressInfo}>
            <span style={styles.statusText}>{statusText}</span>
            <span style={styles.percentText}>{progress}%</span>
          </div>
        </div>

        {/* Start button */}
        <div style={{
          ...styles.startSection,
          opacity: showStart ? 1 : 0,
          transform: showStart ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease',
          pointerEvents: showStart ? 'auto' : 'none',
        }}>
          <button
            style={{
              ...styles.startButton,
              ...(hoverStart ? styles.startButtonHover : {}),
            }}
            onClick={onStart}
            onMouseEnter={() => setHoverStart(true)}
            onMouseLeave={() => setHoverStart(false)}
          >
            <span style={{
              ...styles.startText,
              ...(hoverStart ? { color: '#000' } : {}),
            }}>Enter</span>
          </button>
        </div>
      </div>

      {/* Bottom branding */}
      <div style={styles.footer}>
        <span style={styles.footerText}>Jordi Studios &copy; 2025</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    fontFamily: 'monospace',
    overflow: 'hidden',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px)',
    pointerEvents: 'none',
    zIndex: 2,
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
    pointerEvents: 'none',
    zIndex: 2,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 48,
    zIndex: 3,
    width: '100%',
    maxWidth: 420,
    padding: '0 24px',
  },
  logoSection: {
    textAlign: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 16,
    marginBottom: 16,
    fontFamily: 'monospace',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#fff',
    margin: '0 auto 16px',
    opacity: 0.3,
  },
  tagline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  progressSection: {
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
    transition: 'width 0.1s linear',
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    letterSpacing: 1,
  },
  percentText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: 1,
  },
  startSection: {
    marginTop: 8,
  },
  startButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)',
    cursor: 'pointer',
    padding: '14px 56px',
    transition: 'all 0.3s ease',
    borderRadius: 0,
  },
  startButtonHover: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  startText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'monospace',
    letterSpacing: 4,
    textTransform: 'uppercase',
    transition: 'color 0.3s ease',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    zIndex: 3,
  },
  footerText: {
    color: 'rgba(255,255,255,0.15)',
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
}
