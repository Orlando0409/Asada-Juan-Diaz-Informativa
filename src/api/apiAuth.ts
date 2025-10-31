
import axios from "axios";

const apiAuth = axios.create({
  //URL API PRODUCCION =https://saga-jd-back-end-1.onrender.com/api
  //URL API LOCAL = http://localhost:3000/api

  baseURL: "http://localhost:3000/api", 

});

export default apiAuth;
