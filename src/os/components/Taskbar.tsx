import { useState, useEffect } from 'react'
import { type WindowState, type AppKey } from '../OSWindow'

const isMobile = window.innerWidth < 768

interface Props {
  windows: WindowState[]
  startMenuOpen: boolean
  onToggleStart: () => void
  onOpenApp: (key: AppKey) => void
  onRestoreWindow: (id: string) => void
}

const startMenuItems: { key: AppKey; label: string; icon: string }[] = [
  { key: 'showcase', label: 'Showcase', icon: '🖥️' },
  { key: 'about', label: 'About Me', icon: '📋' },
  { key: 'projects', label: 'Projects', icon: '📁' },
  { key: 'contact', label: 'Contact', icon: '✉️' },
]

export default function Taskbar({ windows, startMenuOpen, onToggleStart, onOpenApp, onRestoreWindow }: Props) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {startMenuOpen && (
        <div style={s.startMenu}>
          <div style={s.startMenuSidebar}>
            <span style={s.sidebarText}>JordiOS</span>
          </div>
          <div style={s.startMenuContent}>
            {startMenuItems.map(item => (
              <div
                key={item.key}
                style={s.startMenuItem}
                onClick={() => onOpenApp(item.key)}
              >
                <span style={s.menuIcon}>{item.icon}</span>
                <span style={s.menuLabel}>{item.label}</span>
              </div>
            ))}
            <div style={s.menuDivider} />
            <div style={s.startMenuItem}>
              <span style={s.menuIcon}>🔌</span>
              <span style={s.menuLabel}>Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      <div style={s.taskbar}>
        <button
          style={{
            ...s.startButton,
            ...(startMenuOpen ? s.startButtonActive : {}),
          }}
          onClick={onToggleStart}
        >
          <span style={s.startIcon}>⊞</span>
          <span style={s.startLabel}>Start</span>
        </button>

        <div style={s.taskButtons}>
          {windows.map(w => (
            <button
              key={w.id}
              style={{
                ...s.taskButton,
                ...(w.minimized ? {} : s.taskButtonActive),
              }}
              onClick={() => onRestoreWindow(w.id)}
            >
              {w.title.length > (isMobile ? 12 : 20) ? w.title.slice(0, isMobile ? 12 : 20) + '...' : w.title}
            </button>
          ))}
        </div>

        <div style={s.tray}>
          <span style={s.trayIcon}>🔊</span>
          <span style={s.clock}>{time}</span>
        </div>
      </div>
    </>
  )
}

const s: Record<string, React.CSSProperties> = {
  taskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: isMobile ? 44 : 32,
    backgroundColor: '#c0c0c0',
    borderTop: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    padding: isMobile ? '0 4px' : '0 2px',
    zIndex: 9999,
    gap: isMobile ? 4 : 2,
  },
  startButton: {
    height: isMobile ? 36 : 26,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: isMobile ? '0 10px' : '0 6px',
    backgroundColor: '#c0c0c0',
    border: '2px outset #fff',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: isMobile ? 14 : 12,
  },
  startButtonActive: {
    border: '2px inset #808080',
  },
  startIcon: {
    fontSize: isMobile ? 18 : 14,
  },
  startLabel: {
    fontSize: isMobile ? 14 : 12,
    fontWeight: 'bold',
  },
  taskButtons: {
    flex: 1,
    display: 'flex',
    gap: isMobile ? 4 : 2,
    overflow: 'hidden',
  },
  taskButton: {
    height: isMobile ? 34 : 24,
    maxWidth: isMobile ? 120 : 160,
    padding: isMobile ? '0 10px' : '0 8px',
    backgroundColor: '#c0c0c0',
    border: '2px outset #fff',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: isMobile ? 12 : 11,
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  taskButtonActive: {
    border: '2px inset #808080',
    backgroundColor: '#b0b0b0',
  },
  tray: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: isMobile ? '0 10px' : '0 8px',
    height: isMobile ? 34 : 26,
    border: '2px inset #808080',
    backgroundColor: '#c0c0c0',
  },
  trayIcon: {
    fontSize: isMobile ? 14 : 12,
  },
  clock: {
    fontFamily: 'monospace',
    fontSize: isMobile ? 12 : 11,
    color: '#000',
  },
  startMenu: {
    position: 'absolute',
    bottom: isMobile ? 44 : 32,
    left: 0,
    width: isMobile ? 220 : 200,
    backgroundColor: '#c0c0c0',
    border: '2px outset #fff',
    zIndex: 10000,
    display: 'flex',
  },
  startMenuSidebar: {
    width: 24,
    backgroundColor: '#000080',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '8px 0',
  },
  sidebarText: {
    color: '#c0c0c0',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    letterSpacing: 2,
  },
  startMenuContent: {
    flex: 1,
    padding: '4px 0',
  },
  startMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: isMobile ? '10px 12px' : '6px 12px',
    cursor: 'pointer',
    color: '#000',
    fontFamily: 'monospace',
    fontSize: isMobile ? 14 : 12,
  },
  menuIcon: {
    fontSize: isMobile ? 20 : 16,
  },
  menuLabel: {
    fontSize: isMobile ? 14 : 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#808080',
    margin: '4px 8px',
    borderBottom: '1px solid #fff',
  },
}
