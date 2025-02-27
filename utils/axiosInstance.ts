import axios from "axios";


 const axiosInstance = axios.create({
    baseURL: `http://localhost:3000/api`,
    timeout: 15000,
    headers:{
        "Content-Type": 'application/json'
    }
})

export default axiosInstance