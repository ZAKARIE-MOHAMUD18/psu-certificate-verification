import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://psu-certificate-verification-1.onrender.com'
})

console.log('API URL:', import.meta.env.VITE_API_URL || 'https://psu-certificate-verification-1.onrender.com')

export default api