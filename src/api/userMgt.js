import service from "@/utils/service.js";

/**
 * 查询用户列表（支持分页和搜索）
 * @param {Object} params - 查询参数
 * @param {String} params.name - 搜索名称（昵称或手机号，可选）
 * @param {String} params.date - 注册日期（格式：YYYY-MM-DD，可选）
 * @param {Number} params.page - 页码（默认1）
 * @param {Number} params.pageSize - 每页数量（默认10）
 * @returns {Promise} 返回用户列表数据
 */
export const getUserList = (params) => {
	return service({
		method: "GET",
		url: "/userInfo/list", // 使用代理路径，避免跨域问题
		params: {
			name: params.name || undefined,
			date: params.date || undefined,
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};

