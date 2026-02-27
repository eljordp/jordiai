import { useState, useCallback, useEffect } from 'react'
import BiosScreen from './components/BiosScreen'
import Scene3D from './three/Scene3D'
import OSWindow from './os/OSWindow'

type AppState = 'loading' | 'bios' | 'running'

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading')
  const [showOS, setShowOS] = useState(false)
  const [osOpacity, setOsOpacity] = useState(0)
  const [cameraMode, setCameraMode] = useState<'idle' | 'desk' | 'monitor'>('idle')

  const handleResourcesLoaded = useCallback(() => {
    setAppState('bios')
  }, [])

  const handleStart = useCallback(() => {
    setAppState('running')
    setCameraMode('desk')
    setTimeout(() => {
      setCameraMode('monitor')
      setTimeout(() => {
        setShowOS(true)
        // Fade in OS
        requestAnimationFrame(() => setOsOpacity(1))
      }, 1200)
    }, 1500)
  }, [])

  const handleClickOutside = useCallback(() => {
    if (cameraMode === 'monitor') {
      setOsOpacity(0)
      setTimeout(() => {
        setShowOS(false)
        setCameraMode('desk')
      }, 400)
    } else if (cameraMode === 'desk') {
      setCameraMode('idle')
    } else {
      setCameraMode('desk')
    }
  }, [cameraMode])

  const handleClickMonitor = useCallback(() => {
    if (cameraMode !== 'monitor') {
      setCameraMode('monitor')
      setTimeout(() => {
        setShowOS(true)
        requestAnimationFrame(() => setOsOpacity(1))
      }, 1200)
    }
  }, [cameraMode])

  // Keyboard shortcut: Escape to zoom out
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClickOutside()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleClickOutside])

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
          <OSWindow />
        </div>
      )}

      {/* Click hint when at desk view */}
      {appState === 'running' && cameraMode === 'desk' && !showOS && (
        <div style={styles.hint}>
          <p style={styles.hintText}>Click the monitor to enter</p>
        </div>
      )}

      {/* Back hint when in monitor */}
      {appState === 'running' && cameraMode === 'monitor' && showOS && (
        <div style={styles.escHint}>
          <p style={styles.escText}>ESC to zoom out</p>
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
    borderRadius: 0,
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
  escHint: {
    position: 'fixed',
    top: 12,
    right: 16,
    zIndex: 10000,
    opacity: 0.4,
  },
  escText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'monospace',
    padding: '4px 8px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 3,
  },
}
