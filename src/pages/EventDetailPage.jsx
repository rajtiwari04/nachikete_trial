import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft, Share2, CheckCircle,
  Tag, Award, BookOpen, ExternalLink, Zap, Lock, AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import SEO from '@/components/ui/SEO';
import { eventsAPI, paymentsAPI } from '@/lib/api';
import useAuthStore from '@/store/authStore';

const BADGE_MAP = {
  awareness: 'badge-indigo', wellbeing: 'badge-rose', rights: 'badge-lavender',
  'self-discovery': 'badge-amber', cultural: 'badge-green', community: 'badge-indigo',
  workshop: 'badge-indigo', seminar: 'badge-lavender', other: 'badge-gray',
};

function CountdownTimer({ date }) {
  const [timeLeft, setTimeLeft] = useState({});
  useState(() => {
    const calc = () => {
      const diff = new Date(date) - new Date();
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [date]);

  if (timeLeft.expired) return <span className="text-rose-500 font-medium text-sm">Program has started</span>;

  return (
    <div className="flex items-center gap-2">
      {[['days','D'],['hours','H'],['minutes','M'],['seconds','S']].map(([k, s]) => (
        <div key={k} className="flex flex-col items-center bg-cream-50 border border-border rounded-xl px-3 py-2 min-w-[48px]">
          <span className="text-xl font-bold text-indigo-600 tabular-nums leading-none">
            {String(timeLeft[k] ?? 0).padStart(2, '0')}
          </span>
          <span className="text-2xs text-text-muted uppercase tracking-wider mt-0.5">{s}</span>
        </div>
      ))}
    </div>
  );
}

export default function EventDetailPage() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const qc        = useQueryClient();
  const { isAuthenticated, user, isMember } = useAuthStore();
  const [registering, setRegistering] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn:  () => eventsAPI.getOne(slug),
  });

  const event = data?.data?.event;
  const isRegistered = data?.data?.event?.isRegistered;

  // ─── Free registration ────────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: () => eventsAPI.register(event._id),
    onSuccess: (res) => {
      toast.success('Registered successfully! Check your email for details.');
      qc.invalidateQueries(['event', slug]);
    },
    onError: (err) => toast.error(err.message || 'Registration failed'),
  });

  // ─── Razorpay payment flow ────────────────────────────────────────────────
  const handlePaidRegistration = async () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/events/${slug}` } }); return; }
    setRegistering(true);
    try {
      const { data: orderData } = await paymentsAPI.createOrder({ type: 'event', referenceId: event._id });
      const { order, key } = orderData;

      const options = {
        key,
        amount:   order.amount,
        currency: order.currency,
        name:     'Nachiketa Awareness Society',
        description: event.title,
        order_id: order.id,
        prefill: { name: user.name, email: user.email, contact: user.phone },
        theme: { color: '#6366f1' },
        handler: async (response) => {
          try {
            await paymentsAPI.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              type: 'event',
              referenceId: event._id,
            });
            toast.success('Payment successful! You are now registered.');
            qc.invalidateQueries(['event', slug]);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => setRegistering(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { toast.error('Payment failed. Please try again.'); setRegistering(false); });
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Failed to initiate payment');
      setRegistering(false);
    }
  };

  const handleRegister = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/events/${slug}` } }); return; }
    if (event.isPaid) handlePaidRegistration();
    else registerMutation.mutate();
  };

  if (isLoading) return (
    <div className="container-lg section">
      <div className="animate-pulse space-y-6">
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-8 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );

  if (error || !event) return (
    <div className="container-md section text-center py-24">
      <AlertCircle size={40} className="text-rose-300 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-text-primary mb-2">Program not found</h2>
      <p className="text-text-muted mb-6">This session or program may have been removed or doesn't exist.</p>
      <Link to="/events" className="btn-primary">Browse all programs</Link>
    </div>
  );

  const price = isMember() && event.memberPrice ? event.memberPrice : event.price;
  const isUpcoming = event.status === 'upcoming';
  const isSoldOut  = event.isSoldOut;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const eventSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: event.shortDescription || event.description,
      startDate: event.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: event.venue?.name || 'Nachiketa Campus',
        address: event.venue?.address || 'Campus Venue',
      },
      organizer: {
        '@type': 'Organization',
        name: 'Nachiketa Awareness Society',
        url: origin,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin || '/' },
        { '@type': 'ListItem', position: 2, name: 'Events & Programs', item: `${origin}/events` },
        { '@type': 'ListItem', position: 3, name: event.title, item: `${origin}/events/${event.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${event.title} | Nachiketa Awareness Session`}
        description={event.shortDescription || event.description || 'Join this awareness and community program organized by Nachiketa Awareness Society.'}
        image={event.banner || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80'}
        type="event"
        slug={`/events/${event.slug}`}
        schema={eventSchema}
      />

      {/* ─── Breadcrumb nav ─────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-cream-50/50 py-3">
        <div className="container-lg px-4 flex items-center gap-2 text-xs text-text-muted">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-indigo-600 transition-colors">Programs</Link>
          <span>/</span>
          <span className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-none">{event.title}</span>
        </div>
      </div>

      {/* ─── Banner ────────────────────────────────────────────────────────── */}
      {event.banner && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            src={event.banner} alt={`Banner for ${event.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container-lg section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Main content ────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`${BADGE_MAP[event.category] || 'badge-gray'} capitalize`}>{event.category}</span>
                {event.status === 'upcoming' && <span className="badge-green">Upcoming</span>}
                {event.status === 'ongoing'  && <span className="badge-indigo">Live Now</span>}
                {event.status === 'completed'&& <span className="badge-gray">Completed</span>}
                {event.certificateProvided   && <span className="badge-lavender flex items-center gap-1"><Award size={10} /> Participation Certificate</span>}
                {event.isPaid ? (
                  <span className="badge bg-amber-50 text-amber-700 border border-amber-100">₹{price}</span>
                ) : (
                  <span className="badge-green">Free Session</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight leading-tight mb-5">
                {event.title}
              </h1>

              {/* Meta */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-cream-50 rounded-2xl border border-border">
                {[
                  { icon: Calendar, label: 'Date',  value: format(new Date(event.date), 'EEEE, MMM d, yyyy') },
                  { icon: Clock,    label: 'Time',  value: event.time || 'TBA' },
                  { icon: MapPin,   label: 'Venue', value: event.venue?.name || 'TBA' },
                  { icon: Users,    label: 'Attending', value: `${event.registeredCount}${event.maxSeats ? ` / ${event.maxSeats}` : '+'} students` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-soft-xs">
                      <Icon size={14} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-2xs text-text-muted uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-medium text-text-primary">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-bold text-text-primary mb-3">About this program</h2>
              <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </motion.div>

            {/* What you'll learn */}
            {event.whatYouLearn?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-500" /> What you will learn & experience
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.whatYouLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 bg-sage-50 rounded-xl border border-sage-100">
                      <CheckCircle size={14} className="text-sage-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {event.prerequisites?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">Preparation / Things to bring</h2>
                <ul className="space-y-2">
                  {event.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Speakers / Facilitators */}
            {event.speakers?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-4">Speakers & Facilitators</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((speaker, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 card">
                      {speaker.avatar
                        ? <img src={speaker.avatar} alt={speaker.name} className="w-12 h-12 rounded-full object-cover" />
                        : <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold">{speaker.name[0]}</div>
                      }
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{speaker.name}</p>
                        <p className="text-xs text-text-muted">{speaker.designation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─── Sidebar / Registration card ─────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card shadow-soft-md"
              >
                {/* Price */}
                <div className="mb-5">
                  {event.isPaid ? (
                    <div>
                      <p className="text-3xl font-bold text-text-primary">₹{price}</p>
                      {isMember() && event.memberPrice && event.price !== event.memberPrice && (
                        <p className="text-xs text-sage-600 font-medium mt-1 flex items-center gap-1">
                          <Zap size={10} /> Member price applied (was ₹{event.price})
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-sage-600">Free Program</p>
                  )}
                </div>

                {/* Countdown */}
                {isUpcoming && (
                  <div className="mb-5">
                    <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Starts in</p>
                    <CountdownTimer date={event.date} />
                  </div>
                )}

                {/* Seats */}
                {event.maxSeats && (
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-text-muted mb-1.5">
                      <span>{event.maxSeats - event.registeredCount} seats remaining</span>
                      <span>{Math.round((event.registeredCount / event.maxSeats) * 100)}% filled</span>
                    </div>
                    <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-lavender-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (event.registeredCount / event.maxSeats) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Register button */}
                {isRegistered ? (
                  <div className="flex items-center gap-2.5 p-3 bg-sage-50 rounded-xl border border-sage-100 mb-3">
                    <CheckCircle size={18} className="text-sage-500" />
                    <div>
                      <p className="text-sm font-semibold text-sage-700">You're registered!</p>
                      <p className="text-xs text-sage-600">Check your email for confirmation details.</p>
                    </div>
                  </div>
                ) : event.status === 'completed' ? (
                  <div className="flex items-center gap-2 p-3 bg-cream-50 rounded-xl border border-border">
                    <AlertCircle size={16} className="text-text-muted" />
                    <p className="text-sm text-text-muted">This program has concluded.</p>
                  </div>
                ) : isSoldOut ? (
                  <div className="flex items-center gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <AlertCircle size={16} className="text-rose-500" />
                    <p className="text-sm text-rose-600 font-medium">Capacity full</p>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering || registerMutation.isPending}
                    className="btn-primary w-full py-3 text-base shadow-glow-indigo disabled:opacity-60"
                  >
                    {registering || registerMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <>
                        {!isAuthenticated && <Lock size={14} />}
                        {event.isPaid ? `Register for ₹${price}` : 'Register for free'}
                      </>
                    )}
                  </button>
                )}

                {!isAuthenticated && (
                  <p className="text-xs text-text-muted text-center mt-2">
                    <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link> to register
                  </p>
                )}

                {/* Member discount notice */}
                {!isMember() && event.memberPrice && event.memberPrice < event.price && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-700 font-medium">Members get this session at ₹{event.memberPrice}</p>
                    <Link to="/membership" className="text-xs text-indigo-600 hover:underline mt-0.5 block">Get membership →</Link>
                  </div>
                )}

                {/* Share */}
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                  className="btn-ghost w-full mt-3 text-sm gap-2 text-text-muted"
                >
                  <Share2 size={14} /> Share program
                </button>
              </motion.div>

              {/* Venue map link */}
              {event.venue?.mapLink && (
                <a href={event.venue.mapLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-4 card hover:shadow-soft transition-all text-sm text-text-secondary hover:text-indigo-600 group">
                  <MapPin size={16} className="text-indigo-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">{event.venue.name}</p>
                    {event.venue.address && <p className="text-xs text-text-muted truncate">{event.venue.address}</p>}
                  </div>
                  <ExternalLink size={12} className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
