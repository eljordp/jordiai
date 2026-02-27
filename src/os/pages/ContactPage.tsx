import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Contact</h2>

      <p style={styles.text}>
        I'm always excited to hear about new projects and opportunities. Whether you need
        a website, custom software, or AI automation solutions, I'd love to chat!
      </p>

      <p style={styles.text}>
        All messages get forwarded straight to my personal email.
      </p>

      {sent ? (
        <div style={styles.success}>
          <p style={styles.successText}>Message sent! I'll get back to you soon.</p>
        </div>
      ) : (
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
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
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Message</label>
            <textarea
              style={{ ...styles.input, height: 100, resize: 'vertical' as const }}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <button type="submit" style={styles.submitBtn}>
            Send Message
          </button>
        </form>
      )}
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
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#333',
    marginBottom: 12,
  },
  form: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'monospace',
  },
  input: {
    padding: 10,
    border: '2px inset #808080',
    backgroundColor: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
    outline: 'none',
  },
  submitBtn: {
    padding: '12px 24px',
    backgroundColor: '#000080',
    color: '#fff',
    border: '2px outset #4444aa',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  success: {
    padding: 16,
    backgroundColor: '#e8f5e9',
    border: '2px inset #808080',
    marginTop: 16,
  },
  successText: {
    color: '#2e7d32',
    fontSize: 13,
    fontFamily: 'monospace',
  },
}
