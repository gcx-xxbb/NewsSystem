import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000'

//配置拦截器
// axios.interceptors.response.use