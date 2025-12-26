import axios from "axios";
import { GlobalStore } from "@/stores";
// let devUrl = import.meta.env.VITE_BASE_URL;
// let prodUrl = import.meta.env.VITE_GLOB_BASE_URL;
const service = axios.create({
	baseURL: "",
	timeout: 5000
});
service.interceptors.request.use(
	config => {
		// 添加 token 到请求头
		const globalStore = GlobalStore();
		const token = globalStore.token;
		if (token) {
			// 根据后端要求设置 token，通常使用 Authorization 或自定义 header
			config.headers = config.headers || {};
			config.headers["Authorization"] = `Bearer ${token}`;
			// 如果后端使用其他 header 名称，可以这样设置：
			// config.headers["adminToken"] = token;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

service.interceptors.response.use(
	res => {
		return res;
	},
	error => {
		return Promise.reject(error);
	}
);

export default service;
