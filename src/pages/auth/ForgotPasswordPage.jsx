import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import SEO from '@/components/ui/SEO';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <SEO title="Forgot Password | Nachiketa Awareness Society" noindex={true} slug="/forgot-password" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[380px]">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <CheckCircle size={26} className="text-sage-500" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Check your email</h1>
            <p className="text-text-secondary text-sm">We've sent a password reset link to your email address. It expires in 1 hour.</p>
            <Link to="/login" className="btn-primary w-full mt-6 py-3">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-text-primary mb-1">Forgot password?</h1>
            <p className="text-text-secondary text-sm mb-6">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-group">
                <label className="label">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input {...register('email', { required: 'Email is required' })} type="email" placeholder="you@example.com" className="input pl-9" />
                </div>
                {errors.email && <p className="form-error">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 shadow-glow-indigo disabled:opacity-60">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
