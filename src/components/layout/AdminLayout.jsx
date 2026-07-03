import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, FileText, Users, Image, UserCheck,
  Building2, CreditCard, MessageSquare, Trophy, LogOut, Menu, X,
  ChevronRight, Bell, Settings, Search, ExternalLink,
} from 'lucide-react';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

const ADMIN_NAV = [
  { label: 'Dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Events',       href: '/admin/events',       icon: Calendar },
  { label: 'Blogs',        href: '/admin/blogs',        icon: FileText },
  { label: 'Users',        href: '/admin/users',        icon: Users },
  { label: 'Gallery',      href: '/admin/gallery',      icon: Image },
  { label: 'Team',         href: '/admin/team',         icon: UserCheck },
  { label: 'Sponsors',     href: '/admin/sponsors',     icon: Building2 },
  { label: 'Payments',     href: '/admin/payments',     icon: CreditCard },
  { label: 'Contacts',     href: '/admin/contacts',     icon: MessageSquare },
  { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-lavender-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        {sidebarOpen && (
          <div>
            <span className="font-bold text-base text-text-primary">Nachiketa</span>
            <p className="text-2xs text-text-muted">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 shadow-soft-xs'
                  : 'text-text-secondary hover:bg-cream-50 hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-indigo-500' : 'text-text-muted group-hover:text-text-secondary'}`} />
                {sidebarOpen && <span className="truncate">{label}</span>}
                {sidebarOpen && isActive && <ChevronRight size={12} className="ml-auto text-indigo-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border space-y-0.5">
        <Link to="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-cream-50 hover:text-text-primary transition-colors">
          <ExternalLink size={16} className="text-text-muted flex-shrink-0" />
          {sidebarOpen && 'View Site'}
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors">
          <LogOut size={16} className="flex-shrink-0" />
          {sidebarOpen && 'Sign out'}
        </button>
      </div>

      {/* User info */}
      {sidebarOpen && (
        <div className="p-3 pt-0">
          <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl border border-border">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-lavender-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">{user?.name}</p>
              <p className="text-2xs text-text-muted truncate capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col flex-shrink-0 bg-surface border-r border-border transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-16'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSidebarOpen(o => !o); setMobileSidebarOpen(o => !o); }}
              className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors">
              <Menu size={18} className="text-text-secondary" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cream-50 border border-border rounded-lg text-sm text-text-muted w-56">
              <Search size={14} />
              <span className="text-xs">Search anything...</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-cream-100 transition-colors">
              <Bell size={17} className="text-text-secondary" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
