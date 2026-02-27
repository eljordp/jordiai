import { useCallback, useState } from 'react'
import { type WindowState } from '../OSWindow'

interface Props {
  windowState: WindowState
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  children: React.ReactNode
}

export default function Window({ windowState, onClose, onMinimize, onFocus, onMove, children }: Props) {
  const [maximized, setMaximized] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (maximized) return
    e.preventDefault()
    onFocus()
    const startX = e.clientX
    const startY = e.clientY
    const origX = windowState.x
    const origY = windowState.y

    const handleMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      onMove(origX + dx, origY + dy)
    }

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }, [windowState.x, windowState.y, onFocus, onMove, maximized])

  const style: React.CSSProperties = maximized
    ? { ...styles.window, top: 0, left: 0, width: '100%', height: 'calc(100% - 32px)', zIndex: windowState.zIndex }
    : { ...styles.window, top: windowState.y, left: windowState.x, width: windowState.width, height: windowState.height, zIndex: windowState.zIndex }

  return (
    <div style={style} onMouseDown={onFocus}>
      <div style={styles.titleBar} onMouseDown={handleMouseDown}>
        <div style={styles.titleLeft}>
          <span style={styles.titleText}>{windowState.title}</span>
        </div>
        <div style={styles.titleButtons} onMouseDown={e => e.stopPropagation()}>
          <button style={styles.winBtn} onClick={onMinimize}>
            <span style={styles.btnIcon}>_</span>
          </button>
          <button style={styles.winBtn} onClick={() => setMaximized(!maximized)}>
            <span style={styles.btnIcon}>□</span>
          </button>
          <button style={{ ...styles.winBtn, ...styles.closeBtn }} onClick={onClose}>
            <span style={styles.btnIcon}>✕</span>
          </button>
        </div>
      </div>
      <div style={styles.menuBar}>
        <span style={styles.menuItem}>File</span>
        <span style={styles.menuItem}>Edit</span>
        <span style={styles.menuItem}>View</span>
        <span style={styles.menuItem}>Help</span>
      </div>
      <div style={styles.content}>
        {children}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  window: {
    position: 'absolute',
    backgroundColor: '#c0c0c0',
    border: '2px outset #dfdfdf',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 4px 10px rgba(0,0,0,0.4)',
  },
  titleBar: {
    height: 22,
    background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 3px',
    cursor: 'move',
    userSelect: 'none',
  },
  titleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  titleText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleButtons: {
    display: 'flex',
    gap: 2,
  },
  winBtn: {
    width: 18,
    height: 16,
    border: '2px outset #dfdfdf',
    backgroundColor: '#c0c0c0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  closeBtn: {},
  btnIcon: {
    fontSize: 10,
    lineHeight: 1,
    fontWeight: 'bold',
  },
  menuBar: {
    height: 20,
    borderBottom: '1px solid #808080',
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    padding: '0 4px',
  },
  menuItem: {
    fontSize: 11,
    fontFamily: 'monospace',
    padding: '2px 8px',
    cursor: 'pointer',
    color: '#000',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#fff',
    border: '2px inset #808080',
    margin: 2,
  },
}
