import service from "@/utils/service.js";

/**
 * 管理端：消息列表
 * 后端接口：/msg/admin/list
 *
 * @param {Object} params - 查询参数
 * @param {String} params.userId - 接收消息的用户id（必填）
 * @param {Number} [params.page] - 页码（前端从 1 开始，后端从 0 开始）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回消息列表数据（数组）
 */
export const getMsgAdminList = (params = {}) => {
	const page = params.page ?? 1;
	return service({
		method: "GET",
		url: "/msg/admin/list", // 通过 Vite 代理转发到后端
		params: {
			userId: params.userId, // 必填：接收消息的用户 id
			// 前端第 1 页 -> 后端第 0 页
			page: page - 1,
			pageSize: params.pageSize || 10
		}
	});
};


