import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, MapPin, Star, ChevronRight, Zap, Book, Users } from 'lucide-react';
import HeroSection from '@/components/sections/HeroSection';
import { eventsAPI, blogsAPI, sponsorsAPI } from '@/lib/api';
import { format } from 'date-fns';

// ─── Fade-up animation wrapper ─────────────────────────────────────────────────
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, delay }) {
  const categoryColors = {
    workshop: 'badge-indigo', seminar: 'badge-lavender', hackathon: 'badge-green',
    cultural: 'badge-amber', technical: 'badge-indigo', other: 'badge-gray',
  };

  return (
    <FadeUp delay={delay}>
      <Link to={`/events/${event.slug}`} className="group block">
        <div className="card-hover overflow-hidden p-0">
          {/* Banner */}
          <div className="relative h-44 bg-gradient-to-br from-indigo-50 to-lavender-50 overflow-hidden">
            {event.banner ? (
              <img src={event.banner} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center shadow-soft">
                  <Calendar size={28} className="text-indigo-400" />
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <span className={`${categoryColors[event.category] || 'badge-gray'} capitalize`}>
                {event.category}
              </span>
            </div>
            {event.isPaid && (
              <div className="absolute top-3 right-3">
                <span className="badge badge-green">₹{event.price}</span>
              </div>
            )}
            {!event.isPaid && (
              <div className="absolute top-3 right-3">
                <span className="badge bg-sage-50 text-sage-700 border border-sage-100">Free</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-text-primary text-base line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 mb-3">
              {event.title}
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Calendar size={12} className="text-indigo-400" />
                {event.date ? format(new Date(event.date), 'MMM d, yyyy') : '—'}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock size={12} className="text-indigo-400" />
                {event.time || 'TBA'}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <MapPin size={12} className="text-indigo-400" />
                {event.venue?.name || 'Venue TBA'}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-text-muted">
                {event.maxSeats
                  ? <span>{event.registeredCount}/{event.maxSeats} registered</span>
                  : <span>{event.registeredCount} registered</span>
                }
              </div>
              <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                View <ArrowRight size={11} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </FadeUp>
  );
}

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog, delay }) {
  return (
    <FadeUp delay={delay}>
      <Link to={`/blogs/${blog.slug}`} className="group flex gap-4 p-4 rounded-xl hover:bg-cream-50 transition-colors border border-transparent hover:border-border">
        <div className="w-16 h-16 rounded-xl bg-indigo-50 flex-shrink-0 overflow-hidden">
          {blog.coverImage
            ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
            : <Book size={24} className="text-indigo-300 m-auto mt-4" />
          }
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-muted mb-1">{blog.readTime} min read</p>
          <h4 className="font-semibold text-sm text-text-primary line-clamp-2 group-hover:text-indigo-600 transition-colors">{blog.title}</h4>
          <p className="text-xs text-text-muted mt-1 line-clamp-1">{blog.excerpt}</p>
        </div>
      </Link>
    </FadeUp>
  );
}

// ─── Feature pill ─────────────────────────────────────────────────────────────
function FeaturePill({ icon: Icon, label, color }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${color}`}>
      <Icon size={14} /> {label}
    </div>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: eventsData } = useQuery({
    queryKey: ['events', 'featured'],
    queryFn: () => eventsAPI.getAll({ status: 'upcoming', limit: 3, sort: 'date' }),
  });

  const { data: blogsData } = useQuery({
    queryKey: ['blogs', 'home'],
    queryFn: () => blogsAPI.getAll({ limit: 4 }),
  });

  const { data: sponsorsData } = useQuery({
    queryKey: ['sponsors'],
    queryFn: () => sponsorsAPI.getAll(),
  });

  const events  = eventsData?.data?.events  || [];
  const blogs   = blogsData?.data?.blogs    || [];
  const sponsors= sponsorsData?.data?.sponsors || [];

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ─── Features strip ────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-cream-50/50 py-5 overflow-hidden">
        <div className="flex animate-scroll gap-4 w-max">
          {[...Array(2)].map((_, pass) => (
            <div key={pass} className="flex items-center gap-4">
              {[
                { icon: Zap,      label: 'Hackathons',        color: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
                { icon: Users,    label: 'Workshops',         color: 'bg-lavender-50 border-lavender-100 text-lavender-700' },
                { icon: Star,     label: 'Competitions',      color: 'bg-rose-50 border-rose-100 text-rose-700' },
                { icon: Book,     label: 'Seminars',          color: 'bg-sage-50 border-sage-100 text-sage-700' },
                { icon: Calendar, label: 'Cultural Events',   color: 'bg-amber-50 border-amber-100 text-amber-700' },
                { icon: Users,    label: 'Networking',        color: 'bg-cream-100 border-cream-300 text-text-secondary' },
              ].map(f => <FeaturePill key={f.label + pass} {...f} />)}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Upcoming Events ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-lg">
          <div className="flex items-end justify-between mb-10">
            <FadeUp>
              <p className="section-label">What's happening</p>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Don't miss out on our carefully curated events designed to ignite your passion.</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link to="/events" className="btn-ghost text-indigo-600 hidden md:flex">
                View all events <ChevronRight size={15} />
              </Link>
            </FadeUp>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event, i) => <EventCard key={event._id} event={event} delay={i * 0.1} />)}
            </div>
          ) : (
            <FadeUp>
              <div className="text-center py-16 bg-cream-50 rounded-2xl border border-border">
                <Calendar size={36} className="text-indigo-300 mx-auto mb-3" />
                <p className="text-text-secondary font-medium">Events coming soon</p>
                <p className="text-sm text-text-muted mt-1">Stay tuned for exciting upcoming events.</p>
              </div>
            </FadeUp>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/events" className="btn-secondary">View all events</Link>
          </div>
        </div>
      </section>

      {/* ─── About / Mission Section ───────────────────────────────────────── */}
      <section className="section bg-cream-50/50 border-y border-border">
        <div className="container-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <p className="section-label">Who we are</p>
              <h2 className="section-title">Built on curiosity. Driven by excellence.</h2>
              <p className="text-text-secondary leading-relaxed mt-4 mb-6">
                Nachiketa was founded by a group of passionate students who believed that learning shouldn't stop at the classroom door. Today, we're a thriving community of engineers, designers, thinkers, and creators.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                We run events, workshops, hackathons, and seminars that challenge conventional thinking and push boundaries. Our goal: build the next generation of leaders who are technically brilliant and humanly grounded.
              </p>
              <div className="flex items-center gap-3">
                <Link to="/about" className="btn-primary">Our story <ArrowRight size={14} /></Link>
                <Link to="/team" className="btn-secondary">Meet the team</Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '2,000+', label: 'Members',      desc: 'Active community members across batches' },
                  { value: '150+',   label: 'Events',       desc: 'Events conducted since inception' },
                  { value: '50+',    label: 'Awards',       desc: 'National and state-level recognitions' },
                  { value: '8+',     label: 'Years',        desc: 'Of impact and continuous growth' },
                ].map(({ value, label, desc }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="card p-5 hover:shadow-soft-md transition-all"
                  >
                    <p className="text-3xl font-bold gradient-text mb-1">{value}</p>
                    <p className="font-semibold text-text-primary text-sm">{label}</p>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── Latest Blogs ─────────────────────────────────────────────────── */}
      {blogs.length > 0 && (
        <section className="section">
          <div className="container-lg">
            <div className="flex items-end justify-between mb-10">
              <FadeUp>
                <p className="section-label">From our community</p>
                <h2 className="section-title">Latest Articles</h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <Link to="/blogs" className="btn-ghost text-indigo-600 hidden md:flex">
                  All articles <ChevronRight size={15} />
                </Link>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {blogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} delay={i * 0.08} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── Sponsors ─────────────────────────────────────────────────────── */}
      {sponsors.length > 0 && (
        <section className="py-14 border-t border-border">
          <div className="container-lg">
            <FadeUp className="text-center mb-10">
              <p className="text-xs text-text-muted uppercase tracking-widest mb-2">Backed by</p>
              <p className="text-sm text-text-secondary">Trusted by leading organizations who believe in our mission</p>
            </FadeUp>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {sponsors.map((s, i) => (
                <FadeUp key={s._id} delay={i * 0.05}>
                  <a href={s.website || '#'} target="_blank" rel="noopener noreferrer"
                    className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                    <img src={s.logo} alt={s.name} className="h-8 object-contain" loading="lazy" />
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-lavender-50 to-cream-100 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-orb w-64 h-64 -top-16 right-1/4 bg-indigo-200 opacity-20" />
          <div className="floating-orb w-48 h-48 bottom-0 left-1/3 bg-lavender-200 opacity-20" />
        </div>
        <div className="container-sm relative z-10 text-center">
          <FadeUp>
            <p className="section-label">Join us today</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-5 text-balance">
              Ready to be part of something{' '}
              <span className="gradient-text">extraordinary?</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-10">
              Join thousands of students who are already learning, building, and growing with Nachiketa. Your journey starts with a single step.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="btn-primary px-8 py-3.5 text-base shadow-glow-indigo">
                Get started for free <ArrowRight size={16} />
              </Link>
              <Link to="/events" className="btn-secondary px-8 py-3.5 text-base">
                Explore events
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>
    </>
  );
}
