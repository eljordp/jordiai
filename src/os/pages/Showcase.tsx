import { type AppKey } from '../OSWindow'

interface Props {
  onNavigate: (key: AppKey) => void
}

export default function Showcase({ onNavigate }: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.name}>Jordi</h1>
        <p style={styles.subtitle}>AI Engineer & Software Developer</p>
      </div>

      <div style={styles.bio}>
        <p style={styles.text}>
          I'm an AI Engineer passionate about building innovative digital experiences.
          I specialize in building websites, crafting software solutions, creating custom
          niche applications, and developing AI automations that help businesses work smarter.
        </p>
      </div>

      <p style={styles.sectionTitle}>PROJECTS</p>
      <p style={styles.text}>
        Click on one of the areas below to check out some of my favorite projects.
        I spent a lot of time to include visuals and interactive media to showcase each project. Enjoy!
      </p>

      <div style={styles.categories}>
        {[
          { key: 'projects' as AppKey, title: 'Websites', desc: 'Web design & development' },
          { key: 'projects' as AppKey, title: 'Software', desc: 'Custom applications & tools' },
          { key: 'contact' as AppKey, title: 'Contact', desc: 'Get in touch' },
        ].map((cat) => (
          <div
            key={cat.title}
            style={styles.categoryCard}
            onClick={() => onNavigate(cat.key)}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#e8e8e8'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <p style={styles.categoryTitle}>{cat.title}</p>
            <p style={styles.categoryDesc}>{cat.desc}</p>
          </div>
        ))}
      </div>

      <div style={styles.links}>
        <span style={styles.link} onClick={() => onNavigate('about')}>About</span>
        <span style={styles.linkDivider}>|</span>
        <span style={styles.link} onClick={() => onNavigate('projects')}>Projects</span>
        <span style={styles.linkDivider}>|</span>
        <span style={styles.link} onClick={() => onNavigate('contact')}>Contact</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: 24,
    fontFamily: 'monospace',
    color: '#000',
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 38,
    color: '#000',
    fontWeight: 'bold',
    lineHeight: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
  },
  bio: {
    marginBottom: 24,
  },
  text: {
    fontSize: 13,
    lineHeight: 1.6,
    color: '#333',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    borderBottom: '2px solid #000080',
    paddingBottom: 6,
  },
  categories: {
    display: 'flex',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  categoryCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    border: '2px outset #dfdfdf',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 6,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#555',
  },
  links: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    padding: 16,
    borderTop: '1px solid #c0c0c0',
  },
  link: {
    fontSize: 12,
    color: '#000080',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  linkDivider: {
    color: '#999',
    fontSize: 12,
  },
}
