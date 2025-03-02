import axios from "axios";


 const axiosInstance = axios.create({
     baseURL: `${process.env.NEXT_PUBLIC_CLIENT_URI}/api`,
    timeout: 15000,
    headers:{
        "Content-Type": 'application/json'
    }
})

export default axiosInstance