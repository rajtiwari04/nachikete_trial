import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, TrendingUp, Search } from 'lucide-react';
import { format } from 'date-fns';
import { paymentsAPI } from '@/lib/api';

const STATUS_COLORS = { paid:'badge-green', created:'badge-amber', failed:'badge-red', refunded:'badge-gray' };

export default function AdminPayments() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', page, status, type],
    queryFn: () => paymentsAPI.adminAll({ page, limit: 20, status: status||undefined, type: type||undefined }),
  });

  const payments = data?.data?.payments || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / 20) || 1;
  const totalRevenue = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Payments</h1>
        <p className="text-text-muted text-sm mt-0.5">Transaction history and revenue tracking</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue', value:"₹"+totalRevenue.toLocaleString('en-IN'), icon:TrendingUp, color:'bg-indigo-500' },
          { label:'Total Transactions', value:total, icon:CreditCard, color:'bg-lavender-500' },
          { label:'Paid', value:payments.filter(p=>p.status==='paid').length, icon:CreditCard, color:'bg-sage-500' },
          { label:'Failed', value:payments.filter(p=>p.status==='failed').length, icon:CreditCard, color:'bg-rose-500' },
        ].map(s=>(
          <div key={s.label} className="card">
            <div className={"w-8 h-8 rounded-lg flex items-center justify-center mb-3 "+s.color}><s.icon size={16} className="text-white"/></div>
            <p className="text-xl font-bold text-text-primary">{s.value}</p>
            <p className="text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1);}} className="input text-sm w-auto cursor-pointer">
          <option value="">All status</option>
          {['created','paid','failed','refunded'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <select value={type} onChange={e=>{setType(e.target.value);setPage(1);}} className="input text-sm w-auto cursor-pointer">
          <option value="">All types</option>
          <option value="event">Event</option>
          <option value="membership">Membership</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-cream-50/50">
              {['User','Type','Amount','Order ID','Status','Date'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {isLoading ? [...Array(8)].map((_,i)=><tr key={i}><td colSpan={6} className="px-4 py-3"><div className="skeleton h-4 rounded"/></td></tr>)
              : payments.map(p=>(
                <tr key={p._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">{p.user?.name?.[0]||'?'}</div>
                      <div className="min-w-0"><p className="text-xs font-medium text-text-primary truncate max-w-[120px]">{p.user?.name}</p><p className="text-2xs text-text-muted truncate max-w-[120px]">{p.user?.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={p.type==='event'?'badge-indigo':'badge-lavender'}>{p.type}</span></td>
                  <td className="px-4 py-3 font-bold text-text-primary">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3"><code className="text-2xs text-text-muted bg-cream-100 px-1 py-0.5 rounded">{p.razorpayOrderId?.slice(-10)}</code></td>
                  <td className="px-4 py-3"><span className={STATUS_COLORS[p.status]||'badge-gray'}>{p.status}</span></td>
                  <td className="px-4 py-3 text-xs text-text-muted">{format(new Date(p.createdAt),'MMM d, h:mm a')}</td>
                </tr>
              ))}
              {!isLoading && payments.length===0 && <tr><td colSpan={6} className="text-center py-12 text-text-muted text-sm">No payments found.</td></tr>}
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
    </div>
  );
}
