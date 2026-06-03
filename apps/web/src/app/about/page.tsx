import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About HyperFit' }

const STATS = [
  { value: '50K+', label: 'Designs Created' },
  { value: '200+', label: 'Styles Available' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '48hr', label: 'Express Dispatch' },
]

const VALUES = [
  { title: 'Innovation', description: 'AI-powered design tools that put creative control in your hands.' },
  { title: 'Sustainability', description: 'Responsibly sourced materials. Every piece made to order — zero waste.' },
  { title: 'Performance', description: 'Every product engineered for athletes and everyday achievers.' },
  { title: 'Community', description: 'Built by and for the culture. We are the streets.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#ffffff] py-32 text-center">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(#c8102e 1px, transparent 1px), linear-gradient(90deg, #c8102e 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.4em] mb-4">Our Story</p>
          <h1 className="font-display text-[15vw] sm:text-[10vw] lg:text-[8vw] leading-none text-[#0a0a0a] mb-6">
            BUILT FOR<br />
            <span className="text-[#c8102e]">THE FUTURE</span>
          </h1>
          <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
            HyperFit was born from a simple belief: your style should be as unique as you are. We built an AI-powered platform to make custom fashion accessible, instant, and extraordinary.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#c8102e] py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-6xl text-[#ffffff]">{value}</p>
                <p className="text-[#ffffff]/60 text-sm font-bold uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="py-24 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.3em] mb-4">Our Mission</p>
            <h2 className="font-display text-6xl text-[#0a0a0a] mb-6">DEMOCRATIZE<br />LUXURY</h2>
            <p className="text-[#6b6b6b] text-lg leading-relaxed mb-6">
              Premium athletic fashion used to mean premium prices and zero personalization. We changed that. With AI-powered customization and direct-to-consumer pricing, HyperFit makes it possible for everyone to wear something truly their own.
            </p>
            <p className="text-[#6b6b6b] text-lg leading-relaxed">
              Founded in 2024, we've grown from a small team of fashion designers and engineers to a full-scale platform serving customers across India — with global expansion on the horizon.
            </p>
          </div>
          <div className="bg-[#f2f2f2] aspect-square flex items-center justify-center">
            <span className="font-display text-[8vw] text-[#c8102e]">HF</span>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-24 bg-[#f2f2f2]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.3em] mb-4 text-center">What We Stand For</p>
          <h2 className="font-display text-6xl text-[#0a0a0a] mb-12 text-center">OUR VALUES</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ title, description }) => (
              <div key={title} className="p-6 border border-[#d8d8d8] hover:border-[#c8102e] transition-colors">
                <h3 className="font-display text-3xl text-[#c8102e] mb-3">{title.toUpperCase()}</h3>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
