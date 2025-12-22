import service from "@/utils/service.js";

/**
 * 管理端：消息列表
 * 后端接口：/admin/msg/list
 *
 * @param {Object} params - 查询参数
 * @param {String} [params.userId] - 接收消息的用户id（可选，为空则查询所有消息）
 * @param {Number} [params.page] - 页码（前端从 1 开始，后端也从 1 开始，内部会转换为 MongoDB 的 0 开始）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回分页结果对象 PagedGridResult
 */
export const getMsgAdminList = (params = {}) => {
	const page = params.page ?? 1;
	return service({
		method: "GET",
		url: "/admin/msg/list",
		params: {
			userId: params.userId || undefined, // 可选参数，为空则查询所有
			// 后端接收从 1 开始的页码，内部会转换为 MongoDB 的 0 开始
			page: page,
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


