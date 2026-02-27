import { useState, useEffect } from 'react'
import { type WindowState, type AppKey } from '../OSWindow'

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
        <div style={styles.startMenu}>
          <div style={styles.startMenuSidebar}>
            <span style={styles.sidebarText}>JordiOS</span>
          </div>
          <div style={styles.startMenuContent}>
            {startMenuItems.map(item => (
              <div
                key={item.key}
                style={styles.startMenuItem}
                onClick={() => onOpenApp(item.key)}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#000080')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <span style={styles.menuLabel}>{item.label}</span>
              </div>
            ))}
            <div style={styles.menuDivider} />
            <div
              style={styles.startMenuItem}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#000080')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={styles.menuIcon}>🔌</span>
              <span style={styles.menuLabel}>Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      <div style={styles.taskbar}>
        <button
          style={{
            ...styles.startButton,
            ...(startMenuOpen ? styles.startButtonActive : {}),
          }}
          onClick={onToggleStart}
        >
          <span style={styles.startIcon}>⊞</span>
          <span style={styles.startLabel}>Start</span>
        </button>

        <div style={styles.taskButtons}>
          {windows.map(w => (
            <button
              key={w.id}
              style={{
                ...styles.taskButton,
                ...(w.minimized ? {} : styles.taskButtonActive),
              }}
              onClick={() => onRestoreWindow(w.id)}
            >
              {w.title.length > 20 ? w.title.slice(0, 20) + '...' : w.title}
            </button>
          ))}
        </div>

        <div style={styles.tray}>
          <span style={styles.trayIcon}>🔊</span>
          <span style={styles.clock}>{time}</span>
        </div>
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  taskbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#c0c0c0',
    borderTop: '2px solid #fff',
    display: 'flex',
    alignItems: 'center',
    padding: '0 2px',
    zIndex: 9999,
    gap: 2,
  },
  startButton: {
    height: 26,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '0 6px',
    backgroundColor: '#c0c0c0',
    border: '2px outset #fff',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 12,
  },
  startButtonActive: {
    border: '2px inset #808080',
  },
  startIcon: {
    fontSize: 14,
  },
  startLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskButtons: {
    flex: 1,
    display: 'flex',
    gap: 2,
    overflow: 'hidden',
  },
  taskButton: {
    height: 24,
    maxWidth: 160,
    padding: '0 8px',
    backgroundColor: '#c0c0c0',
    border: '2px outset #fff',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 11,
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
    padding: '0 8px',
    height: 26,
    border: '2px inset #808080',
    backgroundColor: '#c0c0c0',
  },
  trayIcon: {
    fontSize: 12,
  },
  clock: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#000',
  },
  startMenu: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    width: 200,
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
    padding: '6px 12px',
    cursor: 'pointer',
    color: '#000',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuLabel: {
    fontSize: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#808080',
    margin: '4px 8px',
    borderBottom: '1px solid #fff',
  },
}
