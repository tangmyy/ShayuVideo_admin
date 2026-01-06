import service from "@/utils/service.js";

/**
 * 获取活跃用户排行榜
 * @param {Object} params - 查询参数
 * @param {Number} params.limit - 返回数量限制，默认10
 * @param {String} params.sortBy - 排序方式：'videos'（按视频数）或 'fans'（按粉丝数），默认'videos'
 * @returns {Promise} 返回活跃用户列表
 */
export const getActiveUsers = (params) => {
	return service({
		method: "GET",
		url: "/admin/home/activeUsers",
		params: {
			limit: params?.limit || undefined,
			sortBy: params?.sortBy || undefined
		}
	});
};

/**
 * 获取每月视频发布总数
 * @param {Number} year - 年份，默认为当前年份
 * @returns {Promise} 返回每月视频发布数量数组，按月份顺序（1-12月）
 */
export const getMonthlyVideos = (year) => {
	return service({
		method: "GET",
		url: "/admin/home/monthlyVideos",
		params: {
			year: year || undefined
		}
	});
};

