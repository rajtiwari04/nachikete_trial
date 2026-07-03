import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, Users, Award, Zap } from 'lucide-react';

const STATS = [
  { icon: Users,    value: '2,000+', label: 'Active Members' },
  { icon: Calendar, value: '150+',   label: 'Events Hosted' },
  { icon: Award,    value: '50+',    label: 'Awards Won' },
  { icon: Zap,      value: '8+',     label: 'Years Strong' },
];

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 600], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-background pt-16">

      {/* ─── Ambient Background ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mesh gradient */}
        <div className="absolute inset-0 bg-mesh" />
        {/* Orbs */}
        <div className="floating-orb w-[600px] h-[600px] -top-32 -left-32 bg-indigo-200 animation-delay-0" style={{ animationDelay: '0s' }} />
        <div className="floating-orb w-[400px] h-[400px] top-1/4 -right-20 bg-lavender-200" style={{ animationDelay: '3s' }} />
        <div className="floating-orb w-[300px] h-[300px] bottom-1/4 left-1/4 bg-sage-100" style={{ animationDelay: '5s' }} />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center"
      >
        {/* ─── Announcement pill ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <Link to="/events" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 rounded-full shadow-soft-sm hover:shadow-soft hover:border-indigo-200 transition-all duration-300 group">
            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              <Sparkles size={10} className="animate-pulse-soft" /> New
            </span>
            <span className="text-sm text-text-secondary">TechFest 2025 registrations are open</span>
            <ArrowRight size={13} className="text-text-muted group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all duration-200" />
          </Link>
        </motion.div>

        {/* ─── Headline ─────────────────────────────────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight-display text-text-primary leading-[1.05] max-w-4xl text-balance"
        >
          Where{' '}
          <span className="relative">
            <span className="gradient-text">curiosity</span>
            <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 6" fill="none">
              <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="url(#u1)" strokeWidth="2" fill="none" />
              <defs>
                <linearGradient id="u1" x1="0" y1="0" x2="200" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          {' '}meets{' '}
          <span className="gradient-text-warm">excellence</span>
        </motion.h1>

        {/* ─── Subheadline ──────────────────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed text-pretty"
        >
          Nachiketa is a premier college society uniting students through innovation, technical mastery, and creative exploration. Join thousands of minds shaping the future.
        </motion.p>

        {/* ─── CTA buttons ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link to="/events"
            className="btn-primary px-7 py-3 text-base gap-2 shadow-glow-indigo hover:shadow-glow-soft"
          >
            Explore Events <ArrowRight size={16} />
          </Link>
          <Link to="/membership"
            className="btn-secondary px-7 py-3 text-base"
          >
            Join the Society
          </Link>
          <Link to="/about"
            className="btn-ghost px-5 py-3 text-base text-text-muted hover:text-text-secondary"
          >
            Learn more →
          </Link>
        </motion.div>

        {/* ─── Social proof ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {['A','B','C','D','E'].map((l, i) => (
              <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${
                ['bg-indigo-400','bg-lavender-400','bg-rose-400','bg-sage-400','bg-amber-400'][i]
              }`}>{l}</div>
            ))}
          </div>
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">2,000+</span> students already part of Nachiketa
          </p>
        </motion.div>

        {/* ─── Stats ────────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 w-full max-w-3xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                className="card-glass text-center py-5 px-4 hover:shadow-soft-md transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-100 transition-colors">
                  <Icon size={18} className="text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-text-primary tracking-tight">{value}</p>
                <p className="text-xs text-text-muted mt-0.5">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ─── Scroll indicator ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-text-muted uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border border-cream-300 rounded-full flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-1.5 bg-indigo-400 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
