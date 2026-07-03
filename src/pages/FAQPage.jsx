import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const FadeUp = ({ children, delay=0, className='' }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.55,delay}} className={className}>{children}</motion.div>
);

const FAQS = [
  { q: 'What is Nachiketa Society?', a: 'Nachiketa is a premier college society dedicated to fostering innovation, technical excellence, and community among students. We organize events, workshops, hackathons, and seminars throughout the year.' },
  { q: 'How do I join Nachiketa?', a: 'Simply create a free account on our website! You can then register for events. For full membership benefits (discounts, priority access), you can purchase a membership plan from our Membership page.' },
  { q: 'Are all events free?', a: 'Many events are completely free. Some premium events like hackathons may have a small registration fee. Members always get discounted pricing on paid events.' },
  { q: 'How does the membership work?', a: 'We offer three membership tiers — Basic (6 months), Premium (1 year), and Lifetime. Members get event discounts, priority registration, certificates, and exclusive access to member-only events.' },
  { q: 'Will I get a certificate for attending workshops?', a: 'Yes! For workshops and events where certificates are offered, you will receive a digital certificate automatically upon completion. Check the event details page to see if a certificate is included.' },
  { q: 'How do I get my QR ticket after registration?', a: 'After successful registration (free or paid), your QR ticket is sent to your registered email and also available in your dashboard. Present the QR code at the venue for entry.' },
  { q: 'Can I get a refund if I cancel my registration?', a: 'Refunds are considered on a case-by-case basis. For paid events, contact us at least 48 hours before the event. For membership, contact us within 7 days of purchase.' },
  { q: 'How can I become part of the core team?', a: 'We open applications for team positions at the beginning of each academic year. Watch our social media and the website for announcements about team recruitment.' },
  { q: 'Is there a mobile app?', a: 'Our website is fully responsive and works great on mobile devices. A dedicated mobile app is in our roadmap for future development.' },
  { q: 'How can my company sponsor Nachiketa?', a: 'We would love to partner with you! Please reach out via our Contact page or email us at sponsors@nachiketa.in. We offer various sponsorship tiers with great visibility.' },
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
  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-cream-50/50">
        <div className="container-lg section py-12">
          <FadeUp className="max-w-2xl">
            <p className="section-label">Help center</p>
            <h1 className="section-title">Frequently Asked Questions</h1>
            <p className="section-subtitle">Find answers to the most common questions about Nachiketa Society.</p>
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
            <p className="text-text-secondary text-sm mb-5">Our team is happy to help. Reach out and we will get back to you within 24 hours.</p>
            <Link to="/contact" className="btn-primary px-8 py-2.5">Contact us</Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
