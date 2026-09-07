import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown, ArrowRight, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '@/components/ui/SEO';
import { membershipAPI, paymentsAPI } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>{children}</motion.div>
);
const PLAN_ICONS = { basic: Zap, premium: Star, lifetime: Crown };
const PLAN_COLORS = { basic: 'indigo', premium: 'lavender', lifetime: 'rose' };

export default function MembershipPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);

  const { data } = useQuery({ queryKey: ['membership-plans'], queryFn: () => membershipAPI.getPlans() });
  const plans = data?.data?.plans || [];

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) { navigate('/login', { state: { from: '/membership' } }); return; }
    setLoading(plan.id);
    try {
      const { data: orderData } = await paymentsAPI.createOrder({ type: 'membership', plan: plan.id, referenceId: user._id });
      const { order, key } = orderData;
      const rzp = new window.Razorpay({
        key, amount: order.amount, currency: order.currency,
        name: 'Nachiketa Awareness Society', description: `${plan.name} Membership`,
        order_id: order.id,
        prefill: { name: user.name, email: user.email },
        theme: { color: '#6366f1' },
        handler: async (res) => {
          try {
            await paymentsAPI.verify({ ...res, type: 'membership', referenceId: user._id, plan: plan.id });
            toast.success('Membership activated! Welcome to Nachiketa Awareness Society 🎉');
            navigate('/dashboard');
          } catch { toast.error('Payment verification failed. Contact support.'); }
        },
      });
      rzp.open();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to initiate payment'); }
    finally { setLoading(null); }
  };

  return (
    <div className="bg-background">
      <SEO
        title="Join Nachiketa Awareness Society | Membership & Community"
        description="Become a member of Nachiketa Awareness Society. Join a supportive student community focused on self-discovery, wellbeing, and positive social impact."
        slug="/membership"
      />

      <div className="border-b border-border bg-gradient-to-br from-indigo-50 to-lavender-50">
        <div className="container-lg section py-16 text-center">
          <FadeUp><p className="section-label">JOIN NACHIKETA</p></FadeUp>
          <FadeUp delay={0.1}><h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">Become a Member</h1></FadeUp>
          <FadeUp delay={0.2}><p className="section-subtitle mx-auto">Join our community, participate in awareness programs, access learning resources, and help build an informed student community.</p></FadeUp>
        </div>
      </div>

      <section className="section">
        <div className="container-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const Icon = PLAN_ICONS[plan.id] || Zap;
              const color = PLAN_COLORS[plan.id] || 'indigo';
              const isPopular = plan.id === 'premium';
              return (
                <FadeUp key={plan.id} delay={i * 0.1}>
                  <div className={`card relative flex flex-col h-full ${isPopular ? 'border-indigo-200 shadow-soft-lg ring-1 ring-indigo-100' : ''}`}>
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="badge-indigo px-3 py-1 text-xs font-semibold shadow-soft-sm">Recommended</span>
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-4`}>
                      <Icon size={18} className={`text-${color}-500`} />
                    </div>
                    <h3 className="font-bold text-xl text-text-primary mb-1">{plan.name}</h3>
                    <p className="text-text-muted text-sm mb-4">{plan.duration}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-text-primary">₹{plan.price}</span>
                      <span className="text-text-muted text-sm ml-1">contribution</span>
                    </div>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.benefits.map(b => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-text-secondary">
                          <Check size={14} className="text-sage-500 flex-shrink-0 mt-0.5" /> {b}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleSubscribe(plan)} disabled={loading === plan.id}
                      className={`${isPopular ? 'btn-primary shadow-glow-indigo' : 'btn-secondary'} w-full py-3 disabled:opacity-60`}>
                      {loading === plan.id ? 'Processing...' : !isAuthenticated ? <><Lock size={13} /> Join as {plan.name}</> : `Join as ${plan.name}`}
                    </button>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
