import { useState } from 'react'
import { motion } from 'framer-motion'
import { type WindowState, type AppKey } from '../OSWindow'
import { theme } from '../theme'

const isMobile = window.innerWidth < 768

interface Props {
  windows: WindowState[]
  onOpenApp: (key: AppKey) => void
  onRestoreWindow: (id: string) => void
}

const dockItems: { key: AppKey; label: string; symbol: string; color: string }[] = [
  { key: 'showcase', label: 'Showcase', symbol: 'S', color: '#0a84ff' },
  { key: 'about', label: 'About', symbol: 'A', color: '#30d158' },
  { key: 'projects', label: 'Projects', symbol: 'P', color: '#bf5af2' },
  { key: 'contact', label: 'Contact', symbol: 'C', color: '#ff9f0a' },
]

export default function Dock({ windows, onOpenApp, onRestoreWindow }: Props) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const isOpen = (key: string) => windows.some(w => w.id === key)

  const handleClick = (key: AppKey) => {
    const existing = windows.find(w => w.id === key)
    if (existing) {
      onRestoreWindow(key)
    } else {
      onOpenApp(key)
    }
  }

  return (
    <div style={s.dockContainer}>
      <motion.div
        style={s.dockBar}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.2 }}
      >
        {dockItems.map(item => (
          <div
            key={item.key}
            style={s.dockItemWrapper}
            onMouseEnter={() => setHoveredKey(item.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            {/* Tooltip */}
            {hoveredKey === item.key && !isMobile && (
              <motion.div
                style={s.tooltip}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
              </motion.div>
            )}

            <motion.div
              style={{ ...s.dockIcon, backgroundColor: item.color }}
              whileHover={{ scale: 1.3, y: -8 }}
              whileTap={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={() => handleClick(item.key)}
            >
              <span style={s.iconSymbol}>{item.symbol}</span>
            </motion.div>

            {/* Open indicator dot */}
            {isOpen(item.key) && (
              <motion.div
                style={s.openDot}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  dockContainer: {
    position: 'absolute',
    bottom: isMobile ? 8 : 10,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
  },
  dockBar: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? 10 : 12,
    padding: isMobile ? '8px 14px' : '8px 16px',
    backgroundColor: theme.colors.dockBg,
    border: `1px solid ${theme.colors.dockBorder}`,
    borderRadius: theme.radius.dock,
    backdropFilter: theme.blur.dock,
    WebkitBackdropFilter: theme.blur.dock,
    boxShadow: theme.shadow.dock,
  },
  dockItemWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: -32,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    color: '#fff',
    fontSize: 11,
    fontFamily: theme.fonts.system,
    padding: '4px 10px',
    borderRadius: 6,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  dockIcon: {
    width: isMobile ? 44 : 40,
    height: isMobile ? 44 : 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  iconSymbol: {
    color: '#fff',
    fontSize: isMobile ? 18 : 16,
    fontFamily: theme.fonts.system,
    fontWeight: '600',
    userSelect: 'none',
  },
  openDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
}
