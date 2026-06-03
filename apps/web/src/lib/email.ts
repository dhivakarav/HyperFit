import nodemailer from 'nodemailer'

// Gmail SMTP transport. Configure in apps/web/.env.local:
//   SMTP_USER=your-gmail@gmail.com
//   SMTP_PASS=your-16-char-app-password   (https://myaccount.google.com/apppasswords)
//   EMAIL_FROM="HyperFit <your-gmail@gmail.com>"
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const EMAIL_FROM = process.env.EMAIL_FROM || (SMTP_USER ? `HyperFit <${SMTP_USER}>` : 'HyperFit <noreply@hyperfit.com>')

const isConfigured = Boolean(SMTP_USER && SMTP_PASS)

let transport: nodemailer.Transporter | null = null
function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  return transport
}

/**
 * Sends an email via Gmail SMTP. If SMTP credentials are not configured yet,
 * it falls back to logging the message to the server console (dev mode) so the
 * OTP flow still works end-to-end without blocking on email setup.
 */
export async function sendMail(opts: { to: string; subject: string; html: string; devNote?: string }) {
  if (!isConfigured) {
    console.warn(
      `\n📧 [email fallback — SMTP not configured]\n  To: ${opts.to}\n  Subject: ${opts.subject}` +
        (opts.devNote ? `\n  ${opts.devNote}` : '') +
        `\n  → Set SMTP_USER and SMTP_PASS in apps/web/.env.local to send real emails.\n`
    )
    return { fallback: true as const }
  }
  await getTransport().sendMail({ from: EMAIL_FROM, to: opts.to, subject: opts.subject, html: opts.html })
  return { fallback: false as const }
}

export async function sendOtpEmail(email: string, code: string) {
  return sendMail({
    to: email,
    subject: `Your HyperFit verification code: ${code}`,
    devNote: `OTP CODE: ${code}`,
    html: `
      <div style="font-family: sans-serif; background: #0a0a0a; color: #f8f8f8; padding: 40px; max-width: 500px; margin: 0 auto;">
        <h1 style="font-family: sans-serif; color: #c8102e; font-size: 28px; margin-bottom: 8px;">HYPERFIT</h1>
        <p style="color: #888; margin-bottom: 32px;">Performance Meets Luxury</p>
        <h2 style="font-size: 18px; margin-bottom: 16px;">Your verification code</h2>
        <div style="background: #1c1c1c; border: 1px solid #444; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #c8102e;">${code}</span>
        </div>
        <p style="color: #888; font-size: 14px;">This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  })
}

export async function sendOrderConfirmation(
  email: string,
  order: { orderNumber: string; total: number; items: Array<{ name: string; quantity: number; price: number }> }
) {
  const itemRows = order.items
    .map((item) => `<tr><td style="padding: 8px 0; color: #f8f8f8;">${item.name}</td><td style="padding: 8px 0; color: #888;">x${item.quantity}</td><td style="padding: 8px 0; color: #c8102e; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td></tr>`)
    .join('')

  return sendMail({
    to: email,
    subject: `Order Confirmed — #${order.orderNumber}`,
    html: `
      <div style="font-family: sans-serif; background: #0a0a0a; color: #f8f8f8; padding: 40px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #c8102e; font-size: 28px;">HYPERFIT</h1>
        <h2 style="margin: 24px 0 8px;">Order Confirmed!</h2>
        <p style="color: #888;">Order #${order.orderNumber}</p>
        <table style="width: 100%; border-top: 1px solid #444; margin-top: 24px;">${itemRows}</table>
        <div style="border-top: 1px solid #444; margin-top: 16px; padding-top: 16px; text-align: right;">
          <span style="color: #c8102e; font-size: 20px; font-weight: bold;">Total: ₹${order.total.toLocaleString()}</span>
        </div>
        <p style="color: #888; margin-top: 32px; font-size: 14px;">You'll receive a shipping confirmation once your order is dispatched.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  return sendMail({
    to: email,
    subject: 'Reset your HyperFit password',
    devNote: `RESET URL: ${resetUrl}`,
    html: `
      <div style="font-family: sans-serif; background: #0a0a0a; color: #f8f8f8; padding: 40px; max-width: 500px; margin: 0 auto;">
        <h1 style="color: #c8102e; font-size: 28px;">HYPERFIT</h1>
        <h2 style="margin: 24px 0 16px;">Reset your password</h2>
        <a href="${resetUrl}" style="display: inline-block; background: #c8102e; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 2px;">Reset Password</a>
        <p style="color: #888; margin-top: 24px; font-size: 14px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}
