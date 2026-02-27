import { useCallback, useState } from 'react'
import { type WindowState } from '../OSWindow'

const isMobile = window.innerWidth < 768

interface Props {
  windowState: WindowState
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  children: React.ReactNode
}

export default function Window({ windowState, onClose, onMinimize, onFocus, onMove, children }: Props) {
  const [maximized, setMaximized] = useState(isMobile)

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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (maximized) return
    onFocus()
    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY
    const origX = windowState.x
    const origY = windowState.y

    const handleMove = (ev: TouchEvent) => {
      const t = ev.touches[0]
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      onMove(origX + dx, origY + dy)
    }

    const handleUp = () => {
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }

    window.addEventListener('touchmove', handleMove, { passive: true })
    window.addEventListener('touchend', handleUp)
  }, [windowState.x, windowState.y, onFocus, onMove, maximized])

  const taskbarH = isMobile ? 44 : 32

  const style: React.CSSProperties = maximized
    ? { ...s.window, top: 0, left: 0, width: '100%', height: `calc(100% - ${taskbarH}px)`, zIndex: windowState.zIndex }
    : { ...s.window, top: windowState.y, left: windowState.x, width: windowState.width, height: windowState.height, zIndex: windowState.zIndex }

  return (
    <div style={style} onMouseDown={onFocus}>
      <div style={s.titleBar} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
        <div style={s.titleLeft}>
          <span style={s.titleText}>{windowState.title}</span>
        </div>
        <div style={s.titleButtons} onMouseDown={e => e.stopPropagation()}>
          <button style={s.winBtn} onClick={onMinimize}>
            <span style={s.btnIcon}>_</span>
          </button>
          {!isMobile && (
            <button style={s.winBtn} onClick={() => setMaximized(!maximized)}>
              <span style={s.btnIcon}>□</span>
            </button>
          )}
          <button style={{ ...s.winBtn, ...s.closeBtn }} onClick={onClose}>
            <span style={s.btnIcon}>✕</span>
          </button>
        </div>
      </div>
      <div style={s.menuBar}>
        <span style={s.menuItem}>File</span>
        <span style={s.menuItem}>Edit</span>
        <span style={s.menuItem}>View</span>
        <span style={s.menuItem}>Help</span>
      </div>
      <div style={s.content}>
        {children}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  window: {
    position: 'absolute',
    backgroundColor: '#c0c0c0',
    border: '2px outset #dfdfdf',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 4px 10px rgba(0,0,0,0.4)',
  },
  titleBar: {
    height: isMobile ? 36 : 22,
    background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '0 6px' : '0 3px',
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
    fontSize: isMobile ? 14 : 12,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleButtons: {
    display: 'flex',
    gap: isMobile ? 4 : 2,
  },
  winBtn: {
    width: isMobile ? 32 : 18,
    height: isMobile ? 28 : 16,
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
    fontSize: isMobile ? 14 : 10,
    lineHeight: 1,
    fontWeight: 'bold',
  },
  menuBar: {
    height: isMobile ? 28 : 20,
    borderBottom: '1px solid #808080',
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    padding: '0 4px',
  },
  menuItem: {
    fontSize: isMobile ? 13 : 11,
    fontFamily: 'monospace',
    padding: isMobile ? '4px 10px' : '2px 8px',
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
