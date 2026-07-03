import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, FileText, X, Globe, FileEdit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { blogsAPI, uploadAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const STATUS_COLORS = { draft: 'badge-gray', published: 'badge-green', archived: 'badge-amber' };

function BlogModal({ blog, onClose }) {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const isEdit = !!blog;
  const [coverUrl, setCoverUrl] = useState(blog?.coverImage || '');
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: blog || { category: 'technology', status: 'draft', readTime: 5 },
  });

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try { const { data } = await uploadAPI.uploadImage(file, 'blogs'); setCoverUrl(data.url); toast.success('Cover uploaded'); }
    catch { toast.error('Upload failed'); } finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    const payload = { ...data, coverImage: coverUrl, author: user._id };
    try {
      if (isEdit) { await blogsAPI.update(blog._id, payload); toast.success('Blog updated'); }
      else { await blogsAPI.create(payload); toast.success('Blog created'); }
      qc.invalidateQueries(['admin-blogs']); onClose();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95}}
        className="relative bg-white rounded-2xl shadow-soft-xl border border-border w-full max-w-2xl my-8 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary text-lg">{isEdit ? 'Edit Blog' : 'New Blog Post'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Cover image */}
          <div>
            <label className="label">Cover Image</label>
            <div className="relative h-32 border-2 border-dashed border-border rounded-xl overflow-hidden hover:border-indigo-300 transition-colors cursor-pointer">
              {coverUrl ? <img src={coverUrl} alt="Cover" className="w-full h-full object-cover"/> : <div className="w-full h-full flex flex-col items-center justify-center text-text-muted"><FileText size={24} className="mb-2"/><span className="text-xs">Click to upload cover</span></div>}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"/></div>}
            </div>
          </div>
          <div className="form-group !mb-0">
            <label className="label">Title *</label>
            <input {...register('title',{required:true})} className="input" placeholder="Blog post title"/>
          </div>
          <div className="form-group !mb-0">
            <label className="label">Excerpt</label>
            <textarea {...register('excerpt')} rows={2} className="input resize-none" placeholder="Short summary (max 300 chars)" maxLength={300}/>
          </div>
          <div className="form-group !mb-0">
            <label className="label">Content *</label>
            <textarea {...register('content',{required:true})} rows={8} className="input resize-none font-mono text-xs" placeholder="Write your content here (Markdown supported)..."/>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group !mb-0">
              <label className="label">Category</label>
              <select {...register('category')} className="input cursor-pointer">
                {['technology','events','society','achievements','tips','other'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group !mb-0">
              <label className="label">Status</label>
              <select {...register('status')} className="input cursor-pointer">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="form-group !mb-0">
              <label className="label">Read Time (min)</label>
              <input {...register('readTime')} type="number" min="1" max="60" className="input"/>
            </div>
          </div>
          <div className="form-group !mb-0">
            <label className="label">Tags (comma separated)</label>
            <input {...register('tags')} className="input" placeholder="react, javascript, tutorial"/>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500"/>
            <span className="text-sm text-text-secondary">Mark as featured</span>
          </label>
        </form>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary shadow-glow-indigo disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Publish'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminBlogs() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', page, search],
    queryFn: () => blogsAPI.getAll({ page, limit: 10, search: search||undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogsAPI.delete(id),
    onSuccess: () => { toast.success('Blog deleted'); qc.invalidateQueries(['admin-blogs']); },
  });

  const blogs = data?.data?.blogs || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text-primary">Blogs</h1><p className="text-text-muted text-sm mt-0.5">Manage blog posts and articles</p></div>
        <button onClick={()=>{setModal(null);setShowModal(true);}} className="btn-primary gap-2 shadow-glow-indigo"><Plus size={16}/> New Post</button>
      </div>
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"/>
        <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search blogs..." className="input pl-9 text-sm"/>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-cream-50/50">
              {['Post','Category','Status','Views','Date','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {isLoading ? [...Array(5)].map((_,i)=><tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-4 rounded w-full"/></td></tr>)
              : blogs.map(blog=>(
                <tr key={blog._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {blog.coverImage ? <img src={blog.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"/>
                        : <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0"><FileText size={16} className="text-indigo-400"/></div>}
                      <div className="min-w-0">
                        <p className="font-medium text-text-primary truncate max-w-[200px]">{blog.title}</p>
                        <p className="text-xs text-text-muted truncate max-w-[200px]">{blog.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="badge-gray capitalize">{blog.category}</span></td>
                  <td className="px-4 py-3"><span className={STATUS_COLORS[blog.status]||'badge-gray'}>{blog.status}</span></td>
                  <td className="px-4 py-3 text-text-secondary text-xs">{blog.views||0}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">{blog.publishedAt ? format(new Date(blog.publishedAt),'MMM d, yy') : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {blog.status==='published' && <Link to={`/blogs/${blog.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-cream-100 text-text-muted hover:text-indigo-600 transition-colors"><Eye size={14}/></Link>}
                      <button onClick={()=>{setModal(blog);setShowModal(true);}} className="p-1.5 rounded-lg hover:bg-indigo-50 text-text-muted hover:text-indigo-600 transition-colors"><Edit2 size={14}/></button>
                      <button onClick={()=>{ if(window.confirm('Delete this blog post?')) deleteMutation.mutate(blog._id); }} className="p-1.5 rounded-lg hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && blogs.length===0 && <tr><td colSpan={6} className="text-center py-12 text-text-muted text-sm">No blog posts yet. Create your first post!</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages>1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-text-muted">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40">← Prev</button>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>{showModal && <BlogModal blog={modal} onClose={()=>setShowModal(false)}/>}</AnimatePresence>
    </div>
  );
}
