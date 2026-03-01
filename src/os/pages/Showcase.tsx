import { motion } from 'framer-motion'
import { type AppKey } from '../OSWindow'
import { theme } from '../theme'
import PageTransition, { FadeInItem } from '../components/PageTransition'

interface Props {
  onNavigate: (key: AppKey) => void
}

export default function Showcase({ onNavigate }: Props) {
  return (
    <PageTransition>
      <div style={styles.container}>
        <FadeInItem>
          <div style={styles.header}>
            <h1 style={styles.name}>Jordi</h1>
            <p style={styles.subtitle}>AI Engineer & Software Developer</p>
          </div>
        </FadeInItem>

        <FadeInItem>
          <div style={styles.bio}>
            <p style={styles.text}>
              Started from nothing — sold websites for a few hundred dollars. Now I build AI-powered
              systems, run automated sales teams, and work with companies doing billions in revenue.
              I specialize in building websites, crafting software solutions, creating custom
              niche applications, and developing AI automations that help businesses work smarter.
            </p>
          </div>
        </FadeInItem>

        <FadeInItem>
          <p style={styles.sectionTitle}>PROJECTS</p>
          <p style={styles.text}>
            Click on one of the areas below to check out some of my favorite projects.
            I spent a lot of time to include visuals and interactive media to showcase each project. Enjoy!
          </p>
        </FadeInItem>

        <div style={styles.categories}>
          {[
            { key: 'projects' as AppKey, title: 'Websites', desc: 'Web design & development' },
            { key: 'projects' as AppKey, title: 'Software', desc: 'Custom applications & tools' },
            { key: 'contact' as AppKey, title: 'Contact', desc: 'Get in touch' },
          ].map((cat) => (
            <FadeInItem key={cat.title}>
              <motion.div
                style={styles.categoryCard}
                whileHover={{
                  backgroundColor: theme.colors.cardHoverBg,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                onClick={() => onNavigate(cat.key)}
              >
                <p style={styles.categoryTitle}>{cat.title}</p>
                <p style={styles.categoryDesc}>{cat.desc}</p>
              </motion.div>
            </FadeInItem>
          ))}
        </div>

        <FadeInItem>
          <div style={styles.links}>
            <span style={styles.link} onClick={() => onNavigate('about')}>About</span>
            <span style={styles.linkDivider}>|</span>
            <span style={styles.link} onClick={() => onNavigate('projects')}>Projects</span>
            <span style={styles.linkDivider}>|</span>
            <span style={styles.link} onClick={() => onNavigate('contact')}>Contact</span>
          </div>
        </FadeInItem>
      </div>
    </PageTransition>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 28,
    fontFamily: theme.fonts.system,
    color: theme.colors.textPrimary,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 38,
    color: theme.colors.textPrimary,
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: 400,
  },
  bio: {
    marginBottom: 24,
  },
  text: {
    fontSize: 13,
    lineHeight: 1.7,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    letterSpacing: 2,
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
    paddingBottom: 8,
  },
  categories: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    padding: 18,
    backgroundColor: theme.colors.cardBg,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: theme.radius.card,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.accent,
    marginBottom: 6,
  },
  categoryDesc: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  links: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    padding: 16,
    borderTop: `1px solid rgba(255,255,255,0.06)`,
  },
  link: {
    fontSize: 12,
    color: theme.colors.accent,
    cursor: 'pointer',
    fontWeight: 500,
  },
  linkDivider: {
    color: theme.colors.textTertiary,
    fontSize: 12,
  },
}
