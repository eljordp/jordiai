import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Dock from './components/Dock'
import Desktop from './components/Desktop'
import Window from './components/Window'
import Showcase from './pages/Showcase'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'

export interface WindowState {
  id: string
  title: string
  component: React.ReactNode
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  zIndex: number
}

export type AppKey = 'showcase' | 'about' | 'projects' | 'contact'

export default function OSWindow() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [nextZ, setNextZ] = useState(100)

  const openApp = useCallback((key: AppKey) => {
    // Check if already open
    const existing = windows.find(w => w.id === key)
    if (existing) {
      setWindows(prev => prev.map(w =>
        w.id === key ? { ...w, minimized: false, zIndex: nextZ } : w
      ))
      setNextZ(z => z + 1)
      return
    }

    const appConfig: Record<AppKey, { title: string; component: React.ReactNode; width: number; height: number }> = {
      showcase: {
        title: 'Jordi - Showcase 2025',
        component: <Showcase onNavigate={openApp} />,
        width: 800,
        height: 550,
      },
      about: {
        title: 'About Jordi',
        component: <AboutPage />,
        width: 650,
        height: 480,
      },
      projects: {
        title: 'Projects',
        component: <ProjectsPage />,
        width: 750,
        height: 520,
      },
      contact: {
        title: 'Contact',
        component: <ContactPage />,
        width: 500,
        height: 420,
      },
    }

    const config = appConfig[key]
    const newWindow: WindowState = {
      id: key,
      title: config.title,
      component: config.component,
      x: 40 + windows.length * 30,
      y: 20 + windows.length * 30,
      width: config.width,
      height: config.height,
      minimized: false,
      zIndex: nextZ,
    }

    setWindows(prev => [...prev, newWindow])
    setNextZ(z => z + 1)
  }, [windows, nextZ])

  // Auto-open Showcase on first mount
  const hasOpened = useRef(false)
  useEffect(() => {
    if (!hasOpened.current) {
      hasOpened.current = true
      openApp('showcase')
    }
  }, [openApp])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, minimized: true } : w
    ))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, zIndex: nextZ } : w
    ))
    setNextZ(z => z + 1)
  }, [nextZ])

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, x, y } : w
    ))
  }, [])

  return (
    <div style={styles.os}>
      <Desktop />

      <AnimatePresence>
        {windows.map(w => !w.minimized && (
          <Window
            key={w.id}
            windowState={w}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            onMove={(x, y) => moveWindow(w.id, x, y)}
          >
            {w.component}
          </Window>
        ))}
      </AnimatePresence>

      <Dock
        windows={windows}
        onOpenApp={openApp}
        onRestoreWindow={(id) => {
          setWindows(prev => prev.map(w =>
            w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w
          ))
          setNextZ(z => z + 1)
        }}
      />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  os: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
}
