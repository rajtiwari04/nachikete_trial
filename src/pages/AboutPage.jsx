import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Zap, Users, Star, BookOpen, Award } from 'lucide-react';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
    {children}
  </motion.div>
);

const VALUES = [
  { icon: Zap,     title: 'Innovation',   desc: 'We champion fresh thinking and bold ideas that challenge the status quo.' },
  { icon: Users,   title: 'Community',    desc: 'Our strength lies in our diverse, inclusive, and supportive community.' },
  { icon: Star,    title: 'Excellence',   desc: 'We pursue the highest standards in everything we do, always striving to improve.' },
  { icon: Heart,   title: 'Passion',      desc: 'We are driven by genuine passion for learning, creating, and making an impact.' },
  { icon: BookOpen,'title': 'Learning',   desc: 'Continuous growth through events, workshops, mentorship, and collaboration.' },
  { icon: Award,   title: 'Recognition',  desc: 'Celebrating achievements and inspiring others to reach their full potential.' },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-cream-50 to-lavender-50">
        <div className="container-lg section py-20 text-center">
          <FadeUp><p className="section-label">Our story</p></FadeUp>
          <FadeUp delay={0.1}><h1 className="text-5xl md:text-6xl font-bold text-text-primary tracking-tight mb-5 text-balance">About <span className="gradient-text">Nachiketa</span></h1></FadeUp>
          <FadeUp delay={0.2}><p className="section-subtitle mx-auto text-lg">A society born from curiosity, built on excellence, and driven by a shared dream of making a difference.</p></FadeUp>
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <p className="section-label">Mission</p>
              <h2 className="section-title mb-4">We exist to spark potential.</h2>
              <p className="text-text-secondary leading-relaxed mb-4">Nachiketa was founded on the belief that the best learning happens outside the classroom. We create spaces — both physical and digital — where students can explore, experiment, fail, and ultimately, thrive.</p>
              <p className="text-text-secondary leading-relaxed mb-6">From coding bootcamps to cultural celebrations, from technical workshops to leadership seminars, we curate experiences that shape not just careers, but character.</p>
              <Link to="/events" className="btn-primary gap-2">Explore our events <ArrowRight size={14} /></Link>
            </FadeUp>
            <FadeUp delay={0.2} className="grid grid-cols-2 gap-4">
              {[['2016','Founded'],['2,000+','Members'],['150+','Events'],['50+','Awards']].map(([v,l]) => (
                <div key={l} className="card text-center py-6">
                  <p className="text-3xl font-bold gradient-text mb-1">{v}</p>
                  <p className="text-sm text-text-muted">{l}</p>
                </div>
              ))}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-cream-50/50 border-y border-border">
        <div className="container-lg">
          <FadeUp className="text-center mb-12">
            <p className="section-label">What we stand for</p>
            <h2 className="section-title">Our Core Values</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div className="card hover:shadow-soft-md transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-indigo-500" />
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">{title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section text-center">
        <div className="container-sm">
          <FadeUp>
            <h2 className="section-title mb-4">Join our journey</h2>
            <p className="section-subtitle mx-auto mb-8">Whether you're a first-year student or a senior preparing to graduate, there's a place for you in Nachiketa.</p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/register" className="btn-primary px-8 py-3 shadow-glow-indigo">Join now <ArrowRight size={14} /></Link>
              <Link to="/team" className="btn-secondary px-8 py-3">Meet the team</Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
