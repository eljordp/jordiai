import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../theme'
import PageTransition, { FadeInItem } from '../components/PageTransition'

const isMobile = window.innerWidth < 768

interface Module {
  title: string
  lessons: string[]
}

interface Course {
  id: string
  title: string
  tagline: string
  description: string
  color: string
  icon: string
  duration: string
  modules: Module[]
  outcomes: string[]
}

const courses: Course[] = [
  {
    id: 'personal-growth',
    title: 'Personal Growth & Discipline',
    tagline: 'Build the machine that builds everything else.',
    description:
      'The system I used to go from scattered and broke to structured, disciplined, and productive every single day. This isn\'t motivation — it\'s architecture. You\'ll build a daily operating system that eliminates decision fatigue, kills procrastination, and compounds your output week over week.',
    color: '#30d158',
    icon: '◆',
    duration: '6 weeks',
    modules: [
      {
        title: 'The Foundation',
        lessons: [
          'Why discipline beats motivation every time',
          'Auditing your current habits — finding the leaks',
          'Designing your non-negotiable daily schedule',
          'The "no phone until 2:30 PM" protocol',
        ],
      },
      {
        title: 'Morning Architecture',
        lessons: [
          'Wake protocol — 6:30 AM, no snooze, no negotiation',
          'Morning walk + sunlight: the science of circadian reset',
          'Bodyweight routine that takes 30 minutes, not 2 hours',
          'Deep work blocks — 3 hours of highest-priority output',
        ],
      },
      {
        title: 'Energy Management',
        lessons: [
          'Meal timing — first meal at noon, last at 6:30',
          'Whole foods over supplements: the 80/20 of nutrition',
          'PM workout programming — gym or home, no excuses',
          'Sunset walk and the power of daily decompression',
        ],
      },
      {
        title: 'Mental Warfare',
        lessons: [
          'Killing the inner bitch — reframing avoidance as data',
          'Phone discipline — 30 minutes a day, that\'s it',
          'Building a wall around your focus hours',
          'Weekend recovery without losing momentum',
        ],
      },
      {
        title: 'Compounding Results',
        lessons: [
          'Weekly reviews — what moved, what didn\'t, what changes',
          'Stacking wins: how small consistency creates big outcomes',
          'Accountability structures that actually work',
          'Scaling your system as your life gets busier',
        ],
      },
    ],
    outcomes: [
      'A printed daily schedule you actually follow',
      'Consistent 3+ hour deep work blocks every morning',
      'Phone addiction eliminated — 30 min/day max',
      'Physical routine you maintain without thinking',
      'Mental clarity and decision-making speed 10x\'d',
    ],
  },
  {
    id: 'operator-playbook',
    title: 'The Operator Playbook',
    tagline: 'Run the operation. Scale the machine.',
    description:
      'Everything I\'ve learned scaling businesses from the inside — as COO, systems operator, and the person who actually makes things work. This is the playbook for becoming the operator every founder needs: the one who builds the systems, closes the deals, and ships the product while everyone else is still talking about it.',
    color: '#bf5af2',
    icon: '⬡',
    duration: '8 weeks',
    modules: [
      {
        title: 'Operator Mindset',
        lessons: [
          'What an operator actually does (and doesn\'t do)',
          'Founder vs. operator — know your lane, own your lane',
          'The "make shit happen" framework',
          'Building trust with founders in the first 30 days',
        ],
      },
      {
        title: 'Systems Architecture',
        lessons: [
          'Auditing a business in 48 hours — what to look for',
          'Building SOPs that people actually follow',
          'Tool stack selection — CRM, project management, automation',
          'AI-powered workflows that replace 3 hires',
        ],
      },
      {
        title: 'Sales Operations',
        lessons: [
          'Building a sales process from zero',
          'Appointment setting systems that run without you',
          'Closing framework — from discovery to signed contract',
          'Pricing strategy: $1K for early supporters, $5K+ for value',
        ],
      },
      {
        title: 'Client Delivery',
        lessons: [
          'Scoping projects so they don\'t blow up',
          'Managing client expectations without being a pushover',
          'Building with AI: shipping 10x faster than competitors',
          'Quality control when you\'re moving fast',
        ],
      },
      {
        title: 'Scaling & Revenue',
        lessons: [
          'From one-time projects to recurring revenue',
          'Retainer structures that keep clients paying monthly',
          'When to hire vs. automate vs. do it yourself',
          'Building a team of operators who don\'t need babysitting',
        ],
      },
      {
        title: 'The Business Stack',
        lessons: [
          'LLC setup, contracts, and invoicing — the boring stuff that matters',
          'Portfolio building — showing value before they ask',
          'Networking: leveraging a large network without being annoying',
          'Path to $10K/mo and beyond',
        ],
      },
    ],
    outcomes: [
      'A repeatable system for onboarding into any business',
      'Sales process that closes $5K+ deals consistently',
      'AI automation toolkit that replaces manual work',
      'Retainer-based revenue model generating MRR',
      'Operator reputation that attracts founders to you',
    ],
  },
]

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [expandedModule, setExpandedModule] = useState<number | null>(null)

  return (
    <PageTransition>
      <div style={styles.container}>
        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <FadeInItem>
                <h2 style={styles.title}>Courses</h2>
                <p style={styles.intro}>
                  Real systems I built and use every day. Not theory — architecture.
                  Each course is a complete operating system you can deploy into your life or business immediately.
                </p>
              </FadeInItem>

              <div style={styles.grid}>
                {courses.map((course) => (
                  <FadeInItem key={course.id}>
                    <motion.div
                      style={{ ...styles.courseCard, borderLeft: `3px solid ${course.color}` }}
                      whileHover={{
                        backgroundColor: theme.colors.cardHoverBg,
                        y: -2,
                        transition: { duration: 0.2 },
                      }}
                      onClick={() => {
                        setSelectedCourse(course)
                        setExpandedModule(null)
                      }}
                    >
                      <div style={styles.courseHeader}>
                        <span style={{ ...styles.courseIcon, color: course.color }}>{course.icon}</span>
                        <span style={styles.courseDuration}>{course.duration}</span>
                      </div>
                      <h3 style={{ ...styles.courseTitle, color: course.color }}>{course.title}</h3>
                      <p style={styles.courseTagline}>{course.tagline}</p>
                      <p style={styles.courseDesc}>{course.description.slice(0, 120)}...</p>
                      <div style={styles.moduleCount}>
                        {course.modules.length} modules · {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                      </div>
                    </motion.div>
                  </FadeInItem>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div style={styles.backRow}>
                <motion.span
                  style={styles.backBtn}
                  whileHover={{ color: theme.colors.textPrimary }}
                  onClick={() => setSelectedCourse(null)}
                >
                  ← Back to courses
                </motion.span>
              </div>

              <div style={styles.detailHeader}>
                <span style={{ ...styles.detailIcon, color: selectedCourse.color }}>
                  {selectedCourse.icon}
                </span>
                <div>
                  <h2 style={{ ...styles.detailTitle, color: selectedCourse.color }}>
                    {selectedCourse.title}
                  </h2>
                  <p style={styles.detailTagline}>{selectedCourse.tagline}</p>
                </div>
              </div>

              <p style={styles.detailDesc}>{selectedCourse.description}</p>

              <div style={styles.metaRow}>
                <span style={styles.metaItem}>⏱ {selectedCourse.duration}</span>
                <span style={styles.metaItem}>
                  📦 {selectedCourse.modules.length} modules
                </span>
                <span style={styles.metaItem}>
                  📄 {selectedCourse.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons
                </span>
              </div>

              <p style={styles.sectionLabel}>CURRICULUM</p>
              <div style={styles.moduleList}>
                {selectedCourse.modules.map((mod, i) => (
                  <motion.div
                    key={i}
                    style={{
                      ...styles.moduleCard,
                      borderLeft: expandedModule === i
                        ? `2px solid ${selectedCourse.color}`
                        : '2px solid transparent',
                    }}
                    whileHover={{ backgroundColor: theme.colors.cardHoverBg }}
                    onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                  >
                    <div style={styles.moduleHeader}>
                      <span style={styles.moduleNum}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={styles.moduleTitle}>{mod.title}</span>
                      <span style={styles.moduleArrow}>
                        {expandedModule === i ? '−' : '+'}
                      </span>
                    </div>
                    <AnimatePresence>
                      {expandedModule === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={styles.lessonList}>
                            {mod.lessons.map((lesson, j) => (
                              <div key={j} style={styles.lessonItem}>
                                <span style={{ ...styles.lessonDot, backgroundColor: selectedCourse.color }} />
                                <span style={styles.lessonText}>{lesson}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              <p style={styles.sectionLabel}>WHAT YOU WALK AWAY WITH</p>
              <div style={styles.outcomeList}>
                {selectedCourse.outcomes.map((outcome, i) => (
                  <div key={i} style={styles.outcomeItem}>
                    <span style={{ ...styles.outcomeDot, backgroundColor: selectedCourse.color }}>✓</span>
                    <span style={styles.outcomeText}>{outcome}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: isMobile ? 16 : 28,
    fontFamily: theme.fonts.system,
    color: theme.colors.textPrimary,
  },
  title: {
    fontSize: isMobile ? 20 : 22,
    fontWeight: 700,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.3,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  intro: {
    fontSize: 13,
    lineHeight: 1.7,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  courseCard: {
    padding: isMobile ? 16 : 20,
    backgroundColor: theme.colors.cardBg,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: theme.radius.card,
    cursor: 'pointer',
  },
  courseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseIcon: {
    fontSize: 18,
  },
  courseDuration: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.mono,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  courseTagline: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  courseDesc: {
    fontSize: 12,
    lineHeight: 1.6,
    color: theme.colors.textTertiary,
    marginBottom: 12,
  },
  moduleCount: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.mono,
  },

  // Detail view
  backRow: {
    marginBottom: 16,
  },
  backBtn: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    cursor: 'pointer',
    fontWeight: 500,
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  detailIcon: {
    fontSize: 28,
  },
  detailTitle: {
    fontSize: isMobile ? 18 : 20,
    fontWeight: 700,
    marginBottom: 2,
  },
  detailTagline: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  detailDesc: {
    fontSize: 13,
    lineHeight: 1.7,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  metaRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    fontFamily: theme.fonts.mono,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: theme.colors.textPrimary,
    letterSpacing: 2,
    marginBottom: 12,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: 6,
  },
  moduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 24,
  },
  moduleCard: {
    padding: '10px 14px',
    backgroundColor: theme.colors.cardBg,
    border: `1px solid ${theme.colors.cardBorder}`,
    borderRadius: theme.radius.card,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  moduleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  moduleNum: {
    fontSize: 11,
    fontFamily: theme.fonts.mono,
    color: theme.colors.textTertiary,
    minWidth: 20,
  },
  moduleTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  moduleArrow: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    fontWeight: 300,
  },
  lessonList: {
    paddingTop: 10,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  lessonItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  lessonDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    flexShrink: 0,
  },
  lessonText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 1.5,
  },
  outcomeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  outcomeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  outcomeDot: {
    fontSize: 10,
    fontWeight: 700,
    color: '#000',
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  outcomeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 1.5,
  },
}
