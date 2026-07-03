import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, Calendar, Users, X, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { eventsAPI, uploadAPI } from '@/lib/api';
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  draft: 'badge-gray', upcoming: 'badge-green', ongoing: 'badge-indigo',
  completed: 'badge-gray', cancelled: 'badge-red',
};

function EventModal({ event, onClose }) {
  const qc = useQueryClient();
  const isEdit = !!event;
  const [uploading, setUploading] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(event?.banner || '');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: event ? {
      ...event,
      date: event.date ? format(new Date(event.date), "yyyy-MM-dd'T'HH:mm") : '',
      'venue.name': event.venue?.name || '',
      'venue.address': event.venue?.address || '',
    } : { category: 'workshop', status: 'draft', isPaid: false, certificateProvided: false },
  });

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadAPI.uploadImage(file, 'events');
      setBannerUrl(data.url);
      toast.success('Banner uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      banner: bannerUrl,
      venue: { name: data['venue.name'], address: data['venue.address'] },
      price: Number(data.price) || 0,
      memberPrice: Number(data.memberPrice) || 0,
      maxSeats: data.maxSeats ? Number(data.maxSeats) : null,
    };
    delete payload['venue.name']; delete payload['venue.address'];

    try {
      if (isEdit) {
        await eventsAPI.update(event._id, payload);
        toast.success('Event updated');
      } else {
        await eventsAPI.create(payload);
        toast.success('Event created');
      }
      qc.invalidateQueries(['admin-events']);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-soft-xl border border-border w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-text-primary text-lg">{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Banner upload */}
          <div>
            <label className="label">Event Banner</label>
            <div className="relative h-36 border-2 border-dashed border-border rounded-xl overflow-hidden hover:border-indigo-300 transition-colors cursor-pointer">
              {bannerUrl
                ? <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                    <Calendar size={24} className="mb-2" />
                    <span className="text-xs">Click to upload banner</span>
                  </div>
              }
              <input type="file" accept="image/*" onChange={handleBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}
            </div>
          </div>

          {/* Title */}
          <div className="form-group !mb-0">
            <label className="label">Event Title *</label>
            <input {...register('title', { required: 'Title is required' })} className={`input ${errors.title ? 'input-error' : ''}`} placeholder="e.g. Web Development Bootcamp" />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          <div className="form-group !mb-0">
            <label className="label">Short Description</label>
            <input {...register('shortDescription')} className="input" placeholder="One-line summary (max 200 chars)" maxLength={200} />
          </div>

          <div className="form-group !mb-0">
            <label className="label">Full Description *</label>
            <textarea {...register('description', { required: 'Description is required' })}
              rows={4} className={`input resize-none ${errors.description ? 'input-error' : ''}`} placeholder="Detailed event description..." />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group !mb-0">
              <label className="label">Category *</label>
              <select {...register('category', { required: true })} className="input cursor-pointer">
                {['workshop','seminar','hackathon','cultural','sports','technical','social','other'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="form-group !mb-0">
              <label className="label">Status *</label>
              <select {...register('status', { required: true })} className="input cursor-pointer">
                {['draft','upcoming','ongoing','completed','cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group !mb-0">
              <label className="label">Date & Time *</label>
              <input {...register('date', { required: 'Date is required' })} type="datetime-local" className={`input ${errors.date ? 'input-error' : ''}`} />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
            <div className="form-group !mb-0">
              <label className="label">Display Time</label>
              <input {...register('time')} className="input" placeholder="e.g. 10:00 AM - 1:00 PM" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group !mb-0">
              <label className="label">Venue Name *</label>
              <input {...register('venue.name', { required: 'Venue is required' })} className="input" placeholder="LHC Auditorium" />
            </div>
            <div className="form-group !mb-0">
              <label className="label">Venue Address</label>
              <input {...register('venue.address')} className="input" placeholder="Full address" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group !mb-0">
              <label className="label">Price (₹)</label>
              <input {...register('price')} type="number" min="0" className="input" placeholder="0 = Free" />
            </div>
            <div className="form-group !mb-0">
              <label className="label">Member Price (₹)</label>
              <input {...register('memberPrice')} type="number" min="0" className="input" placeholder="Discounted" />
            </div>
            <div className="form-group !mb-0">
              <label className="label">Max Seats</label>
              <input {...register('maxSeats')} type="number" min="1" className="input" placeholder="Unlimited" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('isPaid')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
              <span className="text-sm text-text-secondary">Paid event</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
              <span className="text-sm text-text-secondary">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('certificateProvided')} type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
              <span className="text-sm text-text-secondary">Certificate</span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary shadow-glow-indigo disabled:opacity-60">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminEvents() {
  const qc = useQueryClient();
  const [modalEvent, setModalEvent] = useState(null);
  const [showModal, setShowModal]   = useState(false);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-events', page, search],
    queryFn:  () => eventsAPI.getAll({ page, limit: 10, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => eventsAPI.delete(id),
    onSuccess: () => { toast.success('Event deleted'); qc.invalidateQueries(['admin-events']); },
    onError: () => toast.error('Failed to delete event'),
  });

  const events     = data?.data?.events     || [];
  const totalPages = data?.data?.totalPages || 1;

  const openCreate = () => { setModalEvent(null); setShowModal(true); };
  const openEdit   = (ev) => { setModalEvent(ev); setShowModal(true); };

  const confirmDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Events</h1>
          <p className="text-text-muted text-sm mt-0.5">Manage all society events</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2 shadow-glow-indigo">
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search events..." className="input pl-9 text-sm" />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-cream-50/50">
                {['Event','Category','Date','Seats','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-4 rounded w-full" /></td></tr>
              )) : events.map(event => (
                <tr key={event._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {event.banner
                        ? <img src={event.banner} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0"><Calendar size={16} className="text-indigo-400" /></div>
                      }
                      <div className="min-w-0">
                        <p className="font-medium text-text-primary truncate max-w-[180px]">{event.title}</p>
                        <p className="text-xs text-text-muted">{event.isPaid ? `₹${event.price}` : 'Free'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge-gray capitalize">{event.category}</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">
                    {event.date ? format(new Date(event.date), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Users size={12} className="text-text-muted" />
                      {event.registeredCount}{event.maxSeats ? `/${event.maxSeats}` : ''}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`${STATUS_COLORS[event.status] || 'badge-gray'} capitalize`}>{event.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/events/${event.slug}`} target="_blank"
                        className="p-1.5 rounded-lg hover:bg-cream-100 text-text-muted hover:text-indigo-600 transition-colors" title="View">
                        <Eye size={14} />
                      </Link>
                      <button onClick={() => openEdit(event)}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-text-muted hover:text-indigo-600 transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => confirmDelete(event._id, event.title)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && events.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-text-muted text-sm">No events found. Create your first event!</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-text-muted">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40">← Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <EventModal event={modalEvent} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
