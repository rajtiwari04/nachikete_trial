import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import SEO from '@/components/ui/SEO';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully. Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <SEO title="Reset Password | Nachiketa Awareness Society" noindex={true} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[380px]">
        <h1 className="text-2xl font-bold text-text-primary mb-1">Set new password</h1>
        <p className="text-text-secondary text-sm mb-6">Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-group">
            <label className="label">New password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input {...register('password', { required: true, minLength: { value: 8, message: 'Min 8 characters' } })}
                type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`} />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <div className="form-group">
            <label className="label">Confirm password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input {...register('confirm', { validate: v => v === watch('password') || 'Passwords do not match' })}
                type="password" placeholder="Repeat password" className={`input pl-9 ${errors.confirm ? 'input-error' : ''}`} />
            </div>
            {errors.confirm && <p className="form-error">{errors.confirm.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 shadow-glow-indigo disabled:opacity-60">
            {loading ? 'Resetting...' : <><ArrowRight size={15} /> Reset password</>}
          </button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          <Link to="/login" className="text-indigo-600 hover:underline">Back to sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
