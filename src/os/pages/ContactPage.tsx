import { useState } from 'react'
import { motion } from 'framer-motion'
import { theme } from '../theme'
import PageTransition, { FadeInItem } from '../components/PageTransition'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <PageTransition>
      <div style={styles.container}>
        <FadeInItem>
          <h2 style={styles.title}>Contact</h2>
        </FadeInItem>

        <FadeInItem>
          <p style={styles.text}>
            I'm always excited to hear about new projects and opportunities. Whether you need
            a website, custom software, AI automation solutions, or want to work together — I'd love to chat.
          </p>
        </FadeInItem>

        <FadeInItem>
          <p style={styles.text}>
            All messages get forwarded straight to my personal email. You can also find me on
            Instagram @jdlo.
          </p>
        </FadeInItem>

        {sent ? (
          <FadeInItem>
            <motion.div
              style={styles.success}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <p style={styles.successText}>Message sent! I'll get back to you soon.</p>
            </motion.div>
          </FadeInItem>
        ) : (
          <FadeInItem>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.field}>
                <label style={styles.label}>Name</label>
                <input
                  style={styles.input}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Message</label>
                <textarea
                  style={{ ...styles.input, height: 100, resize: 'vertical' as const }}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  required
                />
              </div>
              <motion.button
                type="submit"
                style={styles.submitBtn}
                whileHover={{ backgroundColor: theme.colors.accentHover }}
                whileTap={{ scale: 0.97 }}
              >
                Send Message
              </motion.button>
            </form>
          </FadeInItem>
        )}
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
    marginBottom: 16,
    letterSpacing: -0.3,
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
    paddingBottom: 12,
  },
  text: {
    fontSize: 13,
    lineHeight: 1.7,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  form: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.system,
  },
  input: {
    padding: '10px 14px',
    border: `1px solid ${theme.colors.inputBorder}`,
    backgroundColor: theme.colors.inputBg,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.system,
    fontSize: 13,
    borderRadius: theme.radius.input,
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: theme.colors.accent,
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontFamily: theme.fonts.system,
    fontSize: 13,
    fontWeight: 600,
    borderRadius: theme.radius.button,
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s ease',
  },
  success: {
    padding: 20,
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
    border: '1px solid rgba(48, 209, 88, 0.2)',
    borderRadius: theme.radius.card,
    marginTop: 20,
  },
  successText: {
    color: '#30d158',
    fontSize: 14,
    fontFamily: theme.fonts.system,
    fontWeight: 500,
  },
}
