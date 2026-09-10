import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Edit2, Trash2, UserCheck, X, Linkedin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { teamAPI, uploadAPI } from '@/lib/api';

const SECTION_OPTIONS = [
  { value: 'leadership', label: 'Leadership' },
  { value: 'core-team', label: 'Core Team' },
];

const DIVISION_OPTIONS = {
  'leadership': [
    { value: 'president', label: 'President' },
    { value: 'management', label: 'Management' },
  ],
  'core-team': [
    { value: 'research-policy', label: 'Research & Policy' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'media-communications', label: 'Media & Communications' },
    { value: 'research', label: 'Research' },
    { value: 'writing', label: 'Writing' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'photography', label: 'Photography' },
  ],
};

const DIVISION_LABEL_MAP = {
  'president': 'President',
  'management': 'Management',
  'research-policy': 'Research & Policy',
  'outreach': 'Outreach',
  'media-communications': 'Media & Communications',
  'research': 'Research',
  'writing': 'Writing',
  'social-media': 'Social Media',
  'photography': 'Photography',
};

function MemberModal({ member, onClose }) {
  const qc = useQueryClient();
  const isEdit = !!member;
  const [photoUrl, setPhotoUrl] = useState(member?.photo || member?.avatar || '');
  const [uploading, setUploading] = useState(false);

  const defaultSec = member?.section || 'leadership';
  const defaultDiv = member?.division || (defaultSec === 'leadership' ? 'president' : 'research-policy');

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: member
      ? {
          name: member.name || '',
          position: member.position || member.designation || '',
          section: defaultSec,
          division: defaultDiv,
          bio: member.bio || '',
          linkedin: member.linkedin || member.socialLinks?.linkedin || '',
          session: member.session || '2024-25',
          order: member.order ?? 0,
          isActive: member.isActive ?? true,
          year: member.year || '',
          branch: member.branch || '',
          email: member.email || '',
        }
      : {
          section: 'leadership',
          division: 'president',
          session: '2024-25',
          order: 0,
          isActive: true,
        },
  });

  const currentSection = watch('section');
  const availableDivisions = DIVISION_OPTIONS[currentSection] || DIVISION_OPTIONS['leadership'];

  const handleSectionChange = (e) => {
    const newSec = e.target.value;
    setValue('section', newSec);
    const validDivs = DIVISION_OPTIONS[newSec] || [];
    if (validDivs.length > 0) {
      setValue('division', validDivs[0].value);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file, 'team');
      setPhotoUrl(data.url);
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
      position: data.position,
      designation: data.position,
      photo: photoUrl,
      avatar: photoUrl,
      linkedin: data.linkedin,
      socialLinks: {
        linkedin: data.linkedin || '',
      },
    };

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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save team member');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-soft-xl border border-border w-full max-w-lg my-8 overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary">{isEdit ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-indigo-50 overflow-hidden border border-border">
                {photoUrl ? (
                  <img src={photoUrl} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-300">
                    <UserCheck size={28} />
                  </div>
                )}
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
              <p className="text-xs text-text-muted mt-0.5">Click photo box to upload file</p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">

            {/* Name */}
            <div className="form-group !mb-0 col-span-2">
              <label className="label">Full Name *</label>
              <input {...register('name', { required: 'Name is required' })} className="input" placeholder="e.g. Arjun Verma" />
            </div>

            {/* Position */}
            <div className="form-group !mb-0 col-span-2">
              <label className="label">Position / Role *</label>
              <input {...register('position', { required: 'Position is required' })} className="input" placeholder="e.g. President, Research Lead..." />
            </div>

            {/* Section */}
            <div className="form-group !mb-0">
              <label className="label">Section *</label>
              <select
                {...register('section', { required: true })}
                onChange={handleSectionChange}
                className="input cursor-pointer"
              >
                {SECTION_OPTIONS.map(sec => (
                  <option key={sec.value} value={sec.value}>{sec.label}</option>
                ))}
              </select>
            </div>

            {/* Division */}
            <div className="form-group !mb-0">
              <label className="label">Division *</label>
              <select {...register('division', { required: true })} className="input cursor-pointer">
                {availableDivisions.map(div => (
                  <option key={div.value} value={div.value}>{div.label}</option>
                ))}
              </select>
            </div>

            {/* Session */}
            <div className="form-group !mb-0">
              <label className="label">Session *</label>
              <input {...register('session', { required: true })} className="input" placeholder="e.g. 2024-25" />
            </div>

            {/* Display Order */}
            <div className="form-group !mb-0">
              <label className="label">Display Order</label>
              <input {...register('order')} type="number" className="input" placeholder="0" />
            </div>

            {/* Short Bio */}
            <div className="form-group !mb-0 col-span-2">
              <label className="label">Short Bio</label>
              <textarea {...register('bio')} rows={2} className="input resize-none" placeholder="Short biography..." />
            </div>

            {/* LinkedIn */}
            <div className="form-group !mb-0 col-span-2">
              <label className="label flex items-center gap-1.5">
                <Linkedin size={13} className="text-[#0077B5]" /> LinkedIn URL
              </label>
              <input
                {...register('linkedin')}
                type="url"
                className="input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input {...register('isActive')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
            <span className="text-sm text-text-secondary">Active member (visible on website)</span>
          </label>
        </form>

        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary flex-1 shadow-glow-indigo disabled:opacity-60"
          >
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
    queryFn: () => teamAPI.getAll({ includeInactive: 'true' }),
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
          <p className="text-text-muted text-sm mt-0.5">{members.length} members total</p>
        </div>
        <button
          onClick={() => { setModal(null); setShowModal(true); }}
          className="btn-primary gap-2 shadow-glow-indigo"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream-50/50">
                {['Member', 'Position', 'Section', 'Division', 'LinkedIn', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3">
                      <div className="skeleton h-4 rounded" />
                    </td>
                  </tr>
                ))
              ) : (
                members.map(m => {
                  const photo = m.photo || m.avatar;
                  const pos = m.position || m.designation || 'Member';
                  const linkedin = m.linkedin || m.socialLinks?.linkedin;
                  const secLabel = m.section === 'leadership' ? 'Leadership' : 'Core Team';
                  const divLabel = DIVISION_LABEL_MAP[m.division] || m.division || '-';

                  return (
                    <tr key={m._id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img src={photo} alt={m.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                              {m.name?.[0] || 'U'}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-text-primary text-sm">{m.name}</p>
                            <p className="text-2xs text-text-muted">{m.session || '2024-25'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary font-medium">{pos}</td>
                      <td className="px-4 py-3">
                        <span className={`text-2xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          m.section === 'leadership'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-sage-50 text-sage-700 border-sage-200'
                        }`}>
                          {secLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-text-secondary">{divLabel}</td>
                      <td className="px-4 py-3">
                        {linkedin ? (
                          <a
                            href={linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0077B5] hover:opacity-70 transition-opacity"
                          >
                            <Linkedin size={15} />
                          </a>
                        ) : (
                          <span className="text-2xs text-cream-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {m.isActive ? (
                          <span className="badge-green">Active</span>
                        ) : (
                          <span className="badge-gray">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => { setModal(m); setShowModal(true); }}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-text-muted hover:text-indigo-600 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Remove ${m.name}?`)) {
                                deleteMutation.mutate(m._id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {!isLoading && members.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-text-muted text-sm">
                    No team members found. Add your first member!
                  </td>
                </tr>
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