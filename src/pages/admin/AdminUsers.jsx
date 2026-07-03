import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Users, Shield, UserX, UserCheck, Mail, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { usersAPI } from '@/lib/api';

const ROLE_COLORS = { student:'badge-gray', admin:'badge-indigo', superadmin:'badge-lavender' };

export default function AdminUsers() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, role],
    queryFn: () => usersAPI.getAll({ page, limit: 20, search: search||undefined, role: role||undefined }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => usersAPI.toggleStatus(id),
    onSuccess: (res) => { toast.success(res.data.message); qc.invalidateQueries(['admin-users']); },
    onError: () => toast.error('Failed to update user'),
  });

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / 20) || 1;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Users</h1>
        <p className="text-text-muted text-sm mt-0.5">Manage {total} registered users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"/>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by name or email..." className="input pl-9 text-sm"/>
        </div>
        <select value={role} onChange={e=>{setRole(e.target.value);setPage(1);}} className="input text-sm w-auto cursor-pointer">
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
          <option value="superadmin">Super Admins</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-cream-50/50">
              {['User','Role','College','Member','Status','Joined','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {isLoading ? [...Array(8)].map((_,i)=><tr key={i}><td colSpan={7} className="px-4 py-3"><div className="skeleton h-4 rounded w-full"/></td></tr>)
              : users.map(u=>(
                <tr key={u._id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-lavender-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()||'?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-text-primary text-xs">{u.name}</p>
                        <p className="text-2xs text-text-muted truncate max-w-[150px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={ROLE_COLORS[u.role]||'badge-gray'}>{u.role}</span></td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{u.college ? <span className="flex items-center gap-1"><GraduationCap size={10}/>{u.college.slice(0,20)}{u.college.length>20?'...':''}</span> : '—'}</td>
                  <td className="px-4 py-3">{u.isMember ? <span className="badge-green text-2xs">Member</span> : <span className="badge-gray text-2xs">Free</span>}</td>
                  <td className="px-4 py-3">{u.isActive ? <span className="badge-green text-2xs">Active</span> : <span className="badge-red text-2xs">Inactive</span>}</td>
                  <td className="px-4 py-3 text-xs text-text-muted">{format(new Date(u.createdAt),'MMM d, yy')}</td>
                  <td className="px-4 py-3">
                    <button onClick={()=>toggleMutation.mutate(u._id)} disabled={toggleMutation.isPending}
                      className={"p-1.5 rounded-lg transition-colors " + (u.isActive ? 'hover:bg-rose-50 text-text-muted hover:text-rose-600' : 'hover:bg-sage-50 text-text-muted hover:text-sage-600')}>
                      {u.isActive ? <UserX size={14}/> : <UserCheck size={14}/>}
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && users.length===0 && <tr><td colSpan={7} className="text-center py-12 text-text-muted text-sm">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages>1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-text-muted">Showing {users.length} of {total} users</p>
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
