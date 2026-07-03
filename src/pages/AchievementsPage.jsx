import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Calendar, Users } from 'lucide-react';
import { achievementsAPI } from '@/lib/api';
import { format } from 'date-fns';

const FadeUp = ({ children, delay=0, className='' }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-60px"}}
    transition={{duration:0.55,delay}} className={className}>{children}</motion.div>
);
const CAT_COLORS = { award:'badge-amber', competition:'badge-indigo', recognition:'badge-lavender', milestone:'badge-green', other:'badge-gray' };
const CAT_ICONS = { award: Trophy, competition: Award, recognition: Star, milestone: Star, other: Award };

export default function AchievementsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['achievements'], queryFn: () => achievementsAPI.getAll() });
  const achievements = data?.data?.achievements || [];
  const featured = achievements.filter(a => a.isFeatured);
  const rest = achievements.filter(a => !a.isFeatured);

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-gradient-to-br from-amber-50 via-cream-50 to-indigo-50">
        <div className="container-lg section py-16">
          <FadeUp className="max-w-2xl">
            <p className="section-label">Recognition</p>
            <h1 className="section-title">Our Achievements</h1>
            <p className="section-subtitle">A showcase of the awards, victories, and milestones that define the Nachiketa legacy.</p>
          </FadeUp>
        </div>
      </div>
      <div className="container-lg section">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{[...Array(4)].map((_,i)=><div key={i} className="card animate-pulse"><div className="skeleton h-5 w-3/4 rounded mb-3"/><div className="skeleton h-3 w-full rounded"/></div>)}</div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border"><Trophy size={36} className="text-amber-200 mx-auto mb-3"/><p className="text-text-muted">Achievements coming soon!</p></div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-12">
                <FadeUp><h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2"><Trophy size={20} className="text-amber-500"/> Featured Achievements</h2></FadeUp>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featured.map((a,i)=>{
                    const Icon = CAT_ICONS[a.category]||Award;
                    return (
                      <FadeUp key={a._id} delay={i*0.08}>
                        <div className="card hover:shadow-soft-md transition-all duration-300 border-amber-100 bg-gradient-to-br from-amber-50/50 to-white h-full flex flex-col">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0"><Icon size={18} className="text-amber-600"/></div>
                            <span className={CAT_COLORS[a.category]||"badge-gray capitalize"}>{a.category}</span>
                          </div>
                          <h3 className="font-bold text-text-primary mb-2 leading-snug">{a.title}</h3>
                          <p className="text-sm text-text-secondary leading-relaxed flex-1">{a.description}</p>
                          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                            {a.position && <span className="badge-amber">{a.position}</span>}
                            <span className="text-xs text-text-muted flex items-center gap-1 ml-auto"><Calendar size={11}/>{format(new Date(a.date),"MMM yyyy")}</span>
                          </div>
                          {a.organizer && <p className="text-xs text-text-muted mt-2">{a.organizer}</p>}
                        </div>
                      </FadeUp>
                    );
                  })}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div>
                <FadeUp><h2 className="text-xl font-bold text-text-primary mb-6">All Achievements</h2></FadeUp>
                <div className="space-y-3">
                  {rest.map((a,i)=>{
                    const Icon = CAT_ICONS[a.category]||Award;
                    return (
                      <FadeUp key={a._id} delay={i*0.05}>
                        <div className="card hover:shadow-soft transition-all flex items-start gap-4 p-4">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0"><Icon size={16} className="text-indigo-500"/></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-text-primary text-sm leading-snug">{a.title}</h3>
                              <span className="text-xs text-text-muted flex-shrink-0">{format(new Date(a.date),"MMM yyyy")}</span>
                            </div>
                            <p className="text-xs text-text-secondary">{a.description}</p>
                          </div>
                          {a.position && <span className="badge-indigo flex-shrink-0 text-xs">{a.position}</span>}
                        </div>
                      </FadeUp>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
