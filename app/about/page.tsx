import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="bg-white text-zinc-900 font-sans">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">Nevertheless</Link>
          <div className="hidden md:flex items-center gap-8">
            {([['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} className={`text-xs tracking-widest uppercase transition-colors ${href === '/about' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16 min-h-[70vh] flex flex-col justify-end relative overflow-hidden bg-zinc-900">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-6">— About Us</p>
          <h1
            className="text-6xl md:text-8xl font-bold text-white leading-[0.95] tracking-tight max-w-4xl mb-8"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Built for<br />
            <span className="italic font-normal">leaders</span><br />
            who act.
          </h1>
          <p className="text-zinc-400 text-base max-w-xl leading-relaxed">
            Nevertheless is more than a platform — it's a space where ideas become decisions, and decisions become progress.
          </p>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-px bg-zinc-200">
            {[
              { value: '999999999+', label: 'Events Produced' },
              { value: '5,000+', label: 'Leaders Connected' },
              { value: '8+', label: 'Years of Impact' },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-50 px-10 py-10 text-center">
                <p className="text-5xl font-bold text-zinc-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>{stat.value}</p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-6">— Our Mission</p>
              <h2
                className="text-5xl font-bold tracking-tight leading-tight mb-8"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                To be the catalyst for bold ideas and authentic connections.
              </h2>
              <p className="text-base text-zinc-500 leading-relaxed mb-6">
                We exist to create environments where leaders don't just attend — they leave changed. Every event, every conversation, every insight we curate is designed with one purpose: real, lasting impact.
              </p>
              <p className="text-base text-zinc-500 leading-relaxed">
                We envision a world where progress isn't a buzzword but a lived experience — shaped by people who gather with intention and leave with conviction.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-zinc-100 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center">
                  <p className="text-zinc-400 text-xs tracking-widest uppercase">Mission Image</p>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-zinc-900 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="h-px bg-zinc-100 max-w-6xl mx-auto" />

      {/* VISION */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="relative order-2 md:order-1">
              <div className="aspect-[4/5] bg-zinc-100 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-200 flex items-center justify-center">
                  <p className="text-zinc-400 text-xs tracking-widest uppercase">Vision Image</p>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-zinc-100 -z-10" />
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-6">— Our Vision</p>
              <h2
                className="text-5xl font-bold tracking-tight leading-tight mb-8"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Empowering organizations to shape what comes next.
              </h2>
              <p className="text-base text-zinc-500 leading-relaxed mb-6">
                We see a future where organizations don't just react to change — they architect it. Nevertheless is building the infrastructure for that future: through events, dialogue, and a community of leaders who refuse to settle.
              </p>
              <p className="text-base text-zinc-500 leading-relaxed">
                Our vision is simple: connect the right people, spark the right conversations, and trust that what happens next will be remarkable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="py-32 bg-zinc-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-20">
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 mb-6">— Who We Are</p>
            <h2
              className="text-5xl md:text-6xl font-bold leading-tight tracking-tight"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              A team obsessed with meaningful experiences.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-zinc-700">
            {[
              {
                title: 'Curators',
                desc: 'We don\'t just fill rooms — we design experiences. Every detail, from the agenda to the atmosphere, is intentional.',
              },
              {
                title: 'Connectors',
                desc: 'We bring together C-suite executives, people leaders, and technology pioneers who are driving real transformation.',
              },
              {
                title: 'Catalysts',
                desc: 'We believe the best ideas emerge when the right people are in the same room. We build that room.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-zinc-900 p-10">
                <div className="w-8 h-px bg-zinc-600 mb-8" />
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-4">— What We Stand For</p>
              <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Our values.
              </h2>
            </div>
          </div>
          <div className="space-y-px">
            {[
              { number: '01', title: 'Intentionality', desc: 'Every decision we make — from venue to speaker selection — is deliberate. We don\'t do things by accident.' },
              { number: '02', title: 'Integrity', desc: 'We say what we mean and deliver what we promise. Our reputation is built on trust.' },
              { number: '03', title: 'Impact', desc: 'We measure success not by attendance numbers but by the change that happens after people leave.' },
              { number: '04', title: 'Inclusion', desc: 'The best ideas come from diverse perspectives. We actively build rooms that reflect the world we want to lead.' },
            ].map((value) => (
              <div
                key={value.number}
                className="group flex items-start gap-8 p-8 bg-zinc-50 hover:bg-zinc-900 transition-colors duration-300"
              >
                <p
                  className="text-2xl font-bold text-zinc-200 group-hover:text-zinc-700 transition-colors shrink-0 w-12"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {value.number}
                </p>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-white transition-colors mb-2">{value.title}</h3>
                  <p className="text-sm text-zinc-500 group-hover:text-zinc-400 leading-relaxed transition-colors">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-6">— Join Us</p>
          <h2
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Ready to be part of<br />
            <span className="italic font-normal">something bigger?</span>
          </h2>
          <p className="text-zinc-500 text-base max-w-md mx-auto mb-12 leading-relaxed">
            Whether you want to attend an event, speak at one, or partner with us — the conversation starts here.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/contact"
              className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-10 py-5 hover:bg-zinc-700 transition-colors"
            >
              Get In Touch
            </Link>
            <Link
              href="/events"
              className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              View Events →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</Link>
          <div className="flex items-center gap-8">
            {(['About', 'Events', 'Blog', 'Gallery', 'Contact'] as string[]).map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
        </div>
      </footer>
    </main>
  )
}
