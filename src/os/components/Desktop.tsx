import { theme } from '../theme'

export default function Desktop() {
  return (
    <div style={styles.desktop} />
  )
}

const styles: Record<string, React.CSSProperties> = {
  desktop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.colors.desktopBg,
    zIndex: 0,
  },
}
