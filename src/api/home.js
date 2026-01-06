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

