import { type AppKey } from '../OSWindow'

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
          onDoubleClick={() => onOpenApp(app.key)}
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
    top: 16,
    left: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    zIndex: 1,
  },
  shortcut: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 72,
    padding: 8,
    cursor: 'pointer',
    borderRadius: 4,
    userSelect: 'none',
  },
  icon: {
    fontSize: 32,
    marginBottom: 4,
    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))',
  },
  label: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'monospace',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  },
}
