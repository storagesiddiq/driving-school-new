import axios from 'axios'

axios.defaults.withCredentials = true;
const backend_url = import.meta.env.VITE_BACKEND_URL;

export default axios.create(
   {baseURL: backend_url}
)