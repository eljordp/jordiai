export const theme = {
  colors: {
    // Window chrome
    windowBg: 'rgba(30, 30, 30, 0.85)',
    windowBorder: 'rgba(255, 255, 255, 0.08)',
    titleBarBg: 'rgba(50, 50, 50, 0.95)',
    titleBarText: 'rgba(255, 255, 255, 0.85)',

    // Traffic light buttons
    closeBtn: '#ff5f57',
    minimizeBtn: '#febc2e',
    maximizeBtn: '#28c840',

    // Content
    contentBg: 'rgba(20, 20, 20, 0.95)',
    textPrimary: '#f5f5f7',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.35)',
    accent: '#0a84ff',
    accentHover: '#409cff',

    // Dock
    dockBg: 'rgba(40, 40, 40, 0.75)',
    dockBorder: 'rgba(255, 255, 255, 0.12)',

    // Desktop
    desktopBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',

    // Cards / surfaces
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardHoverBg: 'rgba(255, 255, 255, 0.1)',

    // Form elements
    inputBg: 'rgba(0, 0, 0, 0.3)',
    inputBorder: 'rgba(255, 255, 255, 0.15)',
    inputFocus: '#0a84ff',
  },
  fonts: {
    system: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", "Fira Code", "JetBrains Mono", Consolas, monospace',
  },
  blur: {
    window: 'blur(40px) saturate(180%)',
    dock: 'blur(30px) saturate(150%)',
  },
  radius: {
    window: 12,
    card: 10,
    button: 8,
    input: 8,
    dock: 18,
  },
  shadow: {
    window: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)',
    dock: '0 10px 40px rgba(0, 0, 0, 0.4)',
    card: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
}
