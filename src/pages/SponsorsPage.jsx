import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ExternalLink, Building2 } from 'lucide-react';
import { sponsorsAPI } from '@/lib/api';
import { Link } from 'react-router-dom';

const FadeUp = ({ children, delay=0, className='' }) => (
  <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.55,delay}} className={className}>{children}</motion.div>
);
const TIER_LABELS = { platinum:'Platinum', gold:'Gold', silver:'Silver', bronze:'Bronze', partner:'Partners' };
const TIER_ORDER = ['platinum','gold','silver','bronze','partner'];
const TIER_STYLES = {
  platinum:'border-indigo-200 bg-indigo-50/50', gold:'border-amber-200 bg-amber-50/50',
  silver:'border-gray-200 bg-gray-50/30', bronze:'border-orange-200 bg-orange-50/30', partner:'',
};
const TIER_BADGE = { platinum:'badge-indigo', gold:'badge-amber', silver:'badge-gray', bronze:'badge-gray', partner:'badge-gray' };

export default function SponsorsPage() {
  const { data, isLoading } = useQuery({ queryKey: ['sponsors'], queryFn: () => sponsorsAPI.getAll() });
  const sponsors = data?.data?.sponsors || [];
  const grouped = TIER_ORDER.reduce((acc,tier)=>{ const t=sponsors.filter(s=>s.tier===tier); if(t.length) acc[tier]=t; return acc; },{});

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-cream-50/50">
        <div className="container-lg section py-12">
          <FadeUp className="max-w-2xl">
            <p className="section-label">Our partners</p>
            <h1 className="section-title">Sponsors & Partners</h1>
            <p className="section-subtitle">We are grateful to the organizations that believe in our mission and support us in creating impact.</p>
          </FadeUp>
        </div>
      </div>
      <div className="container-lg section">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{[...Array(6)].map((_,i)=><div key={i} className="card animate-pulse h-24"/>)}</div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border"><Building2 size={36} className="text-indigo-200 mx-auto mb-3"/><p className="text-text-muted">Sponsors coming soon.</p></div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([tier,tierSponsors])=>(
              <div key={tier}>
                <FadeUp><div className="flex items-center gap-3 mb-6"><span className={"badge border " + (TIER_BADGE[tier]||"badge-gray") + " text-sm px-3 py-1"}>{TIER_LABELS[tier]}</span><div className="flex-1 h-px bg-border"/></div></FadeUp>
                <div className={"grid gap-5 " + (tier==='platinum'?'grid-cols-1 md:grid-cols-2':tier==='gold'?'grid-cols-2 md:grid-cols-3':'grid-cols-2 md:grid-cols-4')}>
                  {tierSponsors.map((s,i)=>(
                    <FadeUp key={s._id} delay={i*0.08}>
                      <a href={s.website||'#'} target="_blank" rel="noopener noreferrer"
                        className={"card hover:shadow-soft-md transition-all duration-300 group flex flex-col items-center justify-center p-6 text-center min-h-[100px] " + (TIER_STYLES[tier]||'')}>
                        <img src={s.logo} alt={s.name} className="max-h-12 object-contain mb-3 filter grayscale group-hover:grayscale-0 transition-all duration-300"/>
                        <p className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{s.name}</p>
                        {s.website && <ExternalLink size={11} className="text-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity"/>}
                      </a>
                    </FadeUp>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <FadeUp delay={0.3} className="mt-16">
          <div className="card bg-gradient-to-br from-indigo-50 to-lavender-50 border-indigo-100 text-center p-10">
            <h3 className="text-2xl font-bold text-text-primary mb-3">Interested in sponsoring Nachiketa?</h3>
            <p className="text-text-secondary mb-6 max-w-lg mx-auto">Join our growing list of sponsors and gain visibility among 2,000+ talented students. Let us build something great together.</p>
            <Link to="/contact" className="btn-primary px-8 py-3 shadow-glow-indigo">Get in touch</Link>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
