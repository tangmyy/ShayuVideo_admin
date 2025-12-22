import service from "@/utils/service.js";

/**
 * 管理端：消息列表
 * 后端接口：/admin/msg/list
 *
 * @param {Object} params - 查询参数
 * @param {String} [params.userId] - 接收消息的用户id（可选，为空则查询所有消息）
 * @param {Number} [params.page] - 页码（前端从 1 开始，后端从 0 开始）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回消息列表数据（数组）
 */
export const getMsgAdminList = (params = {}) => {
	const page = params.page ?? 1;
	return service({
		method: "GET",
		url: "/admin/msg/list",
		params: {
			userId: params.userId || undefined, // 可选参数，为空则查询所有
			// 前端第 1 页 -> 后端第 0 页
			page: page - 1,
			pageSize: params.pageSize || 10
		}
	});
};

/**
 * 管理端：删除消息
 * 后端接口：/admin/msg/delete
 *
 * @param {String} msgId - 消息ID（必填）
 * @returns {Promise} 返回删除结果
 */
export const deleteMsg = (msgId) => {
	return service({
		method: "POST",
		url: "/admin/msg/delete",
		params: {
			msgId: msgId
		}
	});
};


