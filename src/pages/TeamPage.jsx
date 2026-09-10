import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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

function MemberCard({ member, delay }) {
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

  return (
    <FadeUp delay={delay}>
      <div className="card hover:shadow-soft-md transition-all duration-300 group text-center p-6 flex flex-col h-full">

        {/* ── Photo / Avatar ──────────────────────────────────────────── */}
        <div className="relative mx-auto mb-4 w-20 h-20 flex-shrink-0">
          {photo ? (
            <img
              src={photo}
              alt={`${name} - ${position} at Nachiketa`}
              className="w-20 h-20 rounded-2xl object-cover shadow-soft"
            />
          ) : (
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-soft`}>
              <span className="text-white font-bold text-xl">{initials}</span>
            </div>
          )}
          {member.section === 'leadership' && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-soft-sm">
              <span className="text-white text-2xs font-bold">★</span>
            </div>
          )}
        </div>

        {/* ── Name & Position ─────────────────────────────────────────── */}
        <h3 className="font-bold text-text-primary text-base mb-0.5 leading-snug">
          {name}
        </h3>
        <p className="text-sm text-indigo-600 font-semibold mb-2">
          {position}
        </p>

        {/* ── Short Bio ────────────────────────────────────────────────── */}
        {member.bio && (
          <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-3 flex-1">
            {member.bio}
          </p>
        )}

        {/* ── LinkedIn Link ────────────────────────────────────────────── */}
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-center">
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title={`${name} on LinkedIn`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-50 hover:bg-[#0077B5]/10 hover:border-[#0077B5]/30 text-text-muted hover:text-[#0077B5] transition-all duration-200 border border-border shadow-soft-xs text-xs font-medium"
            >
              <Linkedin size={14} className="text-[#0077B5]" />
              <span>LinkedIn</span>
            </a>
          ) : (
            <span className="text-2xs text-text-muted italic">Nachiketa Member</span>
          )}
        </div>
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
  const { data, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => teamAPI.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const members = data?.data?.members || [];

  // Group members into hierarchical structure: section -> division -> members
  const groupedHierarchy = SECTION_ORDER.reduce((acc, secKey) => {
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

  return (
    <div className="bg-background min-h-screen">
      <SEO
        title="The People Behind Nachiketa | Student Community Leaders"
        description="Meet the leadership and core team members behind Nachiketa Awareness Society driving student growth and community engagement."
        slug="/team"
      />

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-cream-50 to-lavender-50">
        <div className="container-lg section py-16">
          <FadeUp className="max-w-2xl">
            <p className="section-label">OUR TEAM</p>
            <h1 className="section-title">The People Behind Nachiketa</h1>
            <p className="section-subtitle">
              The dedicated leaders, researchers, writers, and creators driving awareness, community engagement, and student growth.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="container-lg section">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border">
            <p className="text-text-muted">No team members found.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {SECTION_ORDER.map(secKey => {
              const divisionMap = groupedHierarchy[secKey];
              if (!divisionMap) return null;
              const secConfig = SECTION_CONFIG[secKey];
              const secDivisions = DIVISION_ORDER[secKey];

              return (
                <div key={secKey} className="space-y-10">

                  {/* ── Top-Level Section Header ──────────────────────────── */}
                  <FadeUp>
                    <div className="border-b border-border/80 pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                          {secConfig.title}
                        </h2>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${secConfig.badgeStyle}`}>
                          {secConfig.title}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {secConfig.description}
                      </p>
                    </div>
                  </FadeUp>

                  {/* ── Division Subsections ──────────────────────────────── */}
                  <div className="space-y-10 pl-0 sm:pl-3">
                    {secDivisions.map(divKey => {
                      const divMembers = divisionMap[divKey];
                      if (!divMembers || divMembers.length === 0) return null;
                      const divConfig = DIVISION_CONFIG[divKey];

                      return (
                        <div key={divKey} className="space-y-4">
                          {/* Division Heading */}
                          <FadeUp>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                                {divConfig.title}
                              </h3>
                              <div className="flex-1 h-px bg-border/60" />
                              <span className="text-xs text-text-muted font-medium">
                                {divMembers.length} {divMembers.length === 1 ? 'member' : 'members'}
                              </span>
                            </div>
                          </FadeUp>

                          {/* Member Cards Grid */}
                          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {divMembers.map((member, i) => (
                              <MemberCard key={member._id || i} member={member} delay={i * 0.05} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Footer Note ─────────────────────────────────────────────── */}
        {members.length > 0 && (
          <FadeUp delay={0.2} className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-cream-50 rounded-full border border-border">
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