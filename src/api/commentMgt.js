import service from "@/utils/service.js";

/**
 * 管理端：评论列表
 * 后端接口：/comment/admin/list
 *
 * @param {Object} params - 查询参数
 * @param {String} params.vlogId - 视频ID（必填）
 * @param {String} [params.userId] - 当前登录用户ID（可选，管理端可不传）
 * @param {Number} [params.page] - 页码（默认 1）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回评论列表分页数据
 */
export const getCommentAdminList = (params = {}) => {
	return service({
		method: "GET",
		url: "/comment/admin/list", // 通过 Vite 代理转发到后端
		params: {
			vlogId: params.vlogId, // 后端必填，前端需要传入
			userId: params.userId || "", // 管理端可传空字符串
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};


