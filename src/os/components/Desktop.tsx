import { theme } from '../theme'
import MenuBar from './MenuBar'

export default function Desktop() {
  return (
    <div style={styles.desktop}>
      <MenuBar />
    </div>
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
