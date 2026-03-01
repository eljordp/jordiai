import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { type WindowState } from '../OSWindow'
import { theme } from '../theme'

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
  const [trafficHover, setTrafficHover] = useState(false)

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

  const dockH = isMobile ? 72 : 68

  const style: React.CSSProperties = maximized
    ? { ...s.window, top: 0, left: 0, width: '100%', height: `calc(100% - ${dockH}px)`, zIndex: windowState.zIndex }
    : { ...s.window, top: windowState.y, left: windowState.x, width: windowState.width, height: windowState.height, zIndex: windowState.zIndex }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      style={style}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div style={s.titleBar} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart}>
        {/* Traffic lights */}
        <div
          style={s.trafficLights}
          onMouseEnter={() => setTrafficHover(true)}
          onMouseLeave={() => setTrafficHover(false)}
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        >
          <button
            style={{ ...s.trafficBtn, backgroundColor: theme.colors.closeBtn }}
            onClick={onClose}
          >
            {trafficHover && <span style={s.trafficIcon}>&#x2715;</span>}
          </button>
          <button
            style={{ ...s.trafficBtn, backgroundColor: theme.colors.minimizeBtn }}
            onClick={onMinimize}
          >
            {trafficHover && <span style={s.trafficIcon}>&#x2013;</span>}
          </button>
          {!isMobile && (
            <button
              style={{ ...s.trafficBtn, backgroundColor: theme.colors.maximizeBtn }}
              onClick={() => setMaximized(!maximized)}
            >
              {trafficHover && <span style={s.trafficIcon}>&#x2B1A;</span>}
            </button>
          )}
        </div>

        {/* Title text (centered) */}
        <span style={s.titleText}>{windowState.title}</span>

        {/* Spacer for centering */}
        <div style={{ width: isMobile ? 56 : 60 }} />
      </div>

      {/* Content */}
      <div style={s.content}>
        {children}
      </div>
    </motion.div>
  )
}

const s: Record<string, React.CSSProperties> = {
  window: {
    position: 'absolute',
    backgroundColor: theme.colors.windowBg,
    border: `1px solid ${theme.colors.windowBorder}`,
    borderRadius: theme.radius.window,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.shadow.window,
    backdropFilter: theme.blur.window,
    WebkitBackdropFilter: theme.blur.window,
    overflow: 'hidden',
  },
  titleBar: {
    height: isMobile ? 44 : 36,
    backgroundColor: theme.colors.titleBarBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '0 14px' : '0 12px',
    cursor: 'move',
    userSelect: 'none',
    borderBottom: `1px solid rgba(255,255,255,0.05)`,
    flexShrink: 0,
  },
  trafficLights: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  trafficBtn: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition: 'filter 0.15s ease',
  },
  trafficIcon: {
    fontSize: 8,
    lineHeight: 1,
    color: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
  },
  titleText: {
    color: theme.colors.titleBarText,
    fontSize: isMobile ? 13 : 12,
    fontFamily: theme.fonts.system,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: theme.colors.contentBg,
  },
}
