import service from "@/utils/service.js";

/**
 * 管理端：视频列表
 * 后端接口：/vlog/admin/list
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
		url: "/vlog/admin/list", // 通过 Vite 代理转发到后端
		params: {
			search: params.search || undefined,
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};