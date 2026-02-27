
import axios from "axios";

const apiURL = import.meta.env.VITE_API_URL;
const apiAuth = axios.create({
  //URL API PRODUCCION =https://saga-jd-back-end-1.onrender.com/api
  //URL API RAILWAY = https://saga-jd-back-end-production-2cfe.up.railway.app/api
  //URL API LOCAL = http://localhost:3000/api

  baseURL: apiURL, 
});

export default apiAuth;
