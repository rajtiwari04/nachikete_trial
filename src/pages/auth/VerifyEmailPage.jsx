import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '@/lib/api';
import SEO from '@/components/ui/SEO';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <SEO title="Verify Email | Nachiketa Awareness Society" noindex={true} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
        {status === 'loading' && (
          <>
            <Loader size={40} className="text-indigo-400 mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-bold text-text-primary">Verifying your email...</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <CheckCircle size={30} className="text-sage-500" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Email verified!</h1>
            <p className="text-text-secondary text-sm mb-6">Your email has been verified. You can now access all features.</p>
            <Link to="/dashboard" className="btn-primary px-8 py-3">Go to dashboard</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <XCircle size={30} className="text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Verification failed</h1>
            <p className="text-text-secondary text-sm mb-6">The link may have expired or is invalid.</p>
            <Link to="/login" className="btn-secondary px-8 py-3">Back to sign in</Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
