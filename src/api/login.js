import service from "@/utils/service.js";

export const routerList = () => {
	return service({
		method: "GET",
		url: "/api/router/list"
	});
};

/**
 * 管理员登录
 * @param {Object} loginData - 登录信息
 * @param {String} loginData.username - 用户名
 * @param {String} loginData.password - 密码
 * @returns {Promise} 返回管理员信息（包含token）
 */
export const adminLogin = (loginData) => {
	return service({
		method: "POST",
		url: "/admin/login",
		data: {
			username: loginData.username,
			password: loginData.password
		}
	});
};

/**
 * 管理员登出
 * @param {Number} adminId - 管理员ID
 * @returns {Promise} 返回操作结果
 */
export const adminLogout = (adminId) => {
	return service({
		method: "POST",
		url: "/admin/logout",
		params: {
			adminId: adminId
		}
	});
};

export const pageLogin = () => {
	return service({
		method: "GET",
		url: "/api/login"
	});
};

export const getAuthButton = () => {
	return service({
		method: "GET",
		url: "/api/auth/button"
	});
};
