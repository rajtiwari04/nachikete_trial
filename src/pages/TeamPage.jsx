import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Github, Linkedin, Instagram, Twitter, Mail } from 'lucide-react';
import { teamAPI } from '@/lib/api';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}>{children}</motion.div>
);

const DEPT_LABELS = {
  core: 'Core Team', technical: 'Technical', creative: 'Creative',
  marketing: 'Marketing', management: 'Management', advisor: 'Faculty Advisors',
};
const DEPT_ORDER = ['core','technical','creative','marketing','management','advisor'];
const DEPT_COLORS = {
  core: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  technical: 'bg-lavender-50 text-lavender-700 border-lavender-100',
  creative: 'bg-rose-50 text-rose-700 border-rose-100',
  marketing: 'bg-amber-50 text-amber-700 border-amber-100',
  management: 'bg-sage-50 text-sage-700 border-sage-100',
  advisor: 'bg-cream-100 text-text-secondary border-cream-300',
};
const AVATAR_GRADIENTS = ['from-indigo-400 to-lavender-400','from-rose-400 to-amber-400','from-sage-400 to-indigo-400','from-lavender-400 to-rose-400'];

function MemberCard({ member, delay }) {
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const grad = AVATAR_GRADIENTS[member.name.charCodeAt(0) % AVATAR_GRADIENTS.length];
  return (
    <FadeUp delay={delay}>
      <div className="card hover:shadow-soft-md transition-all duration-300 group text-center p-6">
        <div className="relative mx-auto mb-4 w-20 h-20">
          {member.avatar
            ? <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-2xl object-cover shadow-soft" />
            : <div className={"w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-soft " + grad}><span className="text-white font-bold text-xl">{initials}</span></div>
          }
          {member.department === 'core' && <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"><span className="text-white text-2xs font-bold">★</span></div>}
        </div>
        <h3 className="font-bold text-text-primary text-base mb-0.5">{member.name}</h3>
        <p className="text-sm text-indigo-600 font-medium mb-2">{member.designation}</p>
        {(member.year || member.branch) && <p className="text-xs text-text-muted mb-3">{[member.year,member.branch].filter(Boolean).join(' · ')}</p>}
        {member.bio && <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-3">{member.bio}</p>}
        {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
          <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border">
            {member.socialLinks.linkedin && <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-cream-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-text-muted transition-all border border-border"><Linkedin size={13}/></a>}
            {member.socialLinks.github && <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-cream-50 hover:bg-cream-100 flex items-center justify-center text-text-muted transition-all border border-border"><Github size={13}/></a>}
            {member.socialLinks.instagram && <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-cream-50 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center text-text-muted transition-all border border-border"><Instagram size={13}/></a>}
            {member.email && <a href={"mailto:"+member.email} className="w-7 h-7 rounded-lg bg-cream-50 hover:bg-sage-50 hover:text-sage-600 flex items-center justify-center text-text-muted transition-all border border-border"><Mail size={13}/></a>}
          </div>
        )}
      </div>
    </FadeUp>
  );
}

export default function TeamPage() {
  const [activeDept, setActiveDept] = useState('all');
  const { data, isLoading } = useQuery({ queryKey: ['team'], queryFn: () => teamAPI.getAll() });
  const members = data?.data?.members || [];
  const departments = ['all', ...DEPT_ORDER.filter(d => members.some(m => m.department === d))];
  const grouped = DEPT_ORDER.reduce((acc, dept) => {
    const filtered = members.filter(m => m.department === dept && (activeDept === 'all' || activeDept === dept));
    if (filtered.length > 0) acc[dept] = filtered;
    return acc;
  }, {});

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-cream-50 to-lavender-50">
        <div className="container-lg section py-16">
          <FadeUp className="max-w-2xl">
            <p className="section-label">The people</p>
            <h1 className="section-title">Meet our Team</h1>
            <p className="section-subtitle">The passionate minds behind Nachiketa — students who give their time, energy, and ideas to build something extraordinary.</p>
          </FadeUp>
        </div>
      </div>
      <div className="container-lg section">
        {departments.length > 2 && (
          <div className="flex gap-2 flex-wrap mb-10">
            {departments.map(dept => (
              <button key={dept} onClick={() => setActiveDept(dept)} className={"px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 " + (activeDept===dept ? 'bg-indigo-500 text-white border-indigo-500 shadow-soft-sm' : 'bg-surface border-border text-text-secondary hover:border-indigo-200 hover:text-indigo-600')}>
                {dept === 'all' ? 'All Members' : DEPT_LABELS[dept] || dept}
              </button>
            ))}
          </div>
        )}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => <div key={i} className="card text-center p-6 animate-pulse"><div className="skeleton w-20 h-20 rounded-2xl mx-auto mb-4"/><div className="skeleton h-4 w-3/4 mx-auto rounded mb-2"/><div className="skeleton h-3 w-1/2 mx-auto rounded"/></div>)}
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border"><p className="text-text-muted">No team members found.</p></div>
        ) : (
          <div className="space-y-14">
            {Object.entries(grouped).map(([dept, deptMembers]) => (
              <div key={dept}>
                <FadeUp><div className="flex items-center gap-3 mb-6"><span className={"badge border text-sm px-3 py-1 " + (DEPT_COLORS[dept]||'')}>{DEPT_LABELS[dept]||dept}</span><div className="flex-1 h-px bg-border"/><span className="text-xs text-text-muted">{deptMembers.length} members</span></div></FadeUp>
                <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {deptMembers.map((member,i) => <MemberCard key={member._id} member={member} delay={i*0.06}/>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
