import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';
export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-[200]">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
        <Logo size="xl" showText={false} imgClassName="shadow-soft animate-pulse-soft" />
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
