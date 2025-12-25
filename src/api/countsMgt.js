import service from "@/utils/service.js";

/**
 * 管理端：获取所有视频评论总量
 * 后端接口：/admin/counts/comment
 * 返回所有视频评论的总数（从Redis中累加所有视频的评论数）
 *
 * @returns {Promise} 返回评论数量（Integer）
 */
export const getCommentCounts = () => {
	return service({
		method: "GET",
		url: "/admin/counts/comment"
	});
};

/**
 * 管理端：获取所有视频点赞总量
 * 后端接口：/admin/counts/likes
 * 返回所有视频点赞的总数（从Redis中累加所有视频的点赞数）
 *
 * @returns {Promise} 返回点赞数量（Integer）
 */
export const getLikeCounts = () => {
	return service({
		method: "GET",
		url: "/admin/counts/likes"
	});
};

