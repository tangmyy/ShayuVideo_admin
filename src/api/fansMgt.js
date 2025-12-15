import service from "@/utils/service.js";

/**
 * 管理端：粉丝列表
 * 后端接口：/fans/admin/list
 *
 * @param {Object} params - 查询参数
 * @param {String} params.myId - 用户id（查看该用户的粉丝列表，必填）
 * @param {Number} [params.page] - 页码（默认 1）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回粉丝列表分页数据
 */
export const getFansAdminList = (params = {}) => {
	return service({
		method: "GET",
		url: "/fans/admin/list", // 通过 Vite 代理转发到后端
		params: {
			myId: params.myId,              // 必填：用户 id
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};


