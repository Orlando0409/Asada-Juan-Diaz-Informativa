
import axios from "axios";

const apiAuth = axios.create({
  //URL API PRODUCCION =https://saga-jd-back-end-1.onrender.com/api
  //URL API RAILWAY = https://saga-jd-back-end-production.up.railway.app/api
  //URL API LOCAL = http://localhost:3000/api

  baseURL: "https://saga-jd-back-end-production.up.railway.app/api", 
});

export default apiAuth;
