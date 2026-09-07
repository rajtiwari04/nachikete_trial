import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/store/authStore';
import SEO from '@/components/ui/SEO';
import Logo from '@/components/ui/Logo';

const loginSchema = z.object({
  email:    z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = location.state?.from || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data);
      toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <SEO title="Sign In | Nachiketa Awareness Society" noindex={true} slug="/login" />
      {/* ─── Left panel ──────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 via-lavender-50 to-cream-100 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="floating-orb w-64 h-64 top-10 -left-16 bg-indigo-200 opacity-40" />
          <div className="floating-orb w-48 h-48 bottom-20 right-10 bg-lavender-200 opacity-40" />
        </div>
        <div className="relative z-10 text-center px-12">
          <Logo to="/" size="xl" className="justify-center mb-10" imgClassName="shadow-soft-md" />
          <blockquote className="text-2xl font-bold text-text-primary leading-snug tracking-tight mb-4 text-balance">
            "Awareness is the first step toward meaningful change."
          </blockquote>
          <p className="text-text-secondary text-sm">Join our student community at Nachiketa Awareness Society.</p>

          <div className="mt-12 grid grid-cols-3 gap-4 text-left">
            {[
              { value: '200+', label: 'Student Members' },
              { value: '5+',    label: 'Awareness Sessions' },
              { value: '2024',  label: 'Established' },
            ].map(({ value, label }) => (
              <div key={label} className="card-glass px-4 py-3">
                <p className="text-xl font-bold gradient-text">{value}</p>
                <p className="text-xs text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right panel / Form ───────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <Logo to="/" size="md" className="mb-8 lg:hidden" />

          <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back</h1>
          <p className="text-text-secondary text-sm mb-8">Sign in to your Nachiketa account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-group">
              <label className="label">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input {...register('email')} type="email" placeholder="you@example.com"
                  className={`input pl-9 ${errors.email ? 'input-error' : ''}`} autoComplete="email" />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input {...register('password')} type={showPassword ? 'text' : 'password'}
                  placeholder="Your password" className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="btn-primary w-full py-3 text-sm mt-2 shadow-glow-indigo disabled:opacity-60">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" state={location.state} className="text-indigo-600 font-medium hover:text-indigo-700">
              Create one free
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <Sparkles size={14} className="text-indigo-500 flex-shrink-0" />
              <p className="text-xs text-indigo-700">
                New here? <Link to="/register" className="font-semibold hover:underline">Join Nachiketa</Link> and unlock all community features.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
