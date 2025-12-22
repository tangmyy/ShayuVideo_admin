import service from "@/utils/service.js";

/**
 * 管理端：评论列表
 * 后端接口：/admin/comment/list
 *
 * @param {Object} params - 查询参数
 * @param {String} [params.vlogId] - 视频ID（可选，如果为空则不按视频筛选）
 * @param {String} [params.userId] - 评论者ID（可选，如果为空则不按用户筛选）
 * @param {Number} [params.page] - 页码（默认 1）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回评论列表分页数据（CommentAdminVO 数组）
 */
export const getCommentAdminList = (params = {}) => {
	return service({
		method: "GET",
		url: "/admin/comment/list",
		params: {
			vlogId: params.vlogId || undefined, // 可选参数，为空时不传
			userId: params.userId || undefined, // 可选参数，为空时不传
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};

/**
 * 管理端：修改评论信息
 * 后端接口：/admin/comment/update（预留）
 *
 * @param {Object} updatedCommentBO - 评论信息对象
 * @param {String} updatedCommentBO.commentId - 评论ID（必需）
 * @param {String} updatedCommentBO.content - 评论内容（可选）
 * @param {String} updatedCommentBO.fatherCommentId - 父评论ID（可选）
 * @param {Number} updatedCommentBO.isLike - 是否点赞：1-已点赞，0-未点赞（可选）
 * @returns {Promise} 返回修改后的评论信息
 */
export const updateCommentInfo = (updatedCommentBO) => {
	return service({
		method: "POST",
		url: "/admin/comment/update",
		data: updatedCommentBO
	});
};

/**
 * 管理端：删除/恢复评论（切换逻辑删除状态）
 * 后端接口：/admin/comment/deleteOrRestore
 *
 * @param {String} commentId - 评论ID（必填）
 * @returns {Promise} 返回更新后的评论信息
 */
export const deleteOrRestoreComment = (commentId) => {
	return service({
		method: "POST",
		url: "/admin/comment/deleteOrRestore",
		params: {
			commentId: commentId
		}
	});
};


