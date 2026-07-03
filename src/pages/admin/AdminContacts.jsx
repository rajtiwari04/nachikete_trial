import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Search, Mail, Phone, Check } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { contactAPI } from '@/lib/api';

const STATUS_COLORS = { new: 'badge-indigo', read: 'badge-amber', replied: 'badge-green', resolved: 'badge-gray' };

export default function AdminContacts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('new');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-contacts', page, status],
    queryFn: () => contactAPI.getAll({ page, limit: 15, status: status||undefined }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, s }) => contactAPI.setStatus(id, s),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries(['admin-contacts']); },
  });

  const contacts = data?.data?.contacts || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / 15) || 1;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Contact Messages</h1>
        <p className="text-text-muted text-sm mt-0.5">{total} messages</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['','new','read','replied','resolved'].map(s=>(
          <button key={s} onClick={()=>{setStatus(s);setPage(1);}} className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-all " + (status===s?'bg-indigo-500 text-white border-indigo-500':'bg-surface border-border text-text-secondary hover:border-indigo-200')}>
            {s===''?'All':s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {isLoading ? [...Array(5)].map((_,i)=><div key={i} className="p-4 animate-pulse"><div className="skeleton h-4 w-3/4 rounded mb-2"/><div className="skeleton h-3 w-1/2 rounded"/></div>)
            : contacts.length===0 ? <div className="text-center py-12 text-text-muted text-sm">No messages found.</div>
            : contacts.map(c=>(
              <button key={c._id} onClick={()=>setSelected(c)} className={"w-full text-left p-4 hover:bg-cream-50 transition-colors " + (selected?._id===c._id?'bg-indigo-50/50 border-l-2 border-indigo-400':'')}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-text-primary text-sm">{c.name}</p>
                  <span className={STATUS_COLORS[c.status]||'badge-gray text-2xs'}>{c.status}</span>
                </div>
                <p className="text-xs text-text-muted truncate mb-1">{c.subject}</p>
                <p className="text-2xs text-text-muted">{format(new Date(c.createdAt),'MMM d, h:mm a')}</p>
              </button>
            ))}
          </div>
          {totalPages>1 && (
            <div className="flex gap-2 p-3 border-t border-border">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary px-3 py-1.5 text-xs flex-1 disabled:opacity-40">← Prev</button>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn-secondary px-3 py-1.5 text-xs flex-1 disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {selected ? (
            <div className="card h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-text-primary">{selected.subject}</h3>
                  <p className="text-xs text-text-muted mt-0.5">{format(new Date(selected.createdAt),'MMMM d, yyyy — h:mm a')}</p>
                </div>
                <span className={STATUS_COLORS[selected.status]||'badge-gray'}>{selected.status}</span>
              </div>
              <div className="flex items-center gap-4 mb-5 pb-4 border-b border-border">
                <div className="flex items-center gap-2 text-sm text-text-secondary"><div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">{selected.name[0]}</div>{selected.name}</div>
                <a href={"mailto:"+selected.email} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline"><Mail size={12}/>{selected.email}</a>
                {selected.phone && <a href={"tel:"+selected.phone} className="flex items-center gap-1.5 text-xs text-text-muted"><Phone size={12}/>{selected.phone}</a>}
              </div>
              <div className="bg-cream-50 rounded-xl p-4 mb-5">
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['read','replied','resolved'].map(s=>(
                  <button key={s} onClick={()=>{statusMutation.mutate({id:selected._id,s});setSelected({...selected,status:s});}}
                    className={"btn-secondary text-xs gap-1.5 " + (selected.status===s?'bg-indigo-50 border-indigo-200 text-indigo-600':'')}>
                    <Check size={12}/> Mark as {s}
                  </button>
                ))}
                <a href={"mailto:"+selected.email+"?subject=Re: "+selected.subject} className="btn-primary text-xs gap-1.5 ml-auto"><Mail size={12}/> Reply via Email</a>
              </div>
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center py-20 text-center">
              <div><MessageSquare size={36} className="text-indigo-200 mx-auto mb-3"/><p className="text-text-muted text-sm">Select a message to view details</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
