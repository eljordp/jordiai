import { motion } from 'framer-motion'
import { theme } from '../theme'
import PageTransition, { FadeInItem } from '../components/PageTransition'

export default function AboutPage() {
  return (
    <PageTransition>
      <div style={styles.container}>
        <FadeInItem>
          <h2 style={styles.title}>About Jordi</h2>
        </FadeInItem>

        <FadeInItem>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Who I Am</h3>
            <p style={styles.text}>
              I'm Jordan Lopez — most people know me as JDLO. I'm an AI Engineer based in San Francisco,
              the heart of Silicon Valley. I started from nothing, selling websites for a few hundred dollars.
              Now I build AI-powered systems, run automated sales teams, and work with companies doing
              billions in revenue.
            </p>
          </div>
        </FadeInItem>

        <FadeInItem>
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
        </FadeInItem>

        <FadeInItem>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Where I'm Based</h3>
            <p style={styles.text}>
              Being in San Francisco puts me right at the epicenter of technological innovation.
              It's an environment that constantly pushes me to stay ahead of the curve and explore
              new possibilities in AI and software development.
            </p>
          </div>
        </FadeInItem>

        <FadeInItem>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Skills & Technologies</h3>
            <motion.div
              style={styles.skills}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
              initial="hidden"
              animate="show"
            >
              {[
                'AI Agents', 'AI Automations', 'Sales Systems', 'Prompt Engineering',
                'React', 'Next.js', 'TypeScript', 'Python', 'Rust',
                'Node.js', 'Three.js', 'FastAPI', 'PostgreSQL', 'Redis',
                'Docker', 'AWS', 'Solana', 'WebSocket', 'AI/ML',
              ].map(skill => (
                <motion.span
                  key={skill}
                  style={styles.skillTag}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    show: { opacity: 1, scale: 1 },
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </FadeInItem>

        <FadeInItem>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Fun Fact</h3>
            <p style={styles.text}>
              When I'm not engineering AI solutions or building software, you'll find me teaching
              what I've learned — from AI automation and sales systems to prompt engineering and
              content strategy. I also mentor a limited group of people who are serious about execution.
            </p>
          </div>
        </FadeInItem>

        <FadeInItem>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Connect</h3>
            <p style={styles.text}>
              @jdlo on Instagram
            </p>
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
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: theme.colors.textPrimary,
    marginBottom: 24,
    letterSpacing: -0.3,
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
    paddingBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  text: {
    fontSize: 13,
    lineHeight: 1.7,
    color: theme.colors.textSecondary,
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    fontSize: 12,
    padding: '5px 12px',
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
    color: theme.colors.accent,
    fontFamily: theme.fonts.system,
    borderRadius: 100,
    fontWeight: 500,
  },
}
