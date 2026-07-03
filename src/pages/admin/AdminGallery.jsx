import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, Image, X, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { galleryAPI, uploadAPI } from '@/lib/api';

function UploadModal({ onClose }) {
  const qc = useQueryClient();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { category: 'events' } });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const { data } = await uploadAPI.uploadImage(file, 'gallery'); setImageUrl(data.url); toast.success('Image uploaded'); }
    catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) { toast.error('Please upload an image first'); return; }
    try {
      await galleryAPI.create({ ...data, imageUrl, thumbnailUrl: imageUrl });
      toast.success('Image added to gallery');
      qc.invalidateQueries(['admin-gallery']); onClose();
    } catch { toast.error('Failed to add image'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
        className="relative bg-white rounded-2xl shadow-soft-xl border border-border w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary">Add to Gallery</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="label">Image *</label>
            <div className="relative h-40 border-2 border-dashed border-border rounded-xl overflow-hidden hover:border-indigo-300 cursor-pointer transition-colors">
              {imageUrl ? <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"/> : <div className="w-full h-full flex flex-col items-center justify-center text-text-muted"><Upload size={28} className="mb-2"/><span className="text-sm">Click to upload image</span></div>}
              <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/></div>}
            </div>
          </div>
          <div className="form-group !mb-0"><label className="label">Title *</label><input {...register('title',{required:true})} className="input" placeholder="Image title"/></div>
          <div className="form-group !mb-0"><label className="label">Description</label><input {...register('description')} className="input" placeholder="Optional description"/></div>
          <div className="form-group !mb-0">
            <label className="label">Category</label>
            <select {...register('category')} className="input cursor-pointer">
              {['events','team','achievements','campus','other'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500"/><span className="text-sm text-text-secondary">Featured image</span></label>
        </form>
        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting||!imageUrl} className="btn-primary flex-1 shadow-glow-indigo disabled:opacity-60">{isSubmitting?'Adding...':'Add to Gallery'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminGallery() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery', category],
    queryFn: () => galleryAPI.getAll(category ? { category } : {}),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => galleryAPI.delete(id),
    onSuccess: () => { toast.success('Image deleted'); qc.invalidateQueries(['admin-gallery']); },
  });

  const images = data?.data?.images || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text-primary">Gallery</h1><p className="text-text-muted text-sm mt-0.5">{images.length} images</p></div>
        <button onClick={()=>setShowModal(true)} className="btn-primary gap-2 shadow-glow-indigo"><Plus size={16}/> Add Image</button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['','events','team','achievements','campus','other'].map(c=>(
          <button key={c} onClick={()=>setCategory(c)} className={"px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all "+(category===c?'bg-indigo-500 text-white border-indigo-500':'bg-surface border-border text-text-secondary hover:border-indigo-200')}>
            {c===''?'All':c.charAt(0).toUpperCase()+c.slice(1)}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(8)].map((_,i)=><div key={i} className="skeleton aspect-square rounded-xl"/>)}</div>
      ) : images.length===0 ? (
        <div className="card py-20 text-center"><Image size={36} className="text-indigo-200 mx-auto mb-3"/><p className="text-text-muted">No images yet. Upload your first image!</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img,i)=>(
            <motion.div key={img._id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.03}} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={img.thumbnailUrl||img.imageUrl} alt={img.title} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
                <div className="flex items-center justify-between w-full">
                  <p className="text-white text-xs font-medium truncate flex-1">{img.title}</p>
                  <button onClick={()=>{ if(window.confirm('Delete this image?')) deleteMutation.mutate(img._id); }} className="ml-2 p-1.5 bg-rose-500 rounded-lg text-white hover:bg-rose-600 transition-colors flex-shrink-0"><Trash2 size={12}/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>{showModal && <UploadModal onClose={()=>setShowModal(false)}/>}</AnimatePresence>
    </div>
  );
}
