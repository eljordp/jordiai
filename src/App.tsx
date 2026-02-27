import { useState, useCallback } from 'react'
import BiosScreen from './components/BiosScreen'
import Scene3D from './three/Scene3D'
import OSWindow from './os/OSWindow'

type AppState = 'loading' | 'bios' | 'running'

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading')
  const [showOS, setShowOS] = useState(false)
  const [cameraMode, setCameraMode] = useState<'idle' | 'desk' | 'monitor'>('idle')

  const handleResourcesLoaded = useCallback(() => {
    setAppState('bios')
  }, [])

  const handleStart = useCallback(() => {
    setAppState('running')
    setCameraMode('desk')
    setTimeout(() => {
      setShowOS(true)
      setCameraMode('monitor')
    }, 2000)
  }, [])

  const handleClickOutside = useCallback(() => {
    if (cameraMode === 'monitor') {
      setCameraMode('desk')
      setShowOS(false)
    } else if (cameraMode === 'desk') {
      setCameraMode('idle')
    } else {
      setCameraMode('desk')
    }
  }, [cameraMode])

  const handleClickMonitor = useCallback(() => {
    if (cameraMode !== 'monitor') {
      setCameraMode('monitor')
      setShowOS(true)
    }
  }, [cameraMode])

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
          <p className="loading">Loading resources</p>
        </div>
      )}

      {appState === 'bios' && (
        <BiosScreen onStart={handleStart} />
      )}

      {showOS && appState === 'running' && (
        <div style={styles.osContainer}>
          <OSWindow />
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
  osContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    pointerEvents: 'auto',
  },
}
