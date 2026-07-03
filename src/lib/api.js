import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Token is set via authStore, but pick it up here as fallback
    const stored = localStorage.getItem('nachiketa-auth');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        if (state?.token && !config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${state.token}`;
        }
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (error.response?.status === 401) {
      // Clear auth state on 401
      localStorage.removeItem('nachiketa-auth');
      delete api.defaults.headers.common['Authorization'];
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject({ ...error, message });
  }
);

export default api;

// ─── Typed API helpers ────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll:   (params) => api.get('/events', { params }),
  getOne:   (slug)   => api.get(`/events/${slug}`),
  create:   (data)   => api.post('/events', data),
  update:   (id, d)  => api.put(`/events/${id}`, d),
  delete:   (id)     => api.delete(`/events/${id}`),
  register: (id)     => api.post(`/events/${id}/register`),
  getRegistrations: (id) => api.get(`/events/${id}/registrations`),
  markAttendance: (id, ticketId) => api.patch(`/events/${id}/attendance/${ticketId}`),
};

export const blogsAPI = {
  getAll:  (params) => api.get('/blogs', { params }),
  getOne:  (slug)   => api.get(`/blogs/${slug}`),
  create:  (data)   => api.post('/blogs', data),
  update:  (id, d)  => api.put(`/blogs/${id}`, d),
  delete:  (id)     => api.delete(`/blogs/${id}`),
};

export const teamAPI = {
  getAll:  (params) => api.get('/team', { params }),
  create:  (data)   => api.post('/team', data),
  update:  (id, d)  => api.put(`/team/${id}`, d),
  delete:  (id)     => api.delete(`/team/${id}`),
};

export const galleryAPI = {
  getAll:  (params) => api.get('/gallery', { params }),
  create:  (data)   => api.post('/gallery', data),
  delete:  (id)     => api.delete(`/gallery/${id}`),
};

export const sponsorsAPI = {
  getAll:  ()       => api.get('/sponsors'),
  create:  (data)   => api.post('/sponsors', data),
  update:  (id, d)  => api.put(`/sponsors/${id}`, d),
  delete:  (id)     => api.delete(`/sponsors/${id}`),
};

export const achievementsAPI = {
  getAll:  (params) => api.get('/achievements', { params }),
  create:  (data)   => api.post('/achievements', data),
  update:  (id, d)  => api.put(`/achievements/${id}`, d),
  delete:  (id)     => api.delete(`/achievements/${id}`),
};

export const paymentsAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify:      (data) => api.post('/payments/verify', data),
  history:     ()     => api.get('/payments/history'),
  adminAll:    (p)    => api.get('/payments/admin/all', { params: p }),
};

export const membershipAPI = {
  getPlans:     ()   => api.get('/memberships/plans'),
  myMembership: ()   => api.get('/memberships/my-membership'),
};

export const uploadAPI = {
  uploadImage: (file, folder = 'general') => {
    const fd = new FormData();
    fd.append('image', file);
    fd.append('folder', folder);
    return api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const adminAPI = {
  analytics:     () => api.get('/admin/analytics'),
  revenueChart:  () => api.get('/admin/revenue-chart'),
};

export const contactAPI = {
  send:    (data)  => api.post('/contact', data),
  getAll:  (p)     => api.get('/contact', { params: p }),
  setStatus: (id, s) => api.patch(`/contact/${id}/status`, { status: s }),
};

export const usersAPI = {
  getProfile:  ()       => api.get('/users/profile'),
  updateProfile: (d)    => api.put('/users/profile', d),
  getAll:      (p)      => api.get('/users', { params: p }),
  toggleStatus: (id)    => api.patch(`/users/${id}/toggle-status`),
};
