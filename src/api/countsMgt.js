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

/**
 * 管理端：获取所有视频数量
 * 后端接口：/admin/counts/vlogs
 * 返回所有视频的总数
 *
 * @returns {Promise} 返回视频数量（Integer）
 */
export const getVlogCounts = () => {
	return service({
		method: "GET",
		url: "/admin/counts/vlogs"
	});
};

/**
 * 管理端：获取所有用户数量
 * 后端接口：/admin/counts/users
 * 返回所有用户的总数
 *
 * @returns {Promise} 返回用户数量（Integer）
 */
export const getUserCounts = () => {
	return service({
		method: "GET",
		url: "/admin/counts/users"
	});
};

/**
 * 管理端：统计所有举报数量（已废弃，请使用 getVlogReportCounts 和 getCommentReportCounts）
 * 后端接口：/admin/counts/report
 * 返回所有举报的总数
 *
 * @returns {Promise} 返回举报数量（Integer）
 */
export const getReportCounts = () => {
	return service({
		method: "GET",
		url: "/admin/counts/report"
	});
};

/**
 * 管理端：统计所有视频举报数量
 * 后端接口：/admin/counts/report/vlog
 * 返回所有视频举报的总数
 *
 * @returns {Promise} 返回视频举报数量（Integer）
 */
export const getVlogReportCounts = () => {
	return service({
		method: "GET",
		url: "/admin/counts/report/vlog"
	});
};

/**
 * 管理端：统计所有评论举报数量
 * 后端接口：/admin/counts/report/comment
 * 返回所有评论举报的总数
 *
 * @returns {Promise} 返回评论举报数量（Integer）
 */
export const getCommentReportCounts = () => {
	return service({
		method: "GET",
		url: "/admin/counts/report/comment"
	});
};

