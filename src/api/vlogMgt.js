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
 * 后端接口：/admin/vlog/update（预留）
 *
 * @param {Object} updatedVlogBO - 视频信息对象
 * @param {String} updatedVlogBO.vlogId - 视频ID（必需）
 * @param {String} updatedVlogBO.content - 标题/文案（可选）
 * @param {String} updatedVlogBO.cover - 封面URL（可选）
 * @param {String} updatedVlogBO.url - 播放地址（可选）
 * @param {Number} updatedVlogBO.width - 宽度（可选）
 * @param {Number} updatedVlogBO.height - 高度（可选）
 * @param {Number} updatedVlogBO.isPrivate - 权限：1-私密，0-公开（可选）
 * @returns {Promise} 返回修改后的视频信息
 */
export const updateVlogInfo = (updatedVlogBO) => {
	return service({
		method: "POST",
		url: "/admin/vlog/update",
		data: updatedVlogBO
	});
};