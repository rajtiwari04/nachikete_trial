import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/ui/SEO';

const FadeUp = ({ children, delay=0, className='' }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.55,delay}} className={className}>{children}</motion.div>
);

const FAQS = [
  {
    q: 'What is Nachiketa Awareness Society?',
    a: 'Nachiketa Awareness Society is a student-led community dedicated to creating awareness, encouraging self-discovery, promoting health and wellbeing, understanding civic rights & responsibilities, and organizing cultural activities that build a responsible, informed student community.',
  },
  {
    q: 'How do I join Nachiketa?',
    a: 'You can create a free student account on our website to stay updated on upcoming programs. To become an active member and unlock member benefits, register through our Membership page.',
  },
  {
    q: 'What kinds of sessions and programs does Nachiketa conduct?',
    a: 'We organize awareness drives, self-discovery workshops, health and nutrition bootcamps, rights and responsibilities discussions, government scheme guidance, confidence & communication sessions, and cultural community events.',
  },
  {
    q: 'Are Nachiketa awareness sessions free to attend?',
    a: 'Most of our awareness sessions and community discussions are completely free for students. Some multi-day bootcamps or specialized programs may have nominal charges, with discounts for society members.',
  },
  {
    q: 'How does society membership work?',
    a: 'We offer membership options (Basic, Premium, Lifetime). Members get priority access to sessions, special program discounts, participation certificates, and active involvement in community initiatives.',
  },
  {
    q: 'Do I get a participation certificate for sessions?',
    a: 'Yes, for structured workshops, bootcamps, and awareness drives where certificates are provided, digital certificates are issued upon completion.',
  },
  {
    q: 'How can I join the student lead team or organize a session?',
    a: 'We encourage active student participation! You can express your interest through our contact page or during our team recruitment drives held each academic session.',
  },
  {
    q: 'Can our student group or college partner with Nachiketa for an awareness drive?',
    a: 'Absolutely! We welcome collaborations for educational, wellbeing, and social awareness programs. Reach out to us via our Contact page.',
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeUp delay={index * 0.04}>
      <div className={"border rounded-xl overflow-hidden transition-all duration-200 " + (open ? 'border-indigo-200 shadow-soft-sm' : 'border-border')}>
        <button className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-cream-50 transition-colors" onClick={()=>setOpen(o=>!o)}>
          <span className={"font-semibold text-sm leading-snug " + (open ? 'text-indigo-600' : 'text-text-primary')}>{faq.q}</span>
          <ChevronDown size={16} className={"text-text-muted flex-shrink-0 transition-transform duration-200 " + (open ? 'rotate-180 text-indigo-500' : '')}/>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}}>
              <div className="px-5 pb-5"><p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeUp>
  );
}

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title="Nachiketa FAQ | Questions About Our Student Community"
        description="Frequently asked questions about Nachiketa Awareness Society, our awareness sessions, membership, activities, and community goals."
        slug="/faq"
        schema={faqSchema}
      />

      <div className="border-b border-border bg-cream-50/50">
        <div className="container-lg section py-12">
          <FadeUp className="max-w-2xl">
            <p className="section-label">HELP CENTER</p>
            <h1 className="section-title">Frequently Asked Questions</h1>
            <p className="section-subtitle">Find answers to the most common questions about Nachiketa Awareness Society.</p>
          </FadeUp>
        </div>
      </div>
      <div className="container-md section">
        <div className="space-y-3 mb-12">
          {FAQS.map((faq,i)=><FAQItem key={i} faq={faq} index={i}/>)}
        </div>
        <FadeUp>
          <div className="card bg-gradient-to-br from-indigo-50 to-lavender-50 border-indigo-100 text-center p-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><MessageSquare size={20} className="text-indigo-500"/></div>
            <h3 className="font-bold text-text-primary mb-2">Still have questions?</h3>
            <p className="text-text-secondary text-sm mb-5">Our team is happy to help. Reach out and we will get back to you soon.</p>
            <Link to="/contact" className="btn-primary px-8 py-2.5">Contact us</Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
