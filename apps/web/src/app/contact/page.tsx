'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Button, Input, Textarea, Select } from '@hyperfit/ui'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.3em] mb-3">Get in Touch</p>
          <h1 className="font-display text-7xl text-[#0a0a0a]">CONTACT US</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="success" className="flex flex-col items-center justify-center h-64 gap-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <CheckCircle size={48} className="text-[#c8102e]" />
                  <h2 className="font-bold text-xl text-[#0a0a0a]">Message Sent!</h2>
                  <p className="text-[#6b6b6b] text-center">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <Select
                    label="Subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    options={[
                      { value: '', label: 'Select a topic' },
                      { value: 'order', label: 'Order Issue' },
                      { value: 'returns', label: 'Returns & Refunds' },
                      { value: 'custom', label: 'Custom Design Query' },
                      { value: 'sizing', label: 'Sizing Help' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />
                  <Textarea
                    label="Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    required
                    placeholder="Tell us how we can help..."
                  />
                  <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                    Send Message
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div className="p-6 bg-[#f2f2f2] border border-[#e8e8e8]">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#6b6b6b] mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#0a0a0a]">
                  <Mail size={18} className="text-[#c8102e] shrink-0" />
                  <span className="text-sm">support@hyperfit.com</span>
                </div>
                <div className="flex items-center gap-3 text-[#0a0a0a]">
                  <Phone size={18} className="text-[#c8102e] shrink-0" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-[#0a0a0a]">
                  <MapPin size={18} className="text-[#c8102e] shrink-0" />
                  <span className="text-sm">123 Fashion Street, Chennai, Tamil Nadu 600001</span>
                </div>
                <div className="flex items-center gap-3 text-[#0a0a0a]">
                  <Clock size={18} className="text-[#c8102e] shrink-0" />
                  <span className="text-sm">Mon–Sat: 9am–7pm IST</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#f2f2f2] border border-[#e8e8e8]">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#6b6b6b] mb-4">Response Time</h3>
              <p className="text-[#0a0a0a] text-sm leading-relaxed">
                We typically respond within <span className="text-[#c8102e] font-bold">4–8 hours</span> during business hours. For urgent order issues, please include your order number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
