import { useState, useEffect } from 'react'
import { theme } from '../theme'

const isMobile = window.innerWidth < 768

export default function MenuBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) +
        '  ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    }
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isMobile) return null

  return (
    <div style={s.bar}>
      <div style={s.left}>
        <span style={s.apple}></span>
        <span style={s.appName}>Finder</span>
        <span style={s.menuItem}>File</span>
        <span style={s.menuItem}>Edit</span>
        <span style={s.menuItem}>View</span>
        <span style={s.menuItem}>Go</span>
        <span style={s.menuItem}>Window</span>
        <span style={s.menuItem}>Help</span>
      </div>
      <div style={s.right}>
        <span style={s.icon}>􀙇</span>
        <span style={s.icon}>􀊤</span>
        <span style={s.clock}>{time}</span>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: 'rgba(30, 30, 30, 0.65)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    zIndex: 10000,
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  apple: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: theme.fonts.system,
  },
  appName: {
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: theme.fonts.system,
  },
  menuItem: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: theme.fonts.system,
    cursor: 'default',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: theme.fonts.system,
  },
  clock: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: theme.fonts.system,
  },
}
