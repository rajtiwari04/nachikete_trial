import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, SlidersHorizontal, ArrowRight, MapPin, Clock, X } from 'lucide-react';
import { eventsAPI } from '@/lib/api';
import { format } from 'date-fns';

const CATEGORIES = ['all','workshop','seminar','hackathon','cultural','sports','technical','social','other'];
const STATUS_OPTS = ['all','upcoming','ongoing','completed'];

const BADGE_MAP = {
  workshop: 'badge-indigo', seminar: 'badge-lavender', hackathon: 'badge-green',
  cultural: 'badge-amber', sports: 'badge-green', technical: 'badge-indigo',
  social: 'badge-lavender', other: 'badge-gray',
};
const STATUS_MAP = {
  upcoming: 'badge-green', ongoing: 'badge-indigo', completed: 'badge-gray', cancelled: 'badge-red',
};

function EventCard({ event }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Link to={`/events/${event.slug}`} className="group block card-hover p-0 overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-lavender-50 overflow-hidden">
          {event.banner
            ? <img src={event.banner} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            : <div className="w-full h-full flex items-center justify-center"><Calendar size={32} className="text-indigo-300" /></div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`${BADGE_MAP[event.category] || 'badge-gray'} capitalize`}>{event.category}</span>
            <span className={`${STATUS_MAP[event.status] || 'badge-gray'} capitalize`}>{event.status}</span>
          </div>
          <div className="absolute top-3 right-3">
            {event.isPaid
              ? <span className="badge bg-white/90 backdrop-blur-sm text-text-primary border border-white">₹{event.price}</span>
              : <span className="badge bg-sage-500/90 backdrop-blur-sm text-white border-0">Free</span>
            }
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-text-primary line-clamp-2 group-hover:text-indigo-600 transition-colors mb-3 text-base leading-snug">
            {event.title}
          </h3>
          {event.shortDescription && (
            <p className="text-xs text-text-muted line-clamp-2 mb-3">{event.shortDescription}</p>
          )}
          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Calendar size={11} className="text-indigo-400 flex-shrink-0" />
              {event.date ? format(new Date(event.date), 'EEEE, MMM d, yyyy') : 'Date TBA'}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Clock size={11} className="text-indigo-400 flex-shrink-0" />
              {event.time || 'Time TBA'}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <MapPin size={11} className="text-indigo-400 flex-shrink-0" />
              {event.venue?.name || 'Venue TBA'}
            </div>
          </div>
          <div className="flex items-center justify-between">
            {event.maxSeats ? (
              <div className="flex flex-col gap-1 flex-1 mr-4">
                <div className="flex justify-between text-xs text-text-muted">
                  <span>{event.registeredCount} / {event.maxSeats}</span>
                  <span>{Math.round((event.registeredCount / event.maxSeats) * 100)}% filled</span>
                </div>
                <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-lavender-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (event.registeredCount / event.maxSeats) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs text-text-muted">{event.registeredCount} registered</span>
            )}
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all flex-shrink-0">
              Details <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus]     = useState('all');
  const [page, setPage]         = useState(1);

  const params = {
    page, limit: 9,
    ...(search   ? { search }   : {}),
    ...(category !== 'all' ? { category } : {}),
    ...(status   !== 'all' ? { status }   : {}),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['events', params],
    queryFn:  () => eventsAPI.getAll(params),
    keepPreviousData: true,
  });

  const events     = data?.data?.events     || [];
  const totalPages = data?.data?.totalPages || 1;
  const total      = data?.data?.total      || 0;

  const clearFilters = () => { setSearch(''); setCategory('all'); setStatus('all'); setPage(1); };
  const hasFilters = search || category !== 'all' || status !== 'all';

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Page header ─────────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-cream-50/50">
        <div className="container-lg section py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="section-label">Discover</p>
            <h1 className="section-title">All Events</h1>
            <p className="section-subtitle">
              From hackathons to cultural events — {total > 0 && <span className="text-indigo-600 font-semibold">{total} events</span>} curated for your growth.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-lg section">
        {/* ─── Filters ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search events..."
              className="input pl-9 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} className="input text-sm w-auto min-w-[130px] cursor-pointer">
              {CATEGORIES.map(c => <option key={c} value={c}>{c === 'all' ? 'All categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input text-sm w-auto min-w-[110px] cursor-pointer">
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s === 'all' ? 'All status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost text-text-muted text-sm gap-1">
                <X size={13} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ─── Category pills ───────────────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                category === c ? 'bg-indigo-500 text-white border-indigo-500 shadow-soft-sm' : 'bg-surface border-border text-text-secondary hover:border-indigo-200 hover:text-indigo-600'
              }`}>
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        {/* ─── Results ──────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map(event => <EventCard key={event._id} event={event} />)}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary disabled:opacity-40 px-4 py-2 text-sm">← Prev</button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? 'bg-indigo-500 text-white shadow-soft-sm' : 'btn-ghost'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary disabled:opacity-40 px-4 py-2 text-sm">Next →</button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-cream-50 rounded-2xl border border-border">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-indigo-300" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No events found</h3>
            <p className="text-text-muted text-sm mb-5">Try adjusting your filters or search query.</p>
            {hasFilters && <button onClick={clearFilters} className="btn-secondary">Clear filters</button>}
          </div>
        )}
      </div>
    </div>
  );
}
