import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ScrollText, Landmark, Scale, Users2, Vote, Sprout, BookOpen, HelpCircle, MessagesSquare, Handshake, Megaphone } from 'lucide-react';
import SEO from '@/components/ui/SEO';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
    {children}
  </motion.div>
);

const FOCUS_AREAS = [
  { icon: ScrollText, title: 'Public Policy',     desc: 'Understanding policies that shape everyday life.' },
  { icon: Landmark,    title: 'Governance',        desc: 'Making governance understandable and accessible.' },
  { icon: Scale,       title: 'Law & Rights',      desc: 'Creating awareness about legal rights and responsibilities.' },
  { icon: Users2,      title: 'Social Issues',     desc: 'Discussing issues that affect communities and individuals.' },
  { icon: Vote,        title: 'Civic Awareness',   desc: 'Encouraging informed and responsible citizenship.' },
  { icon: Sprout,      title: 'Youth Development', desc: 'Building socially aware, confident and responsible young people.' },
];

const VALUES = [
  { icon: ScrollText, title: 'Public Policy',     desc: 'Understanding policies that shape everyday life.' },
  { icon: Landmark,    title: 'Governance',        desc: 'Making governance understandable and accessible.' },
  { icon: Scale,       title: 'Law & Rights',      desc: 'Creating awareness about legal rights and responsibilities.' },
  { icon: Users2,      title: 'Social Issues',     desc: 'Discussing issues that affect communities and individuals.' },
  { icon: Vote,        title: 'Civic Awareness',   desc: 'Encouraging informed and responsible citizenship.' },
  { icon: Sprout,      title: 'Youth Development', desc: 'Building socially aware, confident and responsible young people.' },
];

const APPROACH = [
  { icon: BookOpen,        title: 'Learn',    desc: 'Understand the issue.' },
  { icon: HelpCircle,      title: 'Question', desc: 'Challenge assumptions.' },
  { icon: MessagesSquare,  title: 'Discuss',  desc: 'Exchange perspectives.' },
  { icon: Handshake,       title: 'Connect',  desc: 'Engage with people and institutions.' },
  { icon: Megaphone,       title: 'Act',      desc: 'Turn awareness into participation.' },
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <SEO
        title="About Nachiketa Awareness Society | Know. Question. Engage. Transform."
        description="Nachiketa Awareness Society is a youth-led initiative creating awareness about public policy, governance, law, social issues, civic awareness and youth development."
        slug="/about"
      />

      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-cream-50 to-lavender-50">
        <div className="container-lg section py-16 text-center">
          <FadeUp><p className="section-label">OUR PURPOSE & STORY</p></FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-5 text-balance">
              <span className="gradient-text">NACHIKETA</span> Awareness Society
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-lg md:text-xl font-semibold text-indigo-600 mb-4">
              Know. Question. Engage. Transform.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="section-subtitle mx-auto text-base md:text-lg max-w-2xl">
              A youth-led initiative creating awareness about public policy, governance, law and social issues, while building the understanding and confidence needed to create meaningful change.
            </p>
          </FadeUp>
        </div>
      </div>

      {/* Our Focus Areas */}
      <section className="section">
        <div className="container-lg">
          <FadeUp className="text-center mb-12">
            <p className="section-label">WHAT WE FOCUS ON</p>
            <h2 className="section-title">Our Focus Areas</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FOCUS_AREAS.map(({ icon: Icon, title, desc }, i) => (
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

      {/* What We Stand For */}
      <section className="section bg-surface border-y border-border">
        <div className="container-lg">
          <FadeUp className="text-center mb-12">
            <p className="section-label">WHAT GUIDES US</p>
            <h2 className="section-title">What We Stand For</h2>
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

      {/* Our Approach */}
      <section className="py-16 bg-cream-50/70 border-t border-border">
        <div className="container-lg">
          <FadeUp className="text-center mb-12">
            <span className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Megaphone size={20} />
            </span>
            <p className="section-label">HOW WE WORK</p>
            <h2 className="section-title">Our Approach</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {APPROACH.map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.08}>
                <div className="card hover:shadow-soft-md transition-all duration-300 h-full text-center">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 mx-auto">
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
            <h2 className="section-title mb-4">Be part of the conversation.</h2>
            <p className="section-subtitle mx-auto mb-8">
              Learn, question, discuss, connect and turn awareness into meaningful participation.
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