import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-orb w-96 h-96 -top-20 -left-20 bg-indigo-100 opacity-50"/>
        <div className="floating-orb w-64 h-64 bottom-10 right-10 bg-lavender-100 opacity-40"/>
      </div>
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-center relative z-10">
        <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",delay:0.1}} className="text-8xl font-bold gradient-text mb-4">404</motion.div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">Page not found</h1>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">The page you are looking for does not exist or has been moved. Let us get you back on track.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={()=>navigate(-1)} className="btn-secondary gap-2"><ArrowLeft size={14}/>Go back</button>
          <Link to="/" className="btn-primary gap-2 shadow-glow-indigo"><Home size={14}/>Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
