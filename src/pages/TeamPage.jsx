import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Mail } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import { teamAPI } from '@/lib/api';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const DEPT_LABELS = {
  core:       'Core Leadership',
  technical:  'Technical & Web',
  creative:   'Creative & Content',
  marketing:  'Outreach & Media',
  management: 'Program Management',
  advisor:    'Faculty Advisors',
};

const DEPT_ORDER = ['core', 'technical', 'creative', 'marketing', 'management', 'advisor'];

const DEPT_COLORS = {
  core:       'bg-indigo-50 text-indigo-700 border-indigo-100',
  technical:  'bg-lavender-50 text-lavender-700 border-lavender-100',
  creative:   'bg-rose-50 text-rose-700 border-rose-100',
  marketing:  'bg-amber-50 text-amber-700 border-amber-100',
  management: 'bg-sage-50 text-sage-700 border-sage-100',
  advisor:    'bg-cream-100 text-text-secondary border-cream-300',
};

const AVATAR_GRADIENTS = [
  'from-indigo-400 to-lavender-400',
  'from-rose-400 to-amber-400',
  'from-sage-400 to-indigo-400',
  'from-lavender-400 to-rose-400',
  'from-amber-400 to-sage-400',
  'from-indigo-500 to-rose-400',
];

function MemberCard({ member, delay }) {
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const grad = AVATAR_GRADIENTS[member.name.charCodeAt(0) % AVATAR_GRADIENTS.length];

  const hasLinkedin  = member.socialLinks?.linkedin;
  const hasInstagram = member.socialLinks?.instagram;
  const hasEmail     = member.email;
  const hasSocials   = hasLinkedin || hasInstagram || hasEmail;

  return (
    <FadeUp delay={delay}>
      <div className="card hover:shadow-soft-md transition-all duration-300 group text-center p-6 flex flex-col h-full">

        {/* ── Avatar ──────────────────────────────────────────────────── */}
        <div className="relative mx-auto mb-4 w-20 h-20 flex-shrink-0">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={`${member.name} - ${member.designation} at Nachiketa Awareness Society`}
              className="w-20 h-20 rounded-2xl object-cover shadow-soft"
            />
          ) : (
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-soft`}>
              <span className="text-white font-bold text-xl">{initials}</span>
            </div>
          )}
          {/* Star badge for core team */}
          {member.department === 'core' && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-soft-sm">
              <span className="text-white text-2xs font-bold">★</span>
            </div>
          )}
        </div>

        {/* ── Name & designation ──────────────────────────────────────── */}
        <h3 className="font-bold text-text-primary text-base mb-0.5 leading-snug">
          {member.name}
        </h3>
        <p className="text-sm text-indigo-600 font-semibold mb-2">
          {member.designation}
        </p>

        {/* ── Year & branch ───────────────────────────────────────────── */}
        {(member.year || member.branch) && (
          <p className="text-xs text-text-muted mb-3">
            {[member.year, member.branch].filter(Boolean).join(' · ')}
          </p>
        )}

        {/* ── Bio ─────────────────────────────────────────────────────── */}
        {member.bio && (
          <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-3 flex-1">
            {member.bio}
          </p>
        )}

        {/* ── Social links ────────────────────────────────────────────── */}
        {hasSocials && (
          <div className="flex items-center justify-center gap-2.5 mt-auto pt-4 border-t border-border">

            {/* LinkedIn */}
            {hasLinkedin ? (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title={`${member.name} on LinkedIn`}
                className="w-8 h-8 rounded-xl bg-cream-50 hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 flex items-center justify-center text-text-muted hover:text-[#0077B5] transition-all duration-200 border border-border shadow-soft-xs"
              >
                <Linkedin size={15} />
              </a>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-cream-50 border border-dashed border-cream-300 flex items-center justify-center">
                <Linkedin size={13} className="text-cream-400" />
              </div>
            )}

            {/* Instagram */}
            {hasInstagram ? (
              <a
                href={member.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title={`${member.name} on Instagram`}
                className="w-8 h-8 rounded-xl bg-cream-50 hover:bg-gradient-to-br hover:from-[#f09433]/10 hover:to-[#bc1888]/10 hover:border-[#bc1888]/30 flex items-center justify-center text-text-muted hover:text-[#c13584] transition-all duration-200 border border-border shadow-soft-xs"
              >
                <Instagram size={15} />
              </a>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-cream-50 border border-dashed border-cream-300 flex items-center justify-center">
                <Instagram size={13} className="text-cream-400" />
              </div>
            )}

            {/* Email */}
            {hasEmail && (
              <a
                href={`mailto:${member.email}`}
                title={`Email ${member.name}`}
                className="w-8 h-8 rounded-xl bg-cream-50 hover:bg-indigo-50 hover:border-indigo-200 flex items-center justify-center text-text-muted hover:text-indigo-600 transition-all duration-200 border border-border shadow-soft-xs"
              >
                <Mail size={14} />
              </a>
            )}
          </div>
        )}

        {!hasSocials && (
          <div className="mt-auto pt-4 border-t border-border">
            <p className="text-2xs text-text-muted italic">Member Lead</p>
          </div>
        )}
      </div>
    </FadeUp>
  );
}

function SkeletonCard() {
  return (
    <div className="card text-center p-6 animate-pulse">
      <div className="skeleton w-20 h-20 rounded-2xl mx-auto mb-4" />
      <div className="skeleton h-4 w-3/4 mx-auto rounded mb-2" />
      <div className="skeleton h-3 w-1/2 mx-auto rounded mb-1" />
      <div className="skeleton h-3 w-1/3 mx-auto rounded mb-4" />
      <div className="skeleton h-8 w-full rounded" />
    </div>
  );
}

export default function TeamPage() {
  const [activeDept, setActiveDept] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => teamAPI.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const members = data?.data?.members || [];

  const presentDepts = DEPT_ORDER.filter(d => members.some(m => m.department === d));
  const departments  = ['all', ...presentDepts];

  const grouped = DEPT_ORDER.reduce((acc, dept) => {
    const filtered = members.filter(
      m => m.department === dept && (activeDept === 'all' || activeDept === dept)
    );
    if (filtered.length > 0) acc[dept] = filtered;
    return acc;
  }, {});

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title="Nachiketa Team | Student Community Leaders"
        description="Meet the student leaders, organizers, and members behind Nachiketa Awareness Society driving student growth and community engagement."
        slug="/team"
      />

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-cream-50 to-lavender-50">
        <div className="container-lg section py-16">
          <FadeUp className="max-w-2xl">
            <p className="section-label">OUR TEAM</p>
            <h1 className="section-title">Meet our Team</h1>
            <p className="section-subtitle">
              The passionate minds behind Nachiketa — students dedicated to building an aware, informed, healthy, and empowered community.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="container-lg section">

        {/* ── Department filter pills ────────────────────────────────── */}
        {departments.length > 2 && (
          <div className="flex gap-2 flex-wrap mb-10">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeDept === dept
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-soft-sm'
                    : 'bg-surface border-border text-text-secondary hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {dept === 'all' ? 'All Members' : DEPT_LABELS[dept] || dept}
              </button>
            ))}
          </div>
        )}

        {/* ── Members grid ──────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border">
            <p className="text-text-muted">No team members found.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {Object.entries(grouped).map(([dept, deptMembers]) => (
              <div key={dept}>

                {/* Department heading */}
                <FadeUp>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`badge border text-sm px-3 py-1 ${DEPT_COLORS[dept] || ''}`}>
                      {DEPT_LABELS[dept] || dept}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-text-muted">
                      {deptMembers.length} {deptMembers.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                </FadeUp>

                {/* Cards */}
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {deptMembers.map((member, i) => (
                    <MemberCard key={member._id} member={member} delay={i * 0.06} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Footer note ───────────────────────────────────────────── */}
        {members.length > 0 && (
          <FadeUp delay={0.2} className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-cream-50 rounded-full border border-border">
              <Linkedin size={14} className="text-[#0077B5]" />
              <Instagram size={14} className="text-[#c13584]" />
              <span className="text-sm text-text-secondary ml-1">
                Connect with our team members on LinkedIn & Instagram
              </span>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}