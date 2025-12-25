import service from "@/utils/service.js";

/**
 * 管理端：视频列表
 * 后端接口：/admin/vlog/list
 *
 * @param {Object} params - 查询参数
 * @param {String} params.search - 搜索关键字（可选）
 * @param {Number} params.page - 页码（默认 1）
 * @param {Number} params.pageSize - 每页数量（默认 10）
 * @returns {Promise} 返回视频列表分页数据
 */
export const getVlogAdminList = (params = {}) => {
	return service({
		method: "GET",
		url: "/admin/vlog/list",
		params: {
			search: params.search || undefined,
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};

/**
 * 管理端：修改视频信息
 * 后端接口：/admin/vlog/update
 * 后端方法：updateVlog(VlogBO vlogBO)
 *
 * @param {Object} vlogBO - 视频信息对象（对应后端 VlogBO）
 * @param {String} vlogBO.id - 视频ID（必需，后端会检查是否为空）
 * @param {String} vlogBO.title - 标题/文案（可选，注意：前端使用 content，提交时需要转换为 title）
 * @param {String} vlogBO.cover - 封面URL（可选）
 * @param {String} vlogBO.url - 播放地址（可选）
 * @param {Number} vlogBO.width - 宽度（可选）
 * @param {Number} vlogBO.height - 高度（可选）
 * @param {Number} vlogBO.isPrivate - 权限：1-私密，0-公开（可选）
 * @returns {Promise} 返回修改结果
 * @note 后端会自动排除 createdTime、likeCounts、commentsCounts 等字段，并自动更新 updatedTime
 */
export const updateVlogInfo = (vlogBO) => {
	return service({
		method: "POST",
		url: "/admin/vlog/updateInfo",
		data: vlogBO
	});
};

/**
 * 管理端：删除/恢复视频（切换逻辑删除状态）
 * 后端接口：/admin/vlog/deleteOrRestore
 *
 * @param {String} vlogId - 视频ID（必填）
 * @returns {Promise} 返回更新后的视频信息
 */
export const deleteOrRestoreVlog = (vlogId) => {
	return service({
		method: "POST",
		url: "/admin/vlog/deleteOrRestore",
		params: {
			vlogId: vlogId
		}
	});
};

/**
 * 管理端：设置推荐视频流排序规则
 * 后端接口：/admin/vlog/setSortType
 *
 * @param {Number} sortType - 排序类型：0-创建时间，1-点赞数，2-评论数
 * @returns {Promise} 返回排序类型信息
 */
export const setVlogSortType = (sortType) => {
	return service({
		method: "POST",
		url: "/admin/vlog/setSortType",
		params: {
			sortType: sortType
		}
	});
};

/**
 * 管理端：获取推荐视频流排序规则
 * 后端接口：/admin/vlog/getSortType
 *
 * @returns {Promise} 返回当前排序类型信息
 */
export const getVlogSortType = () => {
	return service({
		method: "GET",
		url: "/admin/vlog/getSortType"
	});
};