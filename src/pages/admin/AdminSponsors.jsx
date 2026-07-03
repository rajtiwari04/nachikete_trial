import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Building2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { sponsorsAPI, uploadAPI } from '@/lib/api';

const TIER_COLORS = { platinum:'badge-indigo', gold:'badge-amber', silver:'badge-gray', bronze:'badge-gray', partner:'badge-lavender' };

function SponsorModal({ sponsor, onClose }) {
  const qc = useQueryClient();
  const isEdit = !!sponsor;
  const [logoUrl, setLogoUrl] = useState(sponsor?.logo||'');
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState:{isSubmitting} } = useForm({ defaultValues: sponsor || { tier:'partner', isActive:true, order:0 } });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    setUploading(true);
    try { const {data} = await uploadAPI.uploadImage(file,'sponsors'); setLogoUrl(data.url); toast.success('Logo uploaded'); }
    catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    if (!logoUrl) { toast.error('Please upload a logo'); return; }
    try {
      if (isEdit) { await sponsorsAPI.update(sponsor._id, {...data, logo:logoUrl}); toast.success('Sponsor updated'); }
      else { await sponsorsAPI.create({...data, logo:logoUrl}); toast.success('Sponsor added'); }
      qc.invalidateQueries(['admin-sponsors']); onClose();
    } catch { toast.error('Failed to save'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="relative bg-white rounded-2xl shadow-soft-xl border border-border w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary">{isEdit?'Edit Sponsor':'Add Sponsor'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="label">Logo *</label>
            <div className="relative h-24 border-2 border-dashed border-border rounded-xl overflow-hidden hover:border-indigo-300 cursor-pointer bg-cream-50 flex items-center justify-center transition-colors">
              {logoUrl ? <img src={logoUrl} alt="Logo" className="max-h-16 max-w-full object-contain"/> : <div className="text-center text-text-muted"><Building2 size={24} className="mx-auto mb-1"/><span className="text-xs">Upload logo</span></div>}
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/></div>}
            </div>
          </div>
          <div className="form-group !mb-0"><label className="label">Company Name *</label><input {...register('name',{required:true})} className="input" placeholder="Company name"/></div>
          <div className="form-group !mb-0"><label className="label">Website</label><input {...register('website')} type="url" className="input" placeholder="https://example.com"/></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group !mb-0">
              <label className="label">Tier</label>
              <select {...register('tier')} className="input cursor-pointer">
                {['platinum','gold','silver','bronze','partner'].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group !mb-0"><label className="label">Order</label><input {...register('order')} type="number" className="input" placeholder="0"/></div>
          </div>
          <div className="form-group !mb-0"><label className="label">Description</label><textarea {...register('description')} rows={2} className="input resize-none" placeholder="Brief description"/></div>
          <label className="flex items-center gap-2 cursor-pointer"><input {...register('isActive')} type="checkbox" defaultChecked className="w-4 h-4 rounded accent-indigo-500"/><span className="text-sm text-text-secondary">Active sponsor</span></label>
        </form>
        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting||!logoUrl} className="btn-primary flex-1 disabled:opacity-60">{isSubmitting?'Saving...':isEdit?'Update':'Add Sponsor'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminSponsors() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['admin-sponsors'], queryFn: () => sponsorsAPI.getAll() });
  const deleteMutation = useMutation({
    mutationFn: (id) => sponsorsAPI.delete(id),
    onSuccess: () => { toast.success('Sponsor removed'); qc.invalidateQueries(['admin-sponsors']); },
  });
  const sponsors = data?.data?.sponsors || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text-primary">Sponsors</h1><p className="text-text-muted text-sm mt-0.5">{sponsors.length} sponsors</p></div>
        <button onClick={()=>{setModal(null);setShowModal(true);}} className="btn-primary gap-2 shadow-glow-indigo"><Plus size={16}/> Add Sponsor</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? [...Array(6)].map((_,i)=><div key={i} className="card animate-pulse h-28"/>)
        : sponsors.length===0 ? <div className="card col-span-3 py-16 text-center"><Building2 size={32} className="text-indigo-200 mx-auto mb-3"/><p className="text-text-muted">No sponsors yet.</p></div>
        : sponsors.map(s=>(
          <div key={s._id} className="card flex items-center gap-4">
            <div className="w-20 h-12 bg-cream-50 rounded-lg border border-border flex items-center justify-center flex-shrink-0 p-2">
              <img src={s.logo} alt={s.name} className="max-h-8 max-w-full object-contain"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary text-sm">{s.name}</p>
              <span className={(TIER_COLORS[s.tier]||'badge-gray')+" text-2xs capitalize mt-1"}>{s.tier}</span>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={()=>{setModal(s);setShowModal(true);}} className="p-1.5 rounded-lg hover:bg-indigo-50 text-text-muted hover:text-indigo-600 transition-colors"><Edit2 size={13}/></button>
              <button onClick={()=>{ if(window.confirm("Remove "+s.name+"?")) deleteMutation.mutate(s._id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors"><Trash2 size={13}/></button>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>{showModal && <SponsorModal sponsor={modal} onClose={()=>setShowModal(false)}/>}</AnimatePresence>
    </div>
  );
}
