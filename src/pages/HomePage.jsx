import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Calendar, Clock, MapPin, ChevronRight,
  BookOpen, Users, Heart, Compass, ShieldCheck, Smile, Sparkles, Feather,
  GraduationCap, Eye, Search, Layers, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import HeroSection from '@/components/sections/HeroSection';
import SEO from '@/components/ui/SEO';
import { eventsAPI, blogsAPI, sponsorsAPI, galleryAPI } from '@/lib/api';
import { getValidGalleryImages } from '@/lib/imageUtils';
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

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: eventsData } = useQuery({
    queryKey: ['events', 'home'],
    queryFn: () => eventsAPI.getAll({ status: 'upcoming', limit: 3, sort: 'date' }),
  });

  const { data: blogsData } = useQuery({
    queryKey: ['blogs', 'home'],
    queryFn: () => blogsAPI.getAll({ limit: 3 }),
  });

  const { data: sponsorsData } = useQuery({
    queryKey: ['sponsors'],
    queryFn: () => sponsorsAPI.getAll(),
  });

  const { data: galleryData } = useQuery({
    queryKey: ['gallery', 'home'],
    queryFn: () => galleryAPI.getAll({ limit: 8 }),
  });

  const events = eventsData?.data?.events || [];
  const blogs = blogsData?.data?.blogs || [];
  const sponsors = sponsorsData?.data?.sponsors || [];
  const galleryImages = galleryData?.data?.images || [];

  const featuredEvent = events[0];
  const secondaryEvents = events.slice(1);

  // Centralized Data-Driven Gallery List
  const validGalleryItems = getValidGalleryImages(galleryImages);
  const galleryList = validGalleryItems.length > 0
    ? validGalleryItems.slice(0, 4).map((img, i) => ({
        id: typeof img === 'string' ? i : (img._id || img.id || i),
        title: typeof img === 'string' ? `Community Session ${i + 1}` : (img.title || 'Community Moment'),
        url: typeof img === 'string' ? img : (img.url || img.imageUrl || img.thumbnailUrl),
        alt: typeof img === 'string'
          ? 'Students participating in a Nachiketa Awareness Society program'
          : `Students participating in ${img.title || 'a Nachiketa Awareness Society activity'}`,
        cat: typeof img === 'string' ? 'Community' : (img.category || 'Awareness'),
      }))
    : [
        { id: 1, title: 'Student Awareness Drive', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', alt: 'Students participating in a Nachiketa Awareness Society community session', cat: 'Awareness' },
        { id: 2, title: 'Self-Discovery Workshop', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', alt: 'Students participating in a self-discovery workshop', cat: 'Growth' },
        { id: 3, title: 'Cultural & Community Meet', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', alt: 'Students attending a cultural program by Nachiketa', cat: 'Culture' },
        { id: 4, title: 'Health & Wellbeing Interactive Session', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80', alt: 'Students participating in a wellbeing awareness program', cat: 'Wellbeing' },
      ];

  return (
    <div className="bg-background min-h-screen text-text-primary">
      <SEO
        title="Nachiketa Awareness Society | Student Awareness, Growth & Community"
        description="Nachiketa Awareness Society is a student-led community focused on awareness, self-discovery, wellbeing, cultural activities and meaningful social participation."
      />

      {/* ─── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <HeroSection galleryImages={galleryImages} />

      {/* ─── 2. IMPACT STRIP (STATS AREA) ─────────────────────────────────── */}
      <section className="relative z-20 -mt-4 mb-8 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-border/80 rounded-2xl p-6 sm:p-8 shadow-soft-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border/70 text-center md:text-left">
            
            <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <Users size={22} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight block">200+</span>
                <span className="text-xs font-semibold text-text-secondary">Student Members</span>
                <span className="text-2xs text-text-muted block mt-0.5">Across batches & departments</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <Calendar size={22} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight block">5+</span>
                <span className="text-xs font-semibold text-text-secondary">Community Sessions</span>
                <span className="text-2xs text-text-muted block mt-0.5">Interactive drives & workshops</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <GraduationCap size={22} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight block">8+</span>
                <span className="text-xs font-semibold text-text-secondary">Batches / Departments</span>
                <span className="text-2xs text-text-muted block mt-0.5">Inclusive student participation</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                <Heart size={22} />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight block">2024</span>
                <span className="text-xs font-semibold text-text-secondary">Founded</span>
                <span className="text-2xs text-text-muted block mt-0.5">Student-led society</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. OUR PURPOSE SECTION ────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-cream-50/40 border-b border-border/80">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Story & Narrative */}
            <FadeUp className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-3">
                  OUR PURPOSE
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12]">
                  Creating a more aware, responsible and empowered community.
                </h2>
              </div>
              
              <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
                <p className="font-medium text-indigo-950 text-base sm:text-lg italic border-l-2 border-indigo-500 pl-4 py-1">
                  “Have you ever thought, ‘I wish I had known this earlier’?”
                </p>
                <p>
                  Many important things in life are not difficult to understand—we simply do not know about them at the right time. From our rights and responsibilities to health, wellbeing, welfare schemes, opportunities and personal growth, awareness can change the decisions we make and the lives we influence.
                </p>
                <p>
                  Nachiketa Awareness Society was created to bridge this gap among students. We organize meaningful awareness sessions, self-discovery programs, wellbeing initiatives, cultural activities and community conversations that encourage students to learn, reflect and take positive action.
                </p>
                <p>
                  We believe awareness should not stop with one person. What we learn should travel to our friends, families, classrooms and communities. Our goal is simple: become aware ourselves, help others become aware, and create a community where informed and responsible action becomes a habit.
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap pt-2">
                <Link to="/about" className="btn-primary text-xs px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-soft hover:shadow-soft-md transition-all">
                  Read Our Story <ArrowRight size={14} />
                </Link>
                <Link to="/team" className="btn-secondary text-xs px-6 py-3 rounded-full">
                  Meet the Community
                </Link>
              </div>
            </FadeUp>

            {/* Right Core Pillars Composition */}
            <FadeUp delay={0.2} className="lg:col-span-6">
              <div className="space-y-4">
                
                {/* Highlighted Top Pillar */}
                <div className="p-6 bg-surface border border-indigo-200 rounded-2xl shadow-soft-sm relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3 text-indigo-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="font-semibold text-indigo-950 text-base mb-1.5">Awareness Sessions & Civic Knowledge</h3>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-md">
                    Helping students understand civic rights, duties, public welfare schemes, and social responsibilities that impact daily decisions.
                  </p>
                </div>

                {/* Supporting Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-surface border border-border/80 rounded-2xl shadow-soft-xs hover:border-indigo-200 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 text-indigo-600">
                      <Compass size={18} />
                    </div>
                    <h3 className="font-semibold text-indigo-950 text-sm mb-1">Self-Discovery</h3>
                    <p className="text-2xs text-text-secondary leading-relaxed">
                      Encouraging confidence, personal reflection, communication, and informed career/life choices.
                    </p>
                  </div>

                  <div className="p-5 bg-surface border border-border/80 rounded-2xl shadow-soft-xs hover:border-indigo-200 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mb-3 text-indigo-600">
                      <Heart size={18} />
                    </div>
                    <h3 className="font-semibold text-indigo-950 text-sm mb-1">Health & Wellbeing</h3>
                    <p className="text-2xs text-text-secondary leading-relaxed">
                      Practical health awareness around daily nutrition, mental wellbeing, and personal care.
                    </p>
                  </div>
                </div>

                {/* Cultural Pillar */}
                <div className="p-5 bg-surface border border-border/80 rounded-2xl shadow-soft-xs hover:border-indigo-200 transition-all flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <Feather size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-indigo-950 text-sm mb-0.5">Cultural Expression & Bond</h3>
                    <p className="text-2xs text-text-secondary leading-relaxed">
                      Creative activities and celebrations that bring students together in a supportive network.
                    </p>
                  </div>
                </div>

              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ─── 4. WHY NACHIKETA / 5-STEP PROCESS TIMELINE (NEW) ────────────────── */}
      <section className="py-20 md:py-24 border-b border-border/80 bg-surface">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-3">
              THE NACHIKETA JOURNEY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12] mb-3">
              Awareness begins with curiosity. Change begins with action.
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              How our community helps students navigate knowledge, build confidence, and take positive responsibility.
            </p>
          </FadeUp>

          {/* Process Flow Cards (Horizontal on Desktop, Vertical on Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {[
              {
                num: '01',
                title: 'Discover',
                desc: 'Identify rights, health facts, and opportunities you wish you knew earlier.',
                icon: Search,
              },
              {
                num: '02',
                title: 'Understand',
                desc: 'Gain clarity through interactive student sessions and open discussions.',
                icon: BookOpen,
              },
              {
                num: '03',
                title: 'Reflect',
                desc: 'Explore personal values, confidence, and choices that affect your growth.',
                icon: Compass,
              },
              {
                num: '04',
                title: 'Participate',
                desc: 'Engage in cultural activities, health bootcamps, and community meets.',
                icon: Users,
              },
              {
                num: '05',
                title: 'Act',
                desc: 'Carry awareness beyond yourself to friends, family, and society.',
                icon: ShieldCheck,
              },
            ].map((step, idx) => (
              <FadeUp key={step.num} delay={idx * 0.08}>
                <div className="p-5 bg-cream-50/60 border border-border/80 rounded-2xl h-full flex flex-col justify-between hover:border-indigo-300 hover:bg-surface transition-all duration-300 group shadow-soft-xs relative">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                        {step.num}
                      </span>
                      <step.icon size={18} className="text-text-muted group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-indigo-950 text-base mb-2 group-hover:text-indigo-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}

          </div>
        </div>
      </section>

      {/* ─── 5. PROGRAMS SECTION ("WHAT WE DO") ─────────────────────────────── */}
      <section className="py-20 md:py-24 border-b border-border/80 bg-cream-50/30">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <FadeUp max-w-2xl>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-3">
                WHAT WE DO
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12]">
                Programs that help us learn, grow and connect.
              </h2>
              <p className="text-text-secondary text-sm sm:text-base mt-2">
                A diverse mix of student-led initiatives designed to foster awareness, personal confidence, and strong community.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link to="/events" className="btn-secondary text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5">
                Explore All Programs <ChevronRight size={14} />
              </Link>
            </FadeUp>
          </div>

          {/* Varied 2-Row Asymmetric Layout */}
          <div className="space-y-6">
            
            {/* Top Row: 1 Featured Large Card + 2 Medium Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Featured Large Card */}
              <FadeUp className="lg:col-span-6">
                <div className="p-8 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl h-full flex flex-col justify-between shadow-soft-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                  
                  <div>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-2xs font-semibold uppercase tracking-wider rounded-full border border-white/15 inline-block mb-6">
                      CORE INITIATIVE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 leading-snug">
                      Awareness Sessions & Civic Guidance
                    </h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6 max-w-md">
                      Interactive sessions that help students understand important social, educational, health and civic issues, along with government welfare schemes.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/15 flex items-center justify-between">
                    <span className="text-xs text-indigo-200">Interactive Student Sessions</span>
                    <Link to="/events" className="text-xs font-semibold text-white hover:text-indigo-200 flex items-center gap-1.5">
                      Explore Sessions <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </FadeUp>

              {/* Two Medium Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <FadeUp delay={0.1}>
                  <div className="p-6 bg-surface border border-border/80 rounded-3xl h-full flex flex-col justify-between hover:border-indigo-200 transition-all shadow-soft-xs">
                    <div>
                      <span className="text-2xs font-semibold uppercase tracking-widest text-indigo-600 block mb-3">
                        PERSONAL GROWTH
                      </span>
                      <h3 className="font-semibold text-indigo-950 text-base sm:text-lg mb-2">
                        Self-Discovery & Personality
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">
                        Programs that encourage self-reflection, confidence, communication, decision-making and personal development.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/60 text-2xs text-text-muted">
                      Confidence & Communication
                    </div>
                  </div>
                </FadeUp>

                <FadeUp delay={0.15}>
                  <div className="p-6 bg-surface border border-border/80 rounded-3xl h-full flex flex-col justify-between hover:border-indigo-200 transition-all shadow-soft-xs">
                    <div>
                      <span className="text-2xs font-semibold uppercase tracking-widest text-rose-600 block mb-3">
                        HEALTH & LIFE
                      </span>
                      <h3 className="font-semibold text-indigo-950 text-base sm:text-lg mb-2">
                        Health & Wellbeing Bootcamps
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">
                        Practical initiatives around nutrition, daily healthy habits, mental wellbeing and everyday health awareness.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border/60 text-2xs text-text-muted">
                      Includes 7 Day Nutrition Drive
                    </div>
                  </div>
                </FadeUp>

              </div>
            </div>

            {/* Bottom Row: 3 Supporting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <FadeUp delay={0.2}>
                <div className="p-6 bg-surface border border-border/80 rounded-3xl h-full flex flex-col justify-between hover:border-indigo-200 transition-all shadow-soft-xs">
                  <div>
                    <span className="text-2xs font-semibold uppercase tracking-widest text-indigo-600 block mb-2">
                      RIGHTS & DUTIES
                    </span>
                    <h3 className="font-semibold text-indigo-950 text-base mb-2">
                      Rights, Duties & Social Awareness
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Conversations helping students understand their rights, responsibilities, public resources and social role.
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.25}>
                <div className="p-6 bg-surface border border-border/80 rounded-3xl h-full flex flex-col justify-between hover:border-indigo-200 transition-all shadow-soft-xs">
                  <div>
                    <span className="text-2xs font-semibold uppercase tracking-widest text-indigo-600 block mb-2">
                      CULTURE & BONDING
                    </span>
                    <h3 className="font-semibold text-indigo-950 text-base mb-2">
                      Cultural Activities & Showcase
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Creative and cultural experiences that bring students together, celebrate expression and strengthen community.
                    </p>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="p-6 bg-surface border border-border/80 rounded-3xl h-full flex flex-col justify-between hover:border-indigo-200 transition-all shadow-soft-xs">
                  <div>
                    <span className="text-2xs font-semibold uppercase tracking-widest text-indigo-600 block mb-2">
                      OPPORTUNITIES
                    </span>
                    <h3 className="font-semibold text-indigo-950 text-base mb-2">
                      Educational & Opportunity Awareness
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Helping students discover useful opportunities, information, resources and pathways they may otherwise miss.
                    </p>
                  </div>
                </div>
              </FadeUp>

            </div>

          </div>
        </div>
      </section>

      {/* ─── 6. WHY NACHIKETA (PHILOSOPHY & PRINCIPLES) ──────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 border-b border-border/80 bg-surface relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Conceptual Narrative */}
            <FadeUp className="lg:col-span-6 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-3">
                  WHY NACHIKETA
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12]">
                  Where student ideas turn into positive community action.
                </h2>
              </div>
              
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
                College life is more than just attending lectures. Nachiketa Awareness Society brings together curious students across departments to learn about civic rights, share daily wellbeing habits, explore personal growth, celebrate culture, and build a more informed, empathetic campus community.
              </p>

              <div className="pt-2">
                <a
                  href="#community-moments"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('community-moments')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary text-xs px-6 py-3 rounded-full inline-flex items-center gap-2 group cursor-pointer shadow-soft hover:shadow-soft-md transition-all"
                >
                  <span>See Community Moments</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </FadeUp>

            {/* Right Core Principles Grid (Non-Photo Conceptual Layout) */}
            <FadeUp delay={0.15} className="lg:col-span-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    step: '01',
                    title: 'Awareness',
                    desc: 'Understand rights, health facts, and opportunities early rather than late.',
                    icon: Search,
                  },
                  {
                    step: '02',
                    title: 'Reflection',
                    desc: 'Discover your strengths, question assumptions, and build confidence.',
                    icon: Compass,
                  },
                  {
                    step: '03',
                    title: 'Participation',
                    desc: 'Engage in open discussions, health drives, and cultural celebrations.',
                    icon: Users,
                  },
                  {
                    step: '04',
                    title: 'Positive Action',
                    desc: 'Turn personal awareness into responsible habits that help others.',
                    icon: ShieldCheck,
                  },
                ].map((p, idx) => (
                  <div
                    key={p.step}
                    className={`p-5 rounded-2xl border transition-all duration-300 shadow-soft-xs flex flex-col justify-between h-full ${
                      idx === 3
                        ? 'bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border-indigo-900'
                        : 'bg-cream-50/60 border-border/80 hover:border-indigo-200 hover:bg-surface text-text-primary'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-2xs font-semibold px-2.5 py-0.5 rounded-full ${
                            idx === 3
                              ? 'bg-white/15 text-indigo-100 border border-white/20'
                              : 'bg-indigo-50 border border-indigo-100 text-indigo-700'
                          }`}
                        >
                          {p.step}
                        </span>
                        <p.icon
                          size={18}
                          className={idx === 3 ? 'text-indigo-200' : 'text-indigo-600'}
                        />
                      </div>
                      <h3
                        className={`font-semibold text-base mb-1.5 ${
                          idx === 3 ? 'text-white' : 'text-indigo-950'
                        }`}
                      >
                        {p.title}
                      </h3>
                      <p
                        className={`text-xs leading-relaxed ${
                          idx === 3 ? 'text-indigo-100/90' : 'text-text-secondary'
                        }`}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* ─── 7. UPCOMING PROGRAMS SHOWCASE ────────────────────────────────── */}
      <section className="py-20 md:py-24 border-b border-border/80 bg-cream-50/40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <FadeUp>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-3">
                OUR SCHEDULE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12]">
                Upcoming Awareness & Community Programs
              </h2>
              <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-xl">
                Awareness sessions, self-development programs, wellbeing initiatives, cultural activities and meaningful conversations for students.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link to="/events" className="btn-secondary text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 self-start md:self-auto">
                Explore Full Calendar <ChevronRight size={14} />
              </Link>
            </FadeUp>
          </div>

          {featuredEvent ? (
            <div className="space-y-6">
              {/* Primary Featured Program Card */}
              <FadeUp>
                <div className="bg-surface border border-border/90 rounded-3xl overflow-hidden shadow-soft-sm hover:shadow-soft transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto bg-cream-100 overflow-hidden">
                    {featuredEvent.banner ? (
                      <img
                        src={featuredEvent.banner}
                        alt={featuredEvent.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-cream-100">
                        <Calendar size={48} className="text-text-muted/40" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-surface/90 backdrop-blur-sm text-text-primary text-xs font-semibold rounded-full border border-border capitalize">
                        {featuredEvent.category || 'Awareness Program'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-text-muted mb-3 flex-wrap">
                        <span className="flex items-center gap-1.5 font-semibold text-indigo-600">
                          <Calendar size={13} />
                          {featuredEvent.date ? format(new Date(featuredEvent.date), 'MMMM d, yyyy') : 'Date TBA'}
                        </span>
                        {featuredEvent.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {featuredEvent.time}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-indigo-950 mb-3 leading-snug">
                        {featuredEvent.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
                        {featuredEvent.shortDescription || featuredEvent.description}
                      </p>

                      {featuredEvent.venue?.name && (
                        <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                          <MapPin size={13} className="text-text-secondary flex-shrink-0" />
                          <span className="truncate">{featuredEvent.venue.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                      <span className="text-xs text-text-muted">
                        {featuredEvent.registeredCount || 0} students participating
                      </span>
                      <Link
                        to={`/events/${featuredEvent.slug}`}
                        className="btn-primary text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5"
                      >
                        Program Details <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Secondary Programs Grid */}
              {secondaryEvents.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {secondaryEvents.map((evt, idx) => (
                    <FadeUp key={evt._id} delay={0.1 * (idx + 1)}>
                      <div className="bg-surface border border-border/80 rounded-2xl p-6 hover:border-indigo-200 transition-all flex flex-col justify-between h-full shadow-soft-xs">
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-2xs font-semibold uppercase tracking-wider text-indigo-600">
                              {evt.category}
                            </span>
                            <span className="text-xs text-text-muted">
                              {evt.date ? format(new Date(evt.date), 'MMM d, yyyy') : ''}
                            </span>
                          </div>
                          <h4 className="font-semibold text-indigo-950 text-base mb-2 line-clamp-1">
                            {evt.title}
                          </h4>
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                            {evt.shortDescription || evt.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                          <span className="text-text-muted">{evt.registeredCount || 0} registered</span>
                          <Link to={`/events/${evt.slug}`} className="text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                            View Details <ArrowRight size={11} />
                          </Link>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <FadeUp>
              <div className="p-10 text-center bg-surface rounded-3xl border border-border/80 max-w-lg mx-auto shadow-soft-sm">
                <Calendar size={36} className="text-indigo-400 mx-auto mb-3" />
                <h3 className="font-semibold text-indigo-950 text-lg mb-1">New Programs Coming Soon</h3>
                <p className="text-xs sm:text-sm text-text-secondary mb-6 leading-relaxed">
                  We are preparing our next set of awareness sessions, self-discovery activities and community programs. Check back soon for dates and registration details.
                </p>
                <Link to="/events" className="btn-secondary text-xs px-5 py-2.5 rounded-full">
                  Explore Past Programs
                </Link>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ─── 8. STORY & VALUES SECTION ─────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-surface border-b border-border/80">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            <FadeUp className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-3">
                OUR VALUES
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12]">
                Awareness begins with curiosity, and change begins with action.
              </h2>
            </FadeUp>
            <FadeUp delay={0.1} className="lg:col-span-7">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4">
                Nachiketa was founded in 2024 with a simple belief: students should not have to discover important knowledge only after facing a problem. The society creates a space where students can ask questions, discover themselves, understand important issues, explore opportunities, improve their wellbeing and connect with others.
              </p>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                From awareness sessions and self-development activities to health programs, cultural initiatives and community conversations, Nachiketa encourages students to learn something useful and carry that awareness beyond themselves.
              </p>
            </FadeUp>
          </div>

          {/* Minimal Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Awareness',
                desc: 'We believe informed people are better equipped to make meaningful decisions.',
                icon: BookOpen,
              },
              {
                title: 'Responsibility',
                desc: 'Awareness becomes meaningful when it leads to responsible action.',
                icon: ShieldCheck,
              },
              {
                title: 'Self-Discovery',
                desc: 'We encourage students to understand themselves, their strengths and their aspirations.',
                icon: Compass,
              },
              {
                title: 'Wellbeing',
                desc: 'Healthy communities begin with people who understand and care for their wellbeing.',
                icon: Heart,
              },
              {
                title: 'Empathy',
                desc: 'Understanding others helps us build stronger and more supportive communities.',
                icon: Smile,
              },
              {
                title: 'Participation',
                desc: 'Positive change grows when people choose to participate.',
                icon: Users,
              },
            ].map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.06}>
                <div className="p-6 bg-cream-50/50 border border-border/70 rounded-2xl hover:bg-surface hover:border-indigo-200 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                      <v.icon size={16} />
                    </div>
                    <h3 className="font-semibold text-indigo-950 text-base mb-1.5">{v.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 9. COMMUNITY MOMENTS GALLERY ("LIFE AT NACHIKETA") ────────────── */}
      <section id="community-moments" className="py-16 sm:py-20 md:py-24 border-b border-border/80 bg-cream-50/30 scroll-mt-20">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <FadeUp max-w-2xl>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-2.5">
                COMMUNITY MOMENTS
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12]">
                Life at Nachiketa
              </h2>
              <p className="text-text-secondary text-sm sm:text-base mt-2 leading-relaxed">
                Snapshots from awareness sessions, cultural activities, workshops, conversations, celebrations and moments shared by our community.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link to="/gallery" className="btn-secondary text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 shrink-0">
                View Full Gallery <ChevronRight size={14} />
              </Link>
            </FadeUp>
          </div>

          {/* Balanced Editorial Gallery Grid */}
          {galleryList.length >= 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
              
              {/* Left / Primary Featured Image (Item 0) ~58% width on Desktop */}
              <FadeUp className="sm:col-span-2 lg:col-span-7 h-full">
                <div className="group relative rounded-2xl overflow-hidden border border-border/80 bg-surface h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[460px] shadow-soft-xs">
                  <img
                    src={galleryList[0].url}
                    alt={galleryList[0].alt}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {/* Subtle Ambient Bottom Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
                  
                  {/* Permanent Subtle Featured Badge Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-sm max-w-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="font-bold tracking-wider uppercase text-2xs text-indigo-200 shrink-0">COMMUNITY MOMENTS</span>
                      <span className="text-white/30 hidden sm:inline">•</span>
                      <span className="truncate text-white/90 hidden sm:inline">{galleryList[0].title}</span>
                    </div>
                    <span className="text-2xs text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 self-start sm:self-auto hidden md:inline-block">
                      {galleryList[0].cat}
                    </span>
                  </div>
                </div>
              </FadeUp>

              {/* Right Composition ~42% width on Desktop */}
              <div className="sm:col-span-2 lg:col-span-5 flex flex-col gap-4 sm:gap-5 h-full">
                
                {/* Top Secondary Image (Item 1) */}
                <FadeUp delay={0.08} className="flex-1 min-h-[180px] sm:min-h-[200px] lg:min-h-[215px]">
                  <div className="group relative rounded-2xl overflow-hidden border border-border/80 bg-surface h-full shadow-soft-xs">
                    <img
                      src={galleryList[1].url}
                      alt={galleryList[1].alt}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                      <span className="text-2xs font-semibold uppercase tracking-widest text-indigo-200 mb-0.5">
                        {galleryList[1].cat}
                      </span>
                      <p className="text-xs font-semibold truncate">{galleryList[1].title}</p>
                    </div>
                  </div>
                </FadeUp>

                {/* Bottom Row: 2 Secondary Images Side-by-Side (Items 2 & 3) */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5 h-[160px] sm:h-[180px] lg:h-[225px]">
                  
                  {/* Image 2 */}
                  <FadeUp delay={0.16} className="h-full">
                    <div className="group relative rounded-2xl overflow-hidden border border-border/80 bg-surface h-full shadow-soft-xs">
                      <img
                        src={galleryList[2].url}
                        alt={galleryList[2].alt}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 text-white">
                        <span className="text-2xs font-semibold uppercase tracking-widest text-indigo-200 mb-0.5">
                          {galleryList[2].cat}
                        </span>
                        <p className="text-xs font-semibold truncate">{galleryList[2].title}</p>
                      </div>
                    </div>
                  </FadeUp>

                  {/* Image 3 */}
                  <FadeUp delay={0.24} className="h-full">
                    <div className="group relative rounded-2xl overflow-hidden border border-border/80 bg-surface h-full shadow-soft-xs">
                      <img
                        src={galleryList[3].url}
                        alt={galleryList[3].alt}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 text-white">
                        <span className="text-2xs font-semibold uppercase tracking-widest text-indigo-200 mb-0.5">
                          {galleryList[3].cat}
                        </span>
                        <p className="text-xs font-semibold truncate">{galleryList[3].title}</p>
                      </div>
                    </div>
                  </FadeUp>

                </div>

              </div>

            </div>
          )}

        </div>
      </section>

      {/* ─── 10. ARTICLES & INSIGHTS ("AWARENESS & INSIGHTS") ──────────────── */}
      {blogs.length > 0 && (
        <section className="py-20 md:py-24 border-b border-border/80 bg-surface">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <FadeUp max-w-2xl>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xs font-semibold uppercase tracking-wider mb-3">
                  AWARENESS & INSIGHTS
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12]">
                  Articles & Perspectives
                </h2>
                <p className="text-text-secondary text-sm sm:text-base mt-2">
                  Reflections, awareness guides, wellbeing tips, and stories from the Nachiketa community.
                </p>
              </FadeUp>
              <FadeUp delay={0.1}>
                <Link to="/blogs" className="btn-secondary text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1.5">
                  All Articles <ChevronRight size={14} />
                </Link>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((b, i) => (
                <FadeUp key={b._id} delay={i * 0.08} className={i === 0 ? 'md:col-span-3 lg:col-span-2' : ''}>
                  <Link to={`/blogs/${b.slug}`} className="group block bg-cream-50/50 border border-border/80 rounded-3xl p-6 hover:bg-surface hover:border-indigo-200 transition-all h-full flex flex-col justify-between shadow-soft-xs">
                    <div>
                      <div className="flex items-center gap-3 text-2xs text-text-muted mb-3">
                        <span className="badge-indigo uppercase tracking-wider">{b.category || 'Article'}</span>
                        {b.readTime && <span>{b.readTime} min read</span>}
                      </div>
                      <h3 className="font-semibold text-indigo-950 text-base sm:text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 mb-4">
                        {b.excerpt}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border/60 text-xs text-indigo-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read article <ArrowRight size={12} />
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ─── 11. PARTNERS & SUPPORTERS ────────────────────────────────────── */}
      {sponsors.length > 0 && (
        <section className="py-14 border-b border-border/80 bg-cream-50/30">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
            <FadeUp className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">COMMUNITY PARTNERS & SUPPORTERS</p>
            </FadeUp>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {sponsors.map((s, i) => (
                <FadeUp key={s._id} delay={i * 0.05}>
                  <a
                    href={s.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 block"
                  >
                    <img src={s.logo} alt={s.name} className="h-7 sm:h-8 object-contain" loading="lazy" />
                  </a>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 12. SINGLE REFINED FINAL CTA ──────────────────────────────────── */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-cream-50/40 via-indigo-50/25 to-cream-50/60 border-b border-border/80 text-center relative overflow-hidden">
        {/* Subtle Ambient Glow Detail */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp>
            {/* Subtle Centered Icon */}
            <div className="w-11 h-11 rounded-2xl bg-surface border border-indigo-100/90 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-soft-xs">
              <Heart size={20} />
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold text-indigo-950 tracking-[-0.02em] leading-[1.12] mb-3 text-balance max-w-xl mx-auto">
              Be part of a more aware community.
            </h2>

            {/* Supporting Paragraph with Controlled Width */}
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-7 max-w-xl mx-auto font-normal text-pretty">
              Some of the most valuable things we learn are the things we wish we had known earlier. Join Nachiketa, discover something meaningful, share what you learn, and help build a more aware, responsible, and empowered community.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
              <Link to="/membership" className="btn-primary text-xs sm:text-sm px-7 py-3 rounded-full shadow-soft hover:shadow-soft-md transition-all w-full sm:w-auto text-center">
                Join Nachiketa
              </Link>
              <Link to="/events" className="btn-secondary text-xs sm:text-sm px-7 py-3 rounded-full w-full sm:w-auto text-center">
                Explore Programs
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  );
}
