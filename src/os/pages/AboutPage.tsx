export default function AboutPage() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>About Jordi</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Who I Am</h3>
        <p style={styles.text}>
          I'm an AI Engineer based in San Francisco, the heart of Silicon Valley where tech
          innovation thrives. I specialize in building websites, crafting software solutions,
          creating custom niche applications, and developing AI automations that help businesses
          work smarter.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>What I Do</h3>
        <p style={styles.text}>
          My work spans across multiple domains in the tech space. From building stunning websites
          to developing custom software solutions, I help businesses establish their digital footprint.
          I also create AI-powered automations that streamline workflows and boost productivity.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Where I'm Based</h3>
        <p style={styles.text}>
          Being in San Francisco puts me right at the epicenter of technological innovation.
          It's an environment that constantly pushes me to stay ahead of the curve and explore
          new possibilities in AI and software development.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Skills & Technologies</h3>
        <div style={styles.skills}>
          {[
            'React', 'Next.js', 'TypeScript', 'Python', 'Rust',
            'Node.js', 'Three.js', 'FastAPI', 'PostgreSQL', 'Redis',
            'Docker', 'AWS', 'Solana', 'WebSocket', 'AI/ML',
          ].map(skill => (
            <span key={skill} style={styles.skillTag}>{skill}</span>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Fun Fact</h3>
        <p style={styles.text}>
          When I'm not engineering AI solutions or building software, you'll find me exploring
          the latest in tech, contributing to open source, and pushing the boundaries of what's
          possible with code.
        </p>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 20,
    borderBottom: '2px solid #000080',
    paddingBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#333',
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    fontSize: 11,
    padding: '3px 8px',
    backgroundColor: '#000080',
    color: '#fff',
    fontFamily: 'monospace',
  },
}
