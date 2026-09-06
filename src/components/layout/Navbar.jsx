import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Shield, Sparkles } from 'lucide-react';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';
import Logo from '@/components/ui/Logo';

const NAV_LINKS = [
  { label: 'About',        href: '/about' },
  { label: 'Programs',     href: '/events' },
  { label: 'Team',         href: '/team' },
  { label: 'Gallery',      href: '/gallery' },
  { label: 'Blog',         href: '/blogs' },
  {
    label: 'More',
    children: [
      { label: 'Milestones',   href: '/achievements' },
      { label: 'Sponsors',     href: '/sponsors' },
      { label: 'FAQ',          href: '/faq' },
      { label: 'Contact',      href: '/contact' },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const dropRef   = useRef(null);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(null); }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || !isHome
            ? 'bg-white/90 backdrop-blur-md shadow-soft-xs border-b border-border/80 py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14">

            {/* ─── Logo ─────────────────────────────────────────────────────── */}
            <Logo to="/" size="md" className="group" imgClassName="shadow-soft-xs group-hover:scale-105 transition-all duration-300" />

            {/* ─── Desktop Nav ──────────────────────────────────────────────── */}
            <div ref={dropRef} className="hidden md:flex items-center gap-1.5 bg-surface-2/60 border border-border/60 rounded-full px-4 py-1.5 backdrop-blur-sm">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative">
                    <button
                      onClick={() => setDropdownOpen(d => d === link.label ? null : link.label)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-white/80 transition-all duration-200"
                    >
                      {link.label}
                      <ChevronDown size={13} className={`transition-transform duration-200 text-text-muted ${dropdownOpen === link.label ? 'rotate-180 text-indigo-600' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-soft-lg border border-border/80 py-2 z-50"
                        >
                          {link.children.map(child => (
                            <NavLink
                              key={child.href}
                              to={child.href}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-xs font-medium transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50/80 font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-cream-50'}`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-indigo-600 bg-white shadow-soft-xs font-semibold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/80'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </div>

            {/* ─── Right actions ─────────────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/membership" className="btn-secondary text-xs px-4 py-2 font-medium rounded-full hover:border-indigo-200 transition-all">
                Membership
              </Link>

              {isAuthenticated ? (
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setUserMenuOpen(u => !u)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream-50 border border-border hover:border-indigo-200 transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-lavender-500 flex items-center justify-center text-white text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-text-primary max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown size={12} className={`text-text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-soft-lg border border-border py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-border/80 mb-1">
                          <p className="text-xs font-bold text-text-primary truncate">{user?.name}</p>
                          <p className="text-2xs text-text-muted truncate">{user?.email}</p>
                        </div>
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-cream-50 transition-colors">
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                        {isAdmin() && (
                          <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                          <LogOut size={14} /> Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-xs px-5 py-2 font-medium rounded-full shadow-soft-xs hover:shadow-soft transition-all">
                  Sign in
                </Link>
              )}
            </div>

            {/* ─── Mobile menu toggle ───────────────────────────────────────── */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-xl bg-cream-50 border border-border hover:bg-cream-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ─── Mobile Menu ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-white/98 backdrop-blur-xl border-t border-border mt-2 shadow-soft-lg"
            >
              <div className="px-5 py-5 space-y-2">
                {NAV_LINKS.map(link =>
                  link.children ? (
                    <div key={link.label} className="py-1">
                      <p className="text-2xs font-bold text-text-muted uppercase tracking-widest px-3 py-1.5">{link.label}</p>
                      {link.children.map(child => (
                        <NavLink key={child.href} to={child.href}
                          className={({ isActive }) => `block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-cream-50'}`}
                        >{child.label}</NavLink>
                      ))}
                    </div>
                  ) : (
                    <NavLink key={link.href} to={link.href}
                      className={({ isActive }) => `block px-3 py-2 rounded-xl text-xs font-medium transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50 font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-cream-50'}`}
                    >{link.label}</NavLink>
                  )
                )}
                <div className="pt-4 border-t border-border flex flex-col gap-2.5">
                  <Link to="/membership" className="btn-secondary w-full justify-center text-xs py-2.5">Membership</Link>
                  {isAuthenticated ? (
                    <>
                      <Link to="/dashboard" className="btn-secondary w-full justify-center text-xs py-2.5">Dashboard</Link>
                      {isAdmin() && <Link to="/admin" className="btn-primary w-full justify-center text-xs py-2.5">Admin Panel</Link>}
                      <button onClick={handleLogout} className="btn-ghost w-full text-rose-600 text-xs py-2">Sign out</button>
                    </>
                  ) : (
                    <Link to="/login" className="btn-primary w-full justify-center text-xs py-2.5">Sign in</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Dynamic top spacer for subpages to avoid content clipping */}
      {!isHome && <div className="h-20" />}
    </>
  );
}
