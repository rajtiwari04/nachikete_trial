import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Phone, GraduationCap, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters').max(50),
  email:    z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  phone:    z.string().optional(),
  college:  z.string().optional(),
  year:     z.string().optional(),
  branch:   z.string().optional(),
});

const PERKS = [
  'Access to all events and workshops',
  'Member-only discounts on paid events',
  'QR ticket generation for events',
  'Personalized dashboard & profile',
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from || '/dashboard';

  const { register, handleSubmit, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const handleStep1 = async () => {
    const valid = await trigger(['name', 'email', 'password']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Account created! Please verify your email.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ─── Left panel ────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] bg-gradient-to-br from-indigo-50 via-lavender-50 to-cream-100 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-orb w-64 h-64 -top-16 -left-16 bg-indigo-200 opacity-40" />
          <div className="floating-orb w-48 h-48 bottom-10 right-0 bg-lavender-200 opacity-30" />
        </div>
        <div className="relative z-10 w-full max-w-sm">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-lavender-500 flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-text-primary">Nach<span className="text-indigo-500">iketa</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Join our community</h2>
          <p className="text-text-secondary text-sm mb-8">Create your free account and unlock a world of events, workshops, and opportunities.</p>
          <div className="space-y-3">
            {PERKS.map((perk, i) => (
              <motion.div key={perk} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i + 0.3 }}
                className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={12} className="text-sage-500" />
                </div>
                <span className="text-sm text-text-secondary">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right panel / Form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] py-8"
        >
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-lavender-500 flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="font-bold text-xl text-text-primary">Nach<span className="text-indigo-500">iketa</span></span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1,2].map(s => (
              <div key={s} className={`flex items-center gap-2 ${s < 2 ? 'flex-1' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-indigo-500 text-white shadow-soft-sm' : 'bg-cream-200 text-text-muted'}`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s ? 'bg-indigo-400' : 'bg-cream-200'}`} />}
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-1">
            {step === 1 ? 'Create your account' : 'Your details'}
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            {step === 1 ? 'Start with your essential information' : 'Help us personalize your experience (optional)'}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <div className="form-group">
                  <label className="label">Full name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input {...register('name')} type="text" placeholder="Your full name"
                      className={`input pl-9 ${errors.name ? 'input-error' : ''}`} />
                  </div>
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div className="form-group">
                  <label className="label">Email address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input {...register('email')} type="email" placeholder="you@example.com"
                      className={`input pl-9 ${errors.email ? 'input-error' : ''}`} />
                  </div>
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
                <div className="form-group">
                  <label className="label">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input {...register('password')} type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="form-error">{errors.password.message}</p>}
                </div>
                <button type="button" onClick={handleStep1} className="btn-primary w-full py-3 mt-2 shadow-glow-indigo">
                  Continue <ArrowRight size={15} />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label className="label">Phone number <span className="text-text-muted font-normal">(optional)</span></label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input {...register('phone')} type="tel" placeholder="+91 98765 43210" className="input pl-9" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">College / Institution <span className="text-text-muted font-normal">(optional)</span></label>
                  <div className="relative">
                    <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input {...register('college')} type="text" placeholder="Your college name" className="input pl-9" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="label">Year</label>
                    <select {...register('year')} className="input cursor-pointer">
                      <option value="">Select year</option>
                      {['1st','2nd','3rd','4th','Alumni'].map(y => <option key={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Branch</label>
                    <input {...register('branch')} type="text" placeholder="CSE, ECE..." className="input" />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-3 shadow-glow-indigo disabled:opacity-60">
                    {isLoading
                      ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</span>
                      : <>Create account <ArrowRight size={15} /></>
                    }
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" state={location.state} className="text-indigo-600 font-medium hover:text-indigo-700">Sign in</Link>
          </p>

          <p className="text-center text-xs text-text-muted mt-4">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
