export default function AboutPage() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>About Jordi</h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Who I Am</h3>
        <p style={styles.text}>
          I'm Jordan Lopez — most people know me as JDLO. I'm an AI Engineer based in San Francisco,
          the heart of Silicon Valley. I started from nothing, selling websites for a few hundred dollars.
          Now I build AI-powered systems, run automated sales teams, and work with companies doing
          billions in revenue.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>What I Do</h3>
        <p style={styles.text}>
          I build AI agents, automate workflows, and integrate AI into real business operations.
          From stunning websites to custom software solutions, I help businesses establish their
          digital footprint. I also design sales systems, build content strategies, and develop
          AI-powered automations that streamline workflows and boost productivity. This isn't
          from someone who read about AI — this is from someone who runs on it every day.
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
            'AI Agents', 'AI Automations', 'Sales Systems', 'Prompt Engineering',
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
          When I'm not engineering AI solutions or building software, you'll find me teaching
          what I've learned — from AI automation and sales systems to prompt engineering and
          content strategy. I also mentor a limited group of people who are serious about execution.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Connect</h3>
        <p style={styles.text}>
          @jdlo on Instagram
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
    fontSize: 13,
    lineHeight: 1.6,
    color: '#333',
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    fontSize: 12,
    padding: '4px 10px',
    backgroundColor: '#000080',
    color: '#fff',
    fontFamily: 'monospace',
  },
}
