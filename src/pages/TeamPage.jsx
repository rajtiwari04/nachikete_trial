import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin } from 'lucide-react';
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

// ────────────────────────────────────────────────────────────────────────
// DATA / HIERARCHY CONFIG — UNCHANGED (semantic meaning + values preserved)
// ────────────────────────────────────────────────────────────────────────

const SECTION_ORDER = ['leadership', 'core-team'];

const SECTION_CONFIG = {
  'leadership': {
    title: 'Leadership',
    description: 'Guiding the vision, strategic direction, and executive management of Nachiketa.',
    badgeStyle: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  'core-team': {
    title: 'Core Team',
    description: 'The dedicated leads and specialists driving research, policy, outreach, media, and creative initiatives.',
    badgeStyle: 'bg-sage-100 text-sage-800 border-sage-200',
  },
};

const DIVISION_ORDER = {
  'leadership': ['president', 'management'],
  'core-team': [
    'research-policy',
    'outreach',
    'media-communications',
    'research',
    'writing',
    'social-media',
    'photography',
  ],
};

const DIVISION_CONFIG = {
  'president': { title: 'President' },
  'management': { title: 'Management' },
  'research-policy': { title: 'Research & Policy' },
  'outreach': { title: 'Outreach' },
  'media-communications': { title: 'Media & Communications' },
  'research': { title: 'Research' },
  'writing': { title: 'Writing' },
  'social-media': { title: 'Social Media' },
  'photography': { title: 'Photography' },
};

const AVATAR_GRADIENTS = [
  'from-indigo-400 to-lavender-400',
  'from-rose-400 to-amber-400',
  'from-sage-400 to-indigo-400',
  'from-lavender-400 to-rose-400',
  'from-amber-400 to-sage-400',
  'from-indigo-500 to-rose-400',
];

// ────────────────────────────────────────────────────────────────────────
// MEMBER CARD — same fields, tighter/more refined presentation
// ────────────────────────────────────────────────────────────────────────

function MemberCard({ member, delay = 0, featured = false }) {
  const name = member.name || 'Team Member';
  const position = member.position || member.designation || 'Member';
  const photo = member.photo || member.avatar;
  const linkedin = member.linkedin || member.socialLinks?.linkedin;

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const grad = AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
  const avatarSize = featured ? 'w-24 h-24' : 'w-16 h-16';

  return (
    <FadeUp delay={delay}>
      <div
        className={`card group flex h-full flex-col p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md ${
          featured ? 'sm:flex-row sm:text-left sm:items-center sm:gap-5 sm:p-6' : ''
        }`}
      >
        {/* ── Photo / Avatar ────────────────────────────────────── */}
        <div className={`relative mx-auto mb-3 flex-shrink-0 ${avatarSize} ${featured ? 'sm:mx-0 sm:mb-0' : ''}`}>
          {photo ? (
            <img
              src={photo}
              alt={`${name} - ${position} at Nachiketa`}
              className={`${avatarSize} rounded-2xl object-cover shadow-soft`}
            />
          ) : (
            <div className={`${avatarSize} rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-soft`}>
              <span className={`text-white font-bold ${featured ? 'text-2xl' : 'text-lg'}`}>{initials}</span>
            </div>
          )}
          {member.section === 'leadership' && (
            <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-indigo-500 rounded-full flex items-center justify-center shadow-soft-sm">
              <span className="text-white text-[9px] font-bold">★</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col">
          {/* ── Name & Position ──────────────────────────────────── */}
          <h3 className={`font-bold text-text-primary leading-snug ${featured ? 'text-lg' : 'text-sm'}`}>
            {name}
          </h3>
          <p className={`text-indigo-600 font-semibold mb-1.5 ${featured ? 'text-sm' : 'text-xs'}`}>
            {position}
          </p>

          {/* ── Short Bio ────────────────────────────────────────── */}
          {member.bio && (
            <p className={`text-text-secondary leading-relaxed flex-1 ${featured ? 'text-xs line-clamp-2 mb-3' : 'text-2xs line-clamp-2 mb-3'}`}>
              {member.bio}
            </p>
          )}

          {/* ── LinkedIn Link ────────────────────────────────────── */}
          <div className={`mt-auto flex items-center ${featured ? 'sm:justify-start justify-center' : 'justify-center'}`}>
            {linkedin ? (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title={`${name} on LinkedIn`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-cream-50 px-2.5 py-1 text-2xs font-medium text-text-muted shadow-soft-xs transition-all duration-200 hover:border-[#0077B5]/30 hover:bg-[#0077B5]/10 hover:text-[#0077B5]"
              >
                <Linkedin size={12} className="text-[#0077B5]" />
                <span>LinkedIn</span>
              </a>
            ) : (
              <span className="text-2xs italic text-text-muted">Nachiketa Member</span>
            )}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5 text-center">
      <div className="skeleton mx-auto mb-3 h-16 w-16 rounded-2xl" />
      <div className="skeleton mx-auto mb-2 h-3.5 w-3/4 rounded" />
      <div className="skeleton mx-auto mb-1 h-3 w-1/2 rounded" />
      <div className="skeleton mx-auto mb-3 h-3 w-1/3 rounded" />
      <div className="skeleton h-6 w-full rounded" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => teamAPI.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const members = data?.data?.members || [];

  // Group members into hierarchical structure: section -> division -> members
  // (unchanged grouping/sorting logic)
  const groupedHierarchy = useMemo(() => {
    return SECTION_ORDER.reduce((acc, secKey) => {
      const secDivisions = DIVISION_ORDER[secKey] || [];
      const divisionMap = {};
      let totalSecMembers = 0;

      secDivisions.forEach(divKey => {
        const divMembers = members.filter(m => {
          const memberSec = m.section || (m.department === 'core' || m.department === 'management' ? 'leadership' : 'core-team');
          const memberDiv = m.division || 'management';
          return memberSec === secKey && memberDiv === divKey;
        });

        if (divMembers.length > 0) {
          divMembers.sort((a, b) => (a.order || 0) - (b.order || 0));
          divisionMap[divKey] = divMembers;
          totalSecMembers += divMembers.length;
        }
      });

      if (totalSecMembers > 0) {
        acc[secKey] = divisionMap;
      }
      return acc;
    }, {});
  }, [members]);

  const leadershipDivisions = groupedHierarchy['leadership'];
  const coreDivisions = groupedHierarchy['core-team'];

  // Non-empty core-team division keys, in configured order (data-driven, not hardcoded)
  const availableCoreDivisionKeys = useMemo(() => {
    if (!coreDivisions) return [];
    return DIVISION_ORDER['core-team'].filter(key => coreDivisions[key]?.length > 0);
  }, [coreDivisions]);

  const [activeDivision, setActiveDivision] = useState(null);

  // Keep active division valid once data loads
  const resolvedActiveDivision =
    activeDivision && availableCoreDivisionKeys.includes(activeDivision)
      ? activeDivision
      : availableCoreDivisionKeys[0] || null;

  const activeMembers = resolvedActiveDivision ? coreDivisions[resolvedActiveDivision] || [] : [];

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title="The People Behind Nachiketa | Student Community Leaders"
        description="Meet the leadership and core team members behind Nachiketa Awareness Society driving student growth and community engagement."
        slug="/team"
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-cream-50 to-lavender-50">
        <div className="container-lg section py-10 sm:py-12">
          <FadeUp className="max-w-2xl">
            <p className="section-label">OUR TEAM</p>
            <h1 className="section-title">The People Behind Nachiketa</h1>
            <p className="section-subtitle">
              The dedicated leaders, researchers, writers, and creators driving awareness, community engagement, and student growth.
            </p>
          </FadeUp>

          {/* ── Quick Navigation ────────────────────────────────────────── */}
          {!isLoading && members.length > 0 && (
            <FadeUp delay={0.1} className="mt-6 flex flex-wrap gap-2">
              {leadershipDivisions && (
                <button
                  type="button"
                  onClick={() => scrollToId('leadership-section')}
                  className="rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold text-indigo-800 shadow-soft-xs transition-colors hover:bg-indigo-50"
                >
                  Leadership
                </button>
              )}
              {coreDivisions && (
                <button
                  type="button"
                  onClick={() => scrollToId('core-team-section')}
                  className="rounded-full border border-sage-200 bg-white px-4 py-1.5 text-xs font-semibold text-sage-800 shadow-soft-xs transition-colors hover:bg-sage-50"
                >
                  Core Team
                </button>
              )}
            </FadeUp>
          )}
        </div>
      </div>

      <div className="container-lg section">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-border bg-cream-50 py-20 text-center">
            <p className="text-text-muted">No team members found.</p>
          </div>
        ) : (
          <div className="space-y-14">

            {/* ══ LEADERSHIP SHOWCASE ══════════════════════════════════ */}
            {leadershipDivisions && (
              <section id="leadership-section" className="scroll-mt-24 space-y-5">
                <FadeUp>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">
                      {SECTION_CONFIG['leadership'].title}
                    </h2>
                    <span className={`rounded-full border px-2.5 py-0.5 text-2xs font-semibold ${SECTION_CONFIG['leadership'].badgeStyle}`}>
                      {SECTION_CONFIG['leadership'].title}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{SECTION_CONFIG['leadership'].description}</p>
                </FadeUp>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {DIVISION_ORDER['leadership'].map(divKey => {
                    const divMembers = leadershipDivisions[divKey];
                    if (!divMembers || divMembers.length === 0) return null;
                    // Each leadership member gets a featured (wider) card;
                    // if a division has multiple members they stack in the same column.
                    return (
                      <div key={divKey} className="space-y-3">
                        {divMembers.map((member, i) => (
                          <MemberCard key={member._id || i} member={member} delay={i * 0.05} featured />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ══ CORE TEAM DIRECTORY ══════════════════════════════════ */}
            {coreDivisions && (
              <section id="core-team-section" className="scroll-mt-24 space-y-5">
                <FadeUp>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">
                      {SECTION_CONFIG['core-team'].title}
                    </h2>
                    <span className={`rounded-full border px-2.5 py-0.5 text-2xs font-semibold ${SECTION_CONFIG['core-team'].badgeStyle}`}>
                      {SECTION_CONFIG['core-team'].title}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{SECTION_CONFIG['core-team'].description}</p>
                </FadeUp>

                {/* Division filter chips — horizontally scrollable on mobile */}
                <FadeUp delay={0.05}>
                  <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
                    {availableCoreDivisionKeys.map(divKey => {
                      const isActive = divKey === resolvedActiveDivision;
                      const count = coreDivisions[divKey].length;
                      return (
                        <button
                          key={divKey}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setActiveDivision(divKey)}
                          className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                            isActive
                              ? 'border-indigo-500 bg-indigo-500 text-white shadow-soft-sm'
                              : 'border-border bg-white text-text-secondary hover:border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          {DIVISION_CONFIG[divKey].title}
                          <span className={`ml-1.5 ${isActive ? 'text-indigo-100' : 'text-text-muted'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </FadeUp>

                {/* Active division content */}
                <AnimatePresence mode="wait">
                  {resolvedActiveDivision && (
                    <motion.div
                      key={resolvedActiveDivision}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="flex items-center gap-2 text-base font-bold text-indigo-950">
                          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
                          {DIVISION_CONFIG[resolvedActiveDivision].title}
                        </h3>
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-xs font-medium text-text-muted">
                          {activeMembers.length} {activeMembers.length === 1 ? 'member' : 'members'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {activeMembers.map((member, i) => (
                          <MemberCard key={member._id || i} member={member} delay={i * 0.04} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            )}
          </div>
        )}

        {/* ── Footer Note ───────────────────────────────────────────────── */}
        {members.length > 0 && (
          <FadeUp delay={0.15} className="mt-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-cream-50 px-5 py-3">
              <Linkedin size={15} className="text-[#0077B5]" />
              <span className="text-sm text-text-secondary">
                Connect with our team members on LinkedIn
              </span>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  );
}