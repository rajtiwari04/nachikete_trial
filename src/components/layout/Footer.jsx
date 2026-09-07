import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Instagram, Linkedin, Twitter, Mail, MapPin, Phone, ArrowUpRight, Heart } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const FOOTER_LINKS = {
  Society: [
    { label: 'About Us',      href: '/about' },
    { label: 'Our Team',      href: '/team' },
    { label: 'Milestones',    href: '/achievements' },
    { label: 'Gallery',       href: '/gallery' },
    { label: 'Sponsors',      href: '/sponsors' },
  ],
  Explore: [
    { label: 'Programs',      href: '/events' },
    { label: 'Blog',          href: '/blogs' },
    { label: 'Membership',    href: '/membership' },
    { label: 'FAQ',           href: '/faq' },
    { label: 'Contact',       href: '/contact' },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin,  href: 'https://linkedin.com',  label: 'LinkedIn' },
  { icon: Twitter,   href: 'https://twitter.com',   label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      {/* ─── CTA Banner ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-50 via-lavender-50 to-cream-100 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-text-primary tracking-tight">Be part of a more aware community.</h3>
            <p className="text-text-secondary mt-1">Join Nachiketa Awareness Society and participate in sessions that inspire positive change.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/membership" className="btn-primary px-6 py-2.5">Join Nachiketa</Link>
            <Link to="/about" className="btn-secondary px-6 py-2.5">Learn More</Link>
          </div>
        </div>
      </div>

      {/* ─── Main Footer ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo to="/" size="md" className="mb-4" imgClassName="shadow-soft-sm" />
            <p className="text-sm text-text-secondary leading-relaxed mb-5 max-w-xs">
              Nachiketa Awareness Society is a student-led community focused on awareness, self-discovery, wellbeing, cultural activities and meaningful social participation.
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-lg bg-cream-100 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-text-muted transition-all duration-200 hover:shadow-soft-xs">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-text-secondary hover:text-indigo-600 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-text-muted mb-4">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: Mail,    text: 'hello@nachiketa.in',       href: 'mailto:hello@nachiketa.in' },
                { icon: Phone,   text: '+91 98765 43210',          href: 'tel:+919876543210' },
                { icon: MapPin,  text: 'Nachiketa Awareness Society', href: null },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  {href ? (
                    <a href={href} className="flex items-start gap-2.5 text-sm text-text-secondary hover:text-indigo-600 transition-colors group">
                      <Icon size={14} className="mt-0.5 flex-shrink-0 text-text-muted group-hover:text-indigo-500 transition-colors" />
                      {text}
                    </a>
                  ) : (
                    <span className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <Icon size={14} className="mt-0.5 flex-shrink-0 text-text-muted" />
                      {text}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-xs font-medium text-indigo-700">Stay Aware & Informed</p>
              <p className="text-xs text-indigo-600 mt-0.5">Follow our community updates and upcoming awareness sessions.</p>
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ──────────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted flex items-center gap-1">
            © {new Date().getFullYear()} Nachiketa Awareness Society.
          </p>
          <div className="flex items-center gap-5">

          </div>
        </div>
      </div>
    </footer>
  );
}
