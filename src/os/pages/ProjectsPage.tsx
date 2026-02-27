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
    <div style={styles.container}>
      <h2 style={styles.title}>Projects</h2>
      <p style={styles.intro}>
        A collection of software I've built — spanning AI-powered trading systems,
        low-latency blockchain infrastructure, and web applications. Each project
        solves real problems with production-grade architecture.
      </p>

      <div style={styles.grid}>
        {projects.map((project, i) => (
          <div key={i} style={styles.card}>
            <h3 style={styles.projectTitle}>{project.title}</h3>
            <p style={styles.tech}>{project.tech}</p>
            <p style={styles.desc}>{project.description}</p>
          </div>
        ))}
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
    marginBottom: 12,
    borderBottom: '2px solid #000080',
    paddingBottom: 8,
  },
  intro: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#333',
    marginBottom: 20,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  card: {
    padding: 14,
    backgroundColor: '#f0f0f0',
    border: '2px outset #dfdfdf',
  },
  projectTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 6,
  },
  tech: {
    fontSize: 10,
    color: '#888',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  desc: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#333',
  },
}
