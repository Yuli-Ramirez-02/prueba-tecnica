import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 60000, // DeepSeek puede tardar hasta 30s + margen
})

export default api
