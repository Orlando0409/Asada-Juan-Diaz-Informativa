
import axios from "axios";

const apiAuth = axios.create({
  baseURL: "http://localhost:3000/api", 

});

export default apiAuth;
