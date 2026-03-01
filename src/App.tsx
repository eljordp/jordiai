import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BiosScreen from './components/BiosScreen'
import Scene3D from './three/Scene3D'
import OSWindow from './os/OSWindow'

type AppState = 'loading' | 'bios' | 'running'

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading')
  const [showOS, setShowOS] = useState(false)
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
    setShowOS(false)
    setCameraMode('desk')
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

  const handleEnterMonitor = useCallback(() => {
    if (cameraModeRef.current !== 'monitor') {
      setCameraMode('monitor')
      setShowOS(true)
    }
  }, [])

  // ESC key
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
        onEnterMonitor={handleEnterMonitor}
      />

      <AnimatePresence>
        {appState === 'loading' && (
          <motion.div
            key="loading"
            style={styles.overlay}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={styles.loadingInner}>
              <div style={styles.loadingBar}>
                <div style={styles.loadingFill} />
              </div>
              <p style={styles.loadingText} className="loading">Initializing</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appState === 'bios' && (
          <motion.div
            key="bios"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BiosScreen onStart={handleStart} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOS && appState === 'running' && (
          <motion.div
            key="os"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={styles.osContainer}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appState === 'running' && cameraMode === 'desk' && !showOS && (
          <motion.div
            key="hint"
            style={styles.hint}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <p style={styles.hintText}>Click the screen to enter</p>
          </motion.div>
        )}
      </AnimatePresence>
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
    overflow: 'hidden',
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
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(8px)',
  },
  exitArrow: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 1,
  },
  exitLabel: {
    color: '#fff',
    fontSize: 11,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    letterSpacing: 0.5,
    fontWeight: 500,
  },
  hint: {
    position: 'fixed',
    bottom: 60,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 4,
  },
  hintText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    textShadow: '0 0 10px rgba(68,136,255,0.3)',
    letterSpacing: 1,
    fontWeight: 400,
  },
}
