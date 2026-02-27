import { type AppKey } from '../OSWindow'

const isMobile = window.innerWidth < 768

interface Props {
  onOpenApp: (key: AppKey) => void
}

const desktopApps = [
  { key: 'showcase' as AppKey, label: 'Showcase', icon: '🖥️' },
  { key: 'about' as AppKey, label: 'About Me', icon: '📋' },
  { key: 'projects' as AppKey, label: 'Projects', icon: '📁' },
  { key: 'contact' as AppKey, label: 'Contact', icon: '✉️' },
]

export default function Desktop({ onOpenApp }: Props) {
  return (
    <div style={styles.desktop}>
      {desktopApps.map(app => (
        <div
          key={app.key}
          style={styles.shortcut}
          onClick={() => onOpenApp(app.key)}
        >
          <div style={styles.icon}>{app.icon}</div>
          <span style={styles.label}>{app.label}</span>
        </div>
      ))}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  desktop: {
    position: 'absolute',
    top: isMobile ? 10 : 16,
    left: isMobile ? 10 : 16,
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column',
    flexWrap: isMobile ? 'wrap' : undefined,
    gap: isMobile ? 4 : 8,
    zIndex: 1,
  },
  shortcut: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: isMobile ? 64 : 72,
    padding: isMobile ? 6 : 8,
    cursor: 'pointer',
    borderRadius: 4,
    userSelect: 'none',
  },
  icon: {
    fontSize: isMobile ? 28 : 32,
    marginBottom: 4,
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))',
  },
  label: {
    color: '#fff',
    fontSize: isMobile ? 10 : 11,
    textAlign: 'center',
    fontFamily: 'monospace',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
}
