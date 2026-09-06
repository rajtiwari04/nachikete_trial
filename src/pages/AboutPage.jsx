import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Compass, BookOpen, ShieldCheck, Smile } from 'lucide-react';
import SEO from '@/components/ui/SEO';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
    {children}
  </motion.div>
);

const VALUES = [
  { icon: BookOpen,    title: 'Awareness',       desc: 'We believe informed people are better equipped to make meaningful decisions.' },
  { icon: ShieldCheck, title: 'Responsibility',  desc: 'Awareness becomes meaningful when it leads to responsible action.' },
  { icon: Compass,     title: 'Self-Discovery',  desc: 'We encourage students to understand themselves, their strengths and their aspirations.' },
  { icon: Heart,       title: 'Wellbeing',       desc: 'Healthy communities begin with people who understand and care for their wellbeing.' },
  { icon: Smile,       title: 'Empathy',         desc: 'Understanding others helps us build stronger and more supportive communities.' },
  { icon: Users,       title: 'Participation',   desc: 'Positive change grows when people choose to participate.' },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <SEO
        title="About Nachiketa Awareness Society | Our Purpose & Community"
        description="Nachiketa Awareness Society was created to bridge the awareness gap among students through self-discovery, rights awareness, health initiatives, and community engagement."
        slug="/about"
      />

      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-cream-50 to-lavender-50">
        <div className="container-lg section py-16 text-center">
          <FadeUp><p className="section-label">OUR PURPOSE & STORY</p></FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-5 text-balance">
              About <span className="gradient-text">Nachiketa Awareness Society</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="section-subtitle mx-auto text-base md:text-lg max-w-2xl">
              A student-led community focused on creating awareness, encouraging self-discovery, promoting wellbeing, and inspiring positive participation.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Mission & Purpose */}
      <section className="section">
        <div className="container-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp className="space-y-4">
              <p className="section-label">BRIDGING THE GAP</p>
              <h2 className="section-title mb-4">Awareness that shapes everyday decisions.</h2>
              <p className="text-text-secondary leading-relaxed">
                Nachiketa Awareness Society was established in 2024 with a simple belief: students should not have to discover important knowledge only after facing a problem.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Many fundamental things in life—such as our rights and responsibilities, government welfare schemes, personal health and nutrition, mental wellbeing, and practical life skills—are often learned too late. Nachiketa creates an open space where students can ask questions, learn together, build confidence, and carry awareness into their classrooms, families, and society.
              </p>
              <div className="pt-2">
                <Link to="/events" className="btn-primary gap-2">Explore our programs <ArrowRight size={14} /></Link>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2} className="grid grid-cols-2 gap-4">
              {[
                ['2024', 'Established'],
                ['200+', 'Student Members'],
                ['5+', 'Awareness Sessions'],
                ['100%', 'Student-Led'],
              ].map(([v, l]) => (
                <div key={l} className="card text-center py-6">
                  <p className="text-3xl font-bold gradient-text mb-1">{v}</p>
                  <p className="text-sm font-medium text-text-muted">{l}</p>
                </div>
              ))}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Cultural & Community Ethos */}
      <section className="py-16 bg-cream-50/70 border-t border-border">
        <div className="container-md">
          <FadeUp className="text-center max-w-2xl mx-auto">
            <span className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Heart size={20} />
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">Cultural & Community Connection</h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              Learning is not limited to classrooms. Cultural activities, shared experiences, discussions, and creative expression help students connect with one another and build a stronger, more supportive student community.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-surface border-y border-border">
        <div className="container-lg">
          <FadeUp className="text-center mb-12">
            <p className="section-label">WHAT GUIDES US</p>
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
            <h2 className="section-title mb-4">Be part of a more aware community</h2>
            <p className="section-subtitle mx-auto mb-8">
              Whether you want to learn something useful, share knowledge with peers, or participate in cultural activities, there is a space for you in Nachiketa.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/membership" className="btn-primary px-8 py-3 shadow-soft hover:shadow-soft-md">Join Nachiketa <ArrowRight size={14} /></Link>
              <Link to="/team" className="btn-secondary px-8 py-3">Meet the team</Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
