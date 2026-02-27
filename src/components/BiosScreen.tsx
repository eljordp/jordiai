import { useState, useEffect } from 'react'

interface Props {
  onStart: () => void
}

export default function BiosScreen({ onStart }: Props) {
  const [loadingLines, setLoadingLines] = useState<string[]>([])
  const [showStart, setShowStart] = useState(false)

  const biosLines = [
    'JDBIOS (C)2025 Jordi Studios, Inc.',
    'CPU: Neural Processing Unit @ 4.2 GHz',
    'Memory: 128GB DDR5 @ 6400MHz...OK',
    'GPU: RTX 5090 Ti 48GB VRAM...OK',
    'Initializing AI subsystems...',
    'Loading neural networks...',
    'Calibrating transformer models...',
    'Establishing API connections...',
    'FINISHED LOADING RESOURCES',
  ]

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < biosLines.length) {
        setLoadingLines(prev => [...prev, biosLines[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setShowStart(true), 500)
      }
    }, 300)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.biosTitle}>JDBIOS (C)2025 Jordi Studios</p>
        <p style={styles.biosSubtitle}>Jordi Portfolio Showcase v2.5</p>
      </div>

      <div style={styles.body}>
        {loadingLines.map((line, i) => (
          <p key={i} style={styles.line}>{line}</p>
        ))}
        {!showStart && loadingLines.length < biosLines.length && (
          <p className="loading" style={styles.line}>Processing</p>
        )}
      </div>

      {showStart && (
        <div style={styles.footer}>
          <div style={styles.startPopup}>
            <p style={styles.showcaseTitle}>Jordi Portfolio Showcase 2025</p>
            <button style={styles.startButton} onClick={onStart}>
              <p style={styles.startText}>Click start to begin</p>
            </button>
          </div>
        </div>
      )}
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
    justifyContent: 'space-between',
    zIndex: 10,
    fontFamily: 'monospace',
  },
  header: {
    padding: 48,
  },
  biosTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  biosSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  body: {
    paddingLeft: 48,
    paddingRight: 48,
    flex: 1,
  },
  line: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  footer: {
    padding: 48,
    paddingBottom: 64,
    display: 'flex',
    justifyContent: 'center',
  },
  startPopup: {
    textAlign: 'center',
  },
  showcaseTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 24,
    fontFamily: 'monospace',
  },
  startButton: {
    backgroundColor: '#000',
    border: '4px solid #fff',
    cursor: 'pointer',
    padding: 0,
  },
  startText: {
    color: '#fff',
    padding: '12px 24px',
    fontSize: 16,
    fontFamily: 'monospace',
    transition: 'all 0.2s',
  },
}
