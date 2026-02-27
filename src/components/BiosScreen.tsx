import { useState, useEffect } from 'react'

interface Props {
  onStart: () => void
}

export default function BiosScreen({ onStart }: Props) {
  const [loadingLines, setLoadingLines] = useState<string[]>([])
  const [showStart, setShowStart] = useState(false)
  const [hoverStart, setHoverStart] = useState(false)

  const biosLines = [
    'JDBIOS (C)2025 Jordi Studios, Inc.',
    '',
    'CPU: Neural Processing Unit @ 4.2 GHz',
    'Memory: 128GB DDR5 @ 6400MHz............OK',
    'GPU: RTX 5090 Ti 48GB VRAM..............OK',
    'Storage: 8TB NVMe SSD Array..............OK',
    '',
    'Initializing AI subsystems...............',
    'Loading neural network weights...........',
    'Calibrating transformer attention heads..',
    'Establishing API connections..............',
    'Mounting virtual workspaces..............',
    '',
    'All systems operational.',
    '',
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
        setTimeout(() => setShowStart(true), 600)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      {/* CRT scan line effect */}
      <div style={styles.scanOverlay} />
      <div style={styles.vignetteOverlay} />

      <div style={styles.header}>
        <p style={styles.biosTitle}>JDBIOS (C)2025 Jordi Studios</p>
        <p style={styles.biosVersion}>v2.5.0 | Build 20250226</p>
      </div>

      <div style={styles.body}>
        {loadingLines.map((line, i) => (
          <p key={i} style={line === '' ? styles.spacer : styles.line}>
            {line}
          </p>
        ))}
        {!showStart && loadingLines.length < biosLines.length && (
          <div style={styles.cursorLine}>
            <span style={styles.line}>{'>'} </span>
            <div className="blinking-cursor" />
          </div>
        )}
      </div>

      {showStart && (
        <div style={styles.footer}>
          <div style={styles.startPopup}>
            <div style={styles.popupBorder}>
              <p style={styles.showcaseTitle}>Jordi Portfolio Showcase 2025</p>
              <p style={styles.showcaseSubtitle}>&laquo; AI Engineer &middot; Software Developer &raquo;</p>
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
                }}>Click start to begin</span>
              </button>
            </div>
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
    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
    pointerEvents: 'none',
    zIndex: 2,
  },
  header: {
    padding: '48px 48px 0',
    zIndex: 3,
  },
  biosTitle: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 4,
  },
  biosVersion: {
    color: '#555',
    fontSize: 11,
  },
  body: {
    paddingLeft: 48,
    paddingRight: 48,
    flex: 1,
    paddingTop: 24,
    zIndex: 3,
  },
  line: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 2,
    fontFamily: 'monospace',
    lineHeight: 1.6,
  },
  spacer: {
    height: 12,
  },
  cursorLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },
  footer: {
    padding: '0 48px 64px',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 3,
  },
  startPopup: {
    textAlign: 'center',
  },
  popupBorder: {
    border: '1px solid #333',
    padding: '32px 48px',
    backgroundColor: 'rgba(10,10,15,0.8)',
  },
  showcaseTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 8,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  showcaseSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 28,
    fontFamily: 'monospace',
  },
  startButton: {
    backgroundColor: '#000',
    border: '2px solid #fff',
    cursor: 'pointer',
    padding: '12px 32px',
    transition: 'all 0.2s ease',
  },
  startButtonHover: {
    backgroundColor: '#fff',
  },
  startText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 1,
    transition: 'color 0.2s ease',
  },
}

