import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

// Attach JWT token to every request
api.interceptors.request.use(function(config) {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// Handle 401 — logout user if token expired
api.interceptors.response.use(
  function(response) { return response },
  function(error) {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
}

export const userApi = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
}

export default api