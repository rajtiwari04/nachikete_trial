import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, UserCheck, X, Linkedin, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { teamAPI, uploadAPI } from '@/lib/api';

function MemberModal({ member, onClose }) {
  const qc = useQueryClient();
  const isEdit = !!member;
  const [avatarUrl, setAvatarUrl] = useState(member?.avatar || '');
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: member
      ? {
          ...member,
          'socialLinks.linkedin':  member.socialLinks?.linkedin  || '',
          'socialLinks.instagram': member.socialLinks?.instagram || '',
        }
      : { department: 'technical', isActive: true, order: 0 },
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file, 'team');
      setAvatarUrl(data.url);
      toast.success('Photo uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      avatar: avatarUrl,
      socialLinks: {
        linkedin:  data['socialLinks.linkedin']  || '',
        instagram: data['socialLinks.instagram'] || '',
      },
    };
    // Remove flattened keys
    delete payload['socialLinks.linkedin'];
    delete payload['socialLinks.instagram'];

    try {
      if (isEdit) {
        await teamAPI.update(member._id, payload);
        toast.success('Member updated');
      } else {
        await teamAPI.create(payload);
        toast.success('Member added');
      }
      qc.invalidateQueries(['admin-team']);
      qc.invalidateQueries(['team']);
      onClose();
    } catch {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-soft-xl border border-border w-full max-w-lg my-8 overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary">{isEdit ? 'Edit Member' : 'Add Team Member'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 overflow-hidden border border-border">
                {avatarUrl
                  ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-indigo-300"><UserCheck size={28} /></div>
                }
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              {uploading && (
                <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Profile Photo</p>
              <p className="text-xs text-text-muted mt-0.5">Click photo to upload</p>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group !mb-0 col-span-2">
              <label className="label">Full Name *</label>
              <input {...register('name', { required: true })} className="input" placeholder="Member name" />
            </div>
            <div className="form-group !mb-0">
              <label className="label">Designation *</label>
              <input {...register('designation', { required: true })} className="input" placeholder="e.g. Technical Head" />
            </div>
            <div className="form-group !mb-0">
              <label className="label">Department *</label>
              <select {...register('department', { required: true })} className="input cursor-pointer">
                {['core', 'technical', 'creative', 'marketing', 'management', 'advisor'].map(d => (
                  <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group !mb-0">
              <label className="label">Year</label>
              <select {...register('year')} className="input cursor-pointer">
                <option value="">Select year</option>
                {['1st', '2nd', '3rd', '4th', 'Alumni'].map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group !mb-0">
              <label className="label">Branch</label>
              <input {...register('branch')} className="input" placeholder="CSE, ECE, MBA..." />
            </div>
            <div className="form-group !mb-0 col-span-2">
              <label className="label">Academic Session *</label>
              <input {...register('session', { required: true })} className="input" placeholder="e.g. 2024-25" />
            </div>
            <div className="form-group !mb-0 col-span-2">
              <label className="label">Bio</label>
              <textarea {...register('bio')} rows={2} className="input resize-none" placeholder="Short bio about the member..." />
            </div>
            <div className="form-group !mb-0 col-span-2">
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="member@email.com" />
            </div>
            <div className="form-group !mb-0">
              <label className="label">Display Order</label>
              <input {...register('order')} type="number" className="input" placeholder="0" />
            </div>
          </div>

          {/* Social links — LinkedIn + Instagram only */}
          <div className="pt-2 border-t border-border">
            <p className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span>Social Links</span>
              <span className="text-xs text-text-muted font-normal">(so members can be reached)</span>
            </p>
            <div className="space-y-3">
              <div className="form-group !mb-0">
                <label className="label flex items-center gap-1.5">
                  <Linkedin size={13} className="text-[#0077B5]" /> LinkedIn Profile
                </label>
                <input
                  {...register('socialLinks.linkedin')}
                  className="input"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div className="form-group !mb-0">
                <label className="label flex items-center gap-1.5">
                  <Instagram size={13} className="text-[#c13584]" /> Instagram Profile
                </label>
                <input
                  {...register('socialLinks.instagram')}
                  className="input"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('isActive')} type="checkbox" defaultChecked className="w-4 h-4 rounded accent-indigo-500" />
            <span className="text-sm text-text-secondary">Active member (visible on website)</span>
          </label>
        </form>

        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
            className="btn-primary flex-1 shadow-glow-indigo disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Member' : 'Add Member'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminTeam() {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: () => teamAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => teamAPI.delete(id),
    onSuccess: () => {
      toast.success('Member removed');
      qc.invalidateQueries(['admin-team']);
      qc.invalidateQueries(['team']);
    },
  });

  const members = data?.data?.members || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Team Members</h1>
          <p className="text-text-muted text-sm mt-0.5">{members.length} members</p>
        </div>
        <button onClick={() => { setModal(null); setShowModal(true); }}
          className="btn-primary gap-2 shadow-glow-indigo">
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream-50/50">
                {['Member', 'Designation', 'Department', 'Session', 'Socials', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td></tr>
                  ))
                : members.map(m => (
                    <tr key={m._id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {m.avatar
                            ? <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                            : <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                                {m.name[0]}
                              </div>
                          }
                          <div>
                            <p className="font-medium text-text-primary text-sm">{m.name}</p>
                            <p className="text-2xs text-text-muted">{[m.year, m.branch].filter(Boolean).join(' · ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">{m.designation}</td>
                      <td className="px-4 py-3">
                        <span className="badge-gray capitalize">{m.department}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-muted">{m.session}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {m.socialLinks?.linkedin
                            ? <a href={m.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#0077B5] hover:opacity-70 transition-opacity"><Linkedin size={14} /></a>
                            : <Linkedin size={14} className="text-cream-300" />
                          }
                          {m.socialLinks?.instagram
                            ? <a href={m.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#c13584] hover:opacity-70 transition-opacity"><Instagram size={14} /></a>
                            : <Instagram size={14} className="text-cream-300" />
                          }
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {m.isActive
                          ? <span className="badge-green">Active</span>
                          : <span className="badge-gray">Inactive</span>
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => { setModal(m); setShowModal(true); }}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-text-muted hover:text-indigo-600 transition-colors">
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => { if (window.confirm(`Remove ${m.name}?`)) deleteMutation.mutate(m._id); }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!isLoading && members.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-text-muted text-sm">No team members yet. Add your first member!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <MemberModal member={modal} onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}