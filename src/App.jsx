import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/layout/AdminLayout';
import PageLoader from '@/components/ui/PageLoader';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import ScrollToTop from '@/components/ui/ScrollToTop';

// ─── Lazy-loaded public pages ─────────────────────────────────────────────────
import HomePage from '@/pages/HomePage';
const AboutPage       = lazy(() => import('@/pages/AboutPage'));
const EventsPage      = lazy(() => import('@/pages/EventsPage'));
const EventDetailPage = lazy(() => import('@/pages/EventDetailPage'));
const TeamPage        = lazy(() => import('@/pages/TeamPage'));
const GalleryPage     = lazy(() => import('@/pages/GalleryPage'));
const AchievementsPage= lazy(() => import('@/pages/AchievementsPage'));
const BlogsPage       = lazy(() => import('@/pages/BlogsPage'));
const BlogDetailPage  = lazy(() => import('@/pages/BlogDetailPage'));
const MembershipPage  = lazy(() => import('@/pages/MembershipPage'));
const ContactPage     = lazy(() => import('@/pages/ContactPage'));
const SponsorsPage    = lazy(() => import('@/pages/SponsorsPage'));
const FAQPage         = lazy(() => import('@/pages/FAQPage'));
const LoginPage       = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage    = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage    = lazy(() => import('@/pages/auth/VerifyEmailPage'));
const DashboardPage      = lazy(() => import('@/pages/DashboardPage'));
const NotFoundPage       = lazy(() => import('@/pages/NotFoundPage'));

// ─── Lazy-loaded admin pages ──────────────────────────────────────────────────
const AdminDashboard   = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminEvents      = lazy(() => import('@/pages/admin/AdminEvents'));
const AdminBlogs       = lazy(() => import('@/pages/admin/AdminBlogs'));
const AdminUsers       = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminGallery     = lazy(() => import('@/pages/admin/AdminGallery'));
const AdminTeam        = lazy(() => import('@/pages/admin/AdminTeam'));
const AdminSponsors    = lazy(() => import('@/pages/admin/AdminSponsors'));
const AdminPayments    = lazy(() => import('@/pages/admin/AdminPayments'));
const AdminContacts    = lazy(() => import('@/pages/admin/AdminContacts'));
const AdminAchievements= lazy(() => import('@/pages/admin/AdminAchievements'));

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ─── Public Routes ─────────────────────────────────────────────── */}
          <Route path="/" element={<Layout />}>
            <Route index            element={<HomePage />} />
            <Route path="about"     element={<AboutPage />} />
            <Route path="events"    element={<EventsPage />} />
            <Route path="events/:slug" element={<EventDetailPage />} />
            <Route path="team"      element={<TeamPage />} />
            <Route path="gallery"   element={<GalleryPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="blogs"     element={<BlogsPage />} />
            <Route path="blogs/:slug" element={<BlogDetailPage />} />
            <Route path="membership" element={<MembershipPage />} />
            <Route path="contact"   element={<ContactPage />} />
            <Route path="sponsors"  element={<SponsorsPage />} />
            <Route path="faq"       element={<FAQPage />} />
            <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          </Route>

          {/* ─── Auth Routes ───────────────────────────────────────────────── */}
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email/:token"   element={<VerifyEmailPage />} />

          {/* ─── Admin Routes ──────────────────────────────────────────────── */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminLayout /></ProtectedRoute>}>
            <Route index                element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"     element={<AdminDashboard />} />
            <Route path="events"        element={<AdminEvents />} />
            <Route path="blogs"         element={<AdminBlogs />} />
            <Route path="users"         element={<AdminUsers />} />
            <Route path="gallery"       element={<AdminGallery />} />
            <Route path="team"          element={<AdminTeam />} />
            <Route path="sponsors"      element={<AdminSponsors />} />
            <Route path="payments"      element={<AdminPayments />} />
            <Route path="contacts"      element={<AdminContacts />} />
            <Route path="achievements"  element={<AdminAchievements />} />
          </Route>

          {/* ─── 404 ───────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}