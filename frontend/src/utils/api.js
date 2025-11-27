import axios from 'axios'

const api = axios.create({
  baseURL: 'https://psu-certificate-verification-1.onrender.com/api'
})

// Attach JWT token automatically for protected routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
