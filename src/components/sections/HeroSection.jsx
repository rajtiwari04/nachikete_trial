import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, Heart, Compass, ShieldCheck } from 'lucide-react';
import { getHomepageCommunityImage } from '@/lib/imageUtils';

export default function HeroSection({ galleryImages = [] }) {
  // Data-driven image selection (Gallery priority -> Unsplash fallback)
  const heroImage = getHomepageCommunityImage(galleryImages, 0);

  return (
    <section className="relative flex flex-col justify-center bg-background pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-20 overflow-hidden">
      {/* Soft warm ambient radial gradient lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-50/80 via-indigo-50/40 to-transparent" />
      
      {/* Delicate background mesh pattern */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-indigo-100/40 to-lavender-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Editorial Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Editorial Primary H1 Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-[-0.025em] text-indigo-950 leading-[1.08] max-w-[580px] mb-6 text-balance">
              Awareness That Inspires Change.
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mb-8 text-pretty font-normal">
              Nachiketa Awareness Society is a student-led community dedicated to creating awareness, encouraging self-discovery, promoting wellbeing, and helping students understand the rights, responsibilities, opportunities and ideas that shape everyday life.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <Link
                to="/events"
                className="btn-primary px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2.5 rounded-full shadow-soft hover:shadow-soft-md transition-all duration-200 group"
              >
                <span>Explore Our Programs</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="btn-secondary px-8 py-3.5 text-sm font-medium flex items-center justify-center text-text-secondary hover:text-text-primary rounded-full transition-all duration-200"
              >
                About Nachiketa
              </Link>
            </div>

            {/* Credibility Notes */}
            <div className="pt-6 border-t border-border/80 flex flex-wrap items-center gap-6 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                <span className="font-semibold text-text-primary">Active Student Community</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-indigo-600" />
                <span className="font-medium text-text-secondary">Student-Led & Operated</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass size={14} className="text-indigo-600" />
                <span className="font-medium text-text-secondary">Non-Profit Initiative</span>
              </div>
            </div>
          </motion.div>

          {/* Right Editorial Visual Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo Frame */}
              <div className="relative rounded-3xl overflow-hidden border border-border/90 shadow-soft-xl bg-surface group">
                <img
                  src={heroImage.url}
                  alt={heroImage.alt}
                  className="w-full h-[340px] sm:h-[400px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                
                {/* Image Gradient Overlay (top-anchored, for quote readability) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent flex flex-col justify-start p-6 sm:p-8 pt-6 sm:pt-8 pr-16 sm:pr-8 text-white">
                  <span className="text-2xs uppercase tracking-widest text-white/80 font-semibold mb-1">
                    Student Awareness & Community
                  </span>
                  <p className="text-lg sm:text-xl font-bold leading-snug text-balance max-w-[80%] sm:max-w-[75%]">
                    "Awareness is the first step toward meaningful change."
                  </p>
                </div>
              </div>

              {/* Floating Info Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 -left-4 sm:-left-6 bg-surface p-4 rounded-2xl border border-border shadow-soft-lg max-w-[240px] hidden sm:block"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold text-text-primary">Student Community</span>
                </div>
                <p className="text-2xs text-text-secondary leading-relaxed">
                  Interactive sessions, self-development bootcamps, and cultural activities organized by students.
                </p>
              </motion.div>

              {/* Top Right Floating Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -top-4 -right-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-soft-md hidden sm:flex items-center gap-2 text-xs font-bold text-indigo-700"
              >
                <Heart size={14} className="text-rose-500 fill-rose-500" />
                <span>Established 2024</span>
              </motion.div>

              {/* Decorative Background Accent Layer */}
              <div className="absolute -top-5 -right-5 w-32 h-32 bg-cream-200/70 rounded-3xl -z-10 border border-border/60 hidden sm:block" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}