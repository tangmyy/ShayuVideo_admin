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

/**
 * 管理端：修改用户信息
 * @param {Object} updatedUserBO - 用户信息对象
 * @param {String} updatedUserBO.id - 用户ID（必需）
 * @param {String} updatedUserBO.nickname - 昵称（可选）
 * @param {String} updatedUserBO.mobile - 手机号（可选）
 * @param {String} updatedUserBO.face - 头像URL（可选）
 * @param {Number} updatedUserBO.sex - 性别：0-女，1-男，2-未知（可选）
 * @param {String} updatedUserBO.birthday - 生日（可选）
 * @param {String} updatedUserBO.country - 国家（可选）
 * @param {String} updatedUserBO.province - 省份（可选）
 * @param {String} updatedUserBO.city - 城市（可选）
 * @param {String} updatedUserBO.district - 区县（可选）
 * @param {String} updatedUserBO.description - 个人简介（可选）
 * @param {String} updatedUserBO.bgImg - 背景图URL（可选）
 * @returns {Promise} 返回修改后的用户信息
 */
export const updateUserInfo = (updatedUserBO) => {
	return service({
		method: "POST",
		url: "/userInfo/admin/update",
		data: updatedUserBO
	});
};

