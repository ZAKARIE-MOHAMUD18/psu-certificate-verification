import axios from 'axios'

const api = axios.create({
  baseURL: 'https://psu-certificate-verification-1.onrender.com'
})

console.log('API URL:', 'https://psu-certificate-verification-1.onrender.com')

export default api
