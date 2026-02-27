import { useState, useCallback, useEffect, useRef } from 'react'
import BiosScreen from './components/BiosScreen'
import Scene3D from './three/Scene3D'
import OSWindow from './os/OSWindow'

type AppState = 'loading' | 'bios' | 'running'

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading')
  const [showOS, setShowOS] = useState(false)
  const [osOpacity, setOsOpacity] = useState(0)
  const [cameraMode, setCameraMode] = useState<'idle' | 'desk' | 'monitor'>('idle')
  const cameraModeRef = useRef(cameraMode)
  cameraModeRef.current = cameraMode

  const handleResourcesLoaded = useCallback(() => {
    setAppState('bios')
  }, [])

  const handleStart = useCallback(() => {
    setAppState('running')
    setCameraMode('desk')
  }, [])

  const exitMonitor = useCallback(() => {
    setOsOpacity(0)
    setTimeout(() => {
      setShowOS(false)
      setCameraMode('desk')
    }, 400)
  }, [])

  const handleClickOutside = useCallback(() => {
    const mode = cameraModeRef.current
    if (mode === 'monitor') {
      exitMonitor()
    } else if (mode === 'desk') {
      setCameraMode('idle')
    } else {
      setCameraMode('desk')
    }
  }, [exitMonitor])

  const handleClickMonitor = useCallback(() => {
    if (cameraModeRef.current !== 'monitor') {
      setCameraMode('monitor')
      setTimeout(() => {
        setShowOS(true)
        requestAnimationFrame(() => setOsOpacity(1))
      }, 1200)
    }
  }, [])

  // ESC key — always works via ref, no stale closure
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        const mode = cameraModeRef.current
        if (mode === 'monitor') {
          exitMonitor()
        } else if (mode === 'desk') {
          setCameraMode('idle')
        }
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [exitMonitor])

  return (
    <>
      <Scene3D
        cameraMode={cameraMode}
        onResourcesLoaded={handleResourcesLoaded}
        onClickOutside={handleClickOutside}
        onClickMonitor={handleClickMonitor}
      />

      {appState === 'loading' && (
        <div style={styles.overlay}>
          <div style={styles.loadingInner}>
            <div style={styles.loadingBar}>
              <div style={styles.loadingFill} />
            </div>
            <p style={styles.loadingText} className="loading">Initializing</p>
          </div>
        </div>
      )}

      {appState === 'bios' && (
        <BiosScreen onStart={handleStart} />
      )}

      {showOS && appState === 'running' && (
        <div
          style={{
            ...styles.osContainer,
            opacity: osOpacity,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          {/* CRT overlay effects */}
          <div style={styles.crtOverlay} />
          <div style={styles.scanLines} />

          {/* EXIT BUTTON — always visible */}
          <button
            style={styles.exitButton}
            onClick={exitMonitor}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.6)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            }}
          >
            <span style={styles.exitArrow}>&#8592;</span>
            <span style={styles.exitLabel}>Back</span>
          </button>

          <OSWindow />
        </div>
      )}

      {/* Click hint when at desk view */}
      {appState === 'running' && cameraMode === 'desk' && !showOS && (
        <div style={styles.hint}>
          <p style={styles.hintText}>Click the monitor to enter</p>
        </div>
      )}
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: '#000',
  },
  loadingInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: '#222',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4488ff',
    animation: 'loading-pulse 1.5s ease-in-out infinite',
    transformOrigin: 'left',
  },
  loadingText: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  osContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    pointerEvents: 'auto',
  },
  crtOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 9998,
    background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.15) 100%)',
  },
  scanLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 9998,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
    opacity: 0.5,
  },
  exitButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10001,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(4px)',
  },
  exitArrow: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 1,
  },
  exitLabel: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  hint: {
    position: 'fixed',
    bottom: 60,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 4,
    animation: 'fade-pulse 2s ease-in-out infinite',
  },
  hintText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: 'monospace',
    textShadow: '0 0 10px rgba(68,136,255,0.3)',
    letterSpacing: 2,
  },
}
