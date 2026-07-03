import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Trophy, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { achievementsAPI } from '@/lib/api';

const CAT_COLORS = { award:'badge-amber', competition:'badge-indigo', recognition:'badge-lavender', milestone:'badge-green', other:'badge-gray' };

function AchievementModal({ achievement, onClose }) {
  const qc = useQueryClient();
  const isEdit = !!achievement;
  const { register, handleSubmit, formState:{isSubmitting} } = useForm({
    defaultValues: achievement ? { ...achievement, date: achievement.date ? format(new Date(achievement.date),'yyyy-MM-dd') : '' } : { category:'competition', isFeatured:false },
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) { await achievementsAPI.update(achievement._id, data); toast.success('Achievement updated'); }
      else { await achievementsAPI.create(data); toast.success('Achievement added'); }
      qc.invalidateQueries(['admin-achievements']); onClose();
    } catch { toast.error('Failed to save'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}}
        className="relative bg-white rounded-2xl shadow-soft-xl border border-border w-full max-w-lg my-8 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary">{isEdit?'Edit Achievement':'Add Achievement'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="form-group !mb-0"><label className="label">Title *</label><input {...register('title',{required:true})} className="input" placeholder="Achievement title"/></div>
          <div className="form-group !mb-0"><label className="label">Description *</label><textarea {...register('description',{required:true})} rows={3} className="input resize-none" placeholder="Describe the achievement..."/></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group !mb-0">
              <label className="label">Category</label>
              <select {...register('category')} className="input cursor-pointer">
                {['award','competition','recognition','milestone','other'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group !mb-0"><label className="label">Date *</label><input {...register('date',{required:true})} type="date" className="input"/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group !mb-0"><label className="label">Position / Award</label><input {...register('position')} className="input" placeholder="e.g. 1st Place"/></div>
            <div className="form-group !mb-0"><label className="label">Organizer</label><input {...register('organizer')} className="input" placeholder="e.g. Google"/></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500"/><span className="text-sm text-text-secondary">Feature on homepage</span></label>
        </form>
        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary flex-1 disabled:opacity-60">{isSubmitting?'Saving...':isEdit?'Update':'Add'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminAchievements() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['admin-achievements'], queryFn: () => achievementsAPI.getAll() });
  const deleteMutation = useMutation({
    mutationFn: (id) => achievementsAPI.delete(id),
    onSuccess: () => { toast.success('Achievement removed'); qc.invalidateQueries(['admin-achievements']); },
  });
  const achievements = data?.data?.achievements || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text-primary">Achievements</h1><p className="text-text-muted text-sm mt-0.5">{achievements.length} achievements</p></div>
        <button onClick={()=>{setModal(null);setShowModal(true);}} className="btn-primary gap-2 shadow-glow-indigo"><Plus size={16}/> Add Achievement</button>
      </div>
      <div className="space-y-3">
        {isLoading ? [...Array(5)].map((_,i)=><div key={i} className="card animate-pulse h-16"/>)
        : achievements.length===0 ? (
          <div className="card py-16 text-center"><Trophy size={32} className="text-amber-200 mx-auto mb-3"/><p className="text-text-muted">No achievements yet.</p></div>
        ) : achievements.map(a=>(
          <div key={a._id} className="card flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0"><Trophy size={18} className="text-amber-500"/></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-text-primary text-sm">{a.title}</p>
                {a.isFeatured && <span className="badge-amber text-2xs">Featured</span>}
              </div>
              <div className="flex items-center gap-3">
                <span className={(CAT_COLORS[a.category]||'badge-gray')+" text-2xs capitalize"}>{a.category}</span>
                <span className="text-2xs text-text-muted">{format(new Date(a.date),'MMM yyyy')}</span>
                {a.position && <span className="text-2xs text-text-muted">{a.position}</span>}
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={()=>{setModal(a);setShowModal(true);}} className="p-1.5 rounded-lg hover:bg-indigo-50 text-text-muted hover:text-indigo-600 transition-colors"><Edit2 size={14}/></button>
              <button onClick={()=>{ if(window.confirm("Delete this achievement?")) deleteMutation.mutate(a._id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>{showModal && <AchievementModal achievement={modal} onClose={()=>setShowModal(false)}/>}</AnimatePresence>
    </div>
  );
}
