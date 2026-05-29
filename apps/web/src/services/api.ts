import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;

// Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Hotels
export const hotelsApi = {
  getFeatured: () => api.get('/hotels/featured'),
  getAll: (params?: any) => api.get('/hotels', { params }),
  getOne: (id: string) => api.get(`/hotels/${id}`),
  create: (data: any) => api.post('/hotels', data),
  update: (id: string, data: any) => api.put(`/hotels/${id}`, data),
  delete: (id: string) => api.delete(`/hotels/${id}`),
  getMyHotels: () => api.get('/hotels/owner/my'),
  upsertPolicy: (id: string, data: any) => api.put(`/hotels/${id}/policy`, data),
};

// Rooms
export const roomsApi = {
  getByHotel: (hotelId: string) => api.get(`/rooms/hotel/${hotelId}`),
  getOne: (id: string) => api.get(`/rooms/${id}`),
  checkAvailability: (id: string, checkIn: string, checkOut: string) =>
    api.get(`/rooms/${id}/availability`, { params: { checkIn, checkOut } }),
  create: (data: any) => api.post('/rooms', data),
  update: (id: string, data: any) => api.put(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
  updateInventory: (id: string, data: any) => api.put(`/rooms/${id}/inventory`, data),
};

// Search
export const searchApi = {
  search: (params: any) => api.get('/search', { params }),
  suggestions: (q: string) => api.get('/search/suggestions', { params: { q } }),
};

// Bookings
export const bookingsApi = {
  create: (data: any) => api.post('/bookings', data),
  getOne: (id: string) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/me'),
  cancel: (id: string) => api.put(`/bookings/${id}/cancel`),
  getHotelBookings: (hotelId: string) => api.get(`/bookings/hotel/${hotelId}`),
};

// Payments
export const paymentsApi = {
  initialize: (bookingId: string) => api.post(`/payments/initialize/${bookingId}`),
  refund: (bookingId: string) => api.post(`/payments/refund/${bookingId}`),
};

// Reviews
export const reviewsApi = {
  getByHotel: (hotelId: string) => api.get(`/reviews/hotel/${hotelId}`),
  create: (data: any) => api.post('/reviews', data),
  getMyReviews: () => api.get('/reviews/me'),
};

// Users
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (hotelId: string) => api.post(`/users/wishlist/${hotelId}`),
  removeFromWishlist: (hotelId: string) => api.delete(`/users/wishlist/${hotelId}`),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationsRead: () => api.put('/users/notifications/read'),
};

// Admin
export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  setUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  getPendingHotels: () => api.get('/admin/hotels/pending'),
  approveHotel: (id: string) => api.put(`/admin/hotels/${id}/approve`),
  rejectHotel: (id: string) => api.put(`/admin/hotels/${id}/reject`),
  getBookings: (params?: any) => api.get('/admin/bookings', { params }),
  getRevenueReport: () => api.get('/admin/reports/revenue'),
};
