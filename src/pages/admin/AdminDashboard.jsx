import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import {
  Users, Calendar, FileText, CreditCard, TrendingUp,
  MessageSquare, UserCheck, ArrowUpRight, Eye, Zap,
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import { format } from 'date-fns';

function StatCard({ label, value, icon: Icon, color, trend, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card hover:shadow-soft-md transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-sage-600 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-100">
            <ArrowUpRight size={10} /> {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-text-primary mb-0.5">
        {typeof value === 'number' && label.toLowerCase().includes('revenue')
          ? `₹${value.toLocaleString('en-IN')}`
          : value?.toLocaleString() ?? '—'}
      </p>
      <p className="text-sm text-text-muted">{label}</p>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl shadow-soft-md p-3">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-sm font-semibold text-text-primary">
          {p.name === 'revenue' ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn:  () => adminAPI.analytics(),
    refetchInterval: 60000,
  });

  const { data: chartData } = useQuery({
    queryKey: ['admin-revenue-chart'],
    queryFn:  () => adminAPI.revenueChart(),
  });

  const analytics = data?.data?.analytics;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const revenueData = chartData?.data?.data?.map(d => ({
    month: months[d._id.month - 1],
    revenue: d.revenue,
    transactions: d.count,
  })) || [];

  const STATS = [
    { label: 'Total Users',       value: analytics?.totalUsers,    icon: Users,        color: 'bg-indigo-500',  trend: '+12%', delay: 0 },
    { label: 'Total Events',      value: analytics?.totalEvents,   icon: Calendar,     color: 'bg-lavender-500',trend: '+3%',  delay: 0.05 },
    { label: 'Published Blogs',   value: analytics?.totalBlogs,    icon: FileText,     color: 'bg-sage-500',    trend: '+8%',  delay: 0.1 },
    { label: 'Active Members',    value: analytics?.activeMembers, icon: UserCheck,    color: 'bg-rose-500',    trend: '+15%', delay: 0.15 },
    { label: 'Total Revenue',     value: analytics?.totalRevenue,  icon: CreditCard,   color: 'bg-amber-500',   trend: '+22%', delay: 0.2 },
    { label: 'New Contacts',      value: analytics?.newContacts,   icon: MessageSquare,color: 'bg-indigo-400',  trend: null,   delay: 0.25 },
  ];

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-8 w-48 rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted text-sm mt-0.5">Welcome back! Here's what's happening with Nachiketa.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-text-primary">Revenue Overview</h3>
              <p className="text-xs text-text-muted mt-0.5">Monthly payment revenue (last 12 months)</p>
            </div>
            <span className="badge-indigo flex items-center gap-1"><TrendingUp size={10} /> +22% YoY</span>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8a8aa0' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8a8aa0' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `₹${(v/1000).toFixed(0)}k` : `₹${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2}
                  fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-text-muted text-sm">No revenue data yet</div>
          )}
        </motion.div>

        {/* Upcoming events */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Upcoming Events</h3>
            <span className="badge-indigo">{analytics?.upcomingEvents?.length || 0}</span>
          </div>
          <div className="space-y-3">
            {analytics?.upcomingEvents?.length > 0 ? analytics.upcomingEvents.map(event => (
              <div key={event._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <Calendar size={15} className="text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                  <p className="text-xs text-text-muted">{format(new Date(event.date), 'MMM d')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-semibold text-indigo-600">{event.registeredCount}</p>
                  <p className="text-2xs text-text-muted">reg.</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-text-muted text-center py-8">No upcoming events</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent payments */}
      {analytics?.recentPayments?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <h3 className="font-semibold text-text-primary mb-4">Recent Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  {['User','Type','Amount','Status','Date'].map(h => (
                    <th key={h} className="pb-2.5 pr-4 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {analytics.recentPayments.map(pay => (
                  <tr key={pay._id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                          {pay.user?.name?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary text-xs">{pay.user?.name || 'Unknown'}</p>
                          <p className="text-2xs text-text-muted truncate max-w-[120px]">{pay.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 capitalize">
                      <span className={pay.type === 'event' ? 'badge-indigo' : 'badge-lavender'}>{pay.type}</span>
                    </td>
                    <td className="py-2.5 pr-4 font-semibold text-text-primary">₹{pay.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 pr-4">
                      <span className={pay.status === 'paid' ? 'badge-green' : 'badge-gray'}>{pay.status}</span>
                    </td>
                    <td className="py-2.5 text-xs text-text-muted">{format(new Date(pay.createdAt), 'MMM d, h:mm a')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
