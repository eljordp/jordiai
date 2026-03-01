import { motion } from 'framer-motion'
import { theme } from '../theme'
import PageTransition, { FadeInItem } from '../components/PageTransition'

const isMobile = window.innerWidth < 768

const projects = [
  {
    title: 'AI Trading Bot',
    tech: 'Rust, Tokio, Solana SDK, WebSocket, PostgreSQL',
    description: 'A high-performance trading bot that monitors tokens, scores opportunities in real-time, and executes MEV-protected trades through Jito bundles.',
  },
  {
    title: 'Multi-Interface Backend Framework',
    tech: 'Python, FastAPI, TypeScript, Claude API, Docker',
    description: 'A full-stack framework that generates REST APIs, CLI commands, MCP tools, and TypeScript SDKs from a single decorator. Write one method, get four interfaces.',
  },
  {
    title: 'AI Study Companion',
    tech: 'React Native, TypeScript, AI/ML, PostgreSQL',
    description: 'An AI-powered study companion mobile app. Transforms messy learning materials into structured study resources with adaptive planning, AI-generated flashcards, and personalized coaching.',
  },
  {
    title: 'Portfolio Analytics Dashboard',
    tech: 'Next.js 14, WebSocket, TypeScript, PostgreSQL',
    description: 'Next.js frontend with WebSocket updates for live P&L tracking, trade history, and portfolio analytics.',
  },
  {
    title: 'AI Automation Agency Site',
    tech: 'Next.js, React, Framer Motion, Tailwind CSS',
    description: 'Designed and developed the primary website for a leading AI agency. Built with a focus on visual impact and conversion optimization with smooth animations and responsive design.',
  },
  {
    title: 'Client Website Portfolio',
    tech: 'Modern Web Technologies, Responsive Design, SEO',
    description: 'A collection of websites designed and developed for clients. Each site is crafted with attention to performance, user experience, and modern design principles.',
  },
]

export default function ProjectsPage() {
  return (
    <PageTransition>
      <div style={styles.container}>
        <FadeInItem>
          <h2 style={styles.title}>Projects</h2>
          <p style={styles.intro}>
            A collection of software I've built — spanning AI-powered trading systems,
            low-latency blockchain infrastructure, and web applications. Each project
            solves real problems with production-grade architecture.
          </p>
        </FadeInItem>

        <div style={styles.grid}>
          {projects.map((project, i) => (
            <FadeInItem key={i}>
              <motion.div
                style={styles.card}
                whileHover={{
                  backgroundColor: theme.colors.cardHoverBg,
                  transition: { duration: 0.2 },
                }}
              >
                <h3 style={styles.projectTitle}>{project.title}</h3>
                <p style={styles.tech}>{project.tech}</p>
                <p style={styles.desc}>{project.description}</p>
              </motion.div>
            </FadeInItem>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: isMobile ? 20 : 28,
    fontFamily: theme.fonts.system,
    color: theme.colors.textPrimary,
  },
  title: {
    fontSize: isMobile ? 20 : 22,
    fontWeight: 700,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
    paddingBottom: 12,
  },
  intro: {
    fontSize: 13,
    lineHeight: 1.7,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: 12,
  },
  card: {
    padding: isMobile ? 16 : 18,
    backgroundColor: theme.colors.cardBg,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: theme.radius.card,
    cursor: 'default',
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.accent,
    marginBottom: 6,
  },
  tech: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginBottom: 10,
    fontFamily: theme.fonts.mono,
  },
  desc: {
    fontSize: 12,
    lineHeight: 1.6,
    color: theme.colors.textSecondary,
  },
}
