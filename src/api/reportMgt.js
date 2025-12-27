import service from "@/utils/service.js";

/**
 * 管理端：举报列表
 * 后端接口：/admin/report/list
 *
 * @param {Object} params - 查询参数
 * @param {Number} [params.reportType] - 举报类型（可选，1-视频，2-评论）
 * @param {Number} [params.status] - 处理状态（可选，0-待处理，1-已处理，2-已驳回）
 * @param {String} [params.targetId] - 被举报对象ID（可选）
 * @param {Number} [params.page] - 页码（默认 1）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回举报列表分页数据（ReportAdminVO 数组）
 */
export const getReportList = (params = {}) => {
	return service({
		method: "GET",
		url: "/admin/report/list",
		params: {
			reportType: params.reportType || undefined, // 可选参数，为空时不传
			status: params.status !== undefined && params.status !== null ? params.status : undefined, // 可选参数，为空时不传
			targetId: params.targetId || undefined, // 可选参数，为空时不传
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};

/**
 * 管理端：处理举报
 * 后端接口：/admin/report/handle
 *
 * @param {Object} handleData - 处理数据
 * @param {String} handleData.reportId - 举报ID（必需）
 * @param {String} handleData.handlerId - 处理人ID（必需）
 * @param {Number} handleData.status - 处理状态（必需，1-已处理，2-已驳回）
 * @param {String} [handleData.handleResult] - 处理结果说明（可选）
 * @param {Boolean} [handleData.notifyReporter] - 是否通知举报人（可选，默认false）
 * @returns {Promise} 返回处理后的举报信息
 */
export const handleReport = (handleData) => {
	return service({
		method: "POST",
		url: "/admin/report/handle",
		params: {
			reportId: handleData.reportId,
			handlerId: handleData.handlerId,
			status: handleData.status,
			handleResult: handleData.handleResult || undefined,
			notifyReporter: handleData.notifyReporter !== undefined ? handleData.notifyReporter : false
		}
	});
};

/**
 * 管理端：修改已处理的举报记录
 * 后端接口：/admin/report/update
 *
 * @param {Object} updateData - 更新数据
 * @param {String} updateData.reportId - 举报ID（必需）
 * @param {String} updateData.handlerId - 处理人ID（必需）
 * @param {Number} updateData.status - 处理状态（必需，1-已处理，2-已驳回）
 * @param {String} [updateData.handleResult] - 处理结果说明（可选）
 * @returns {Promise} 返回更新后的举报信息
 */
export const updateReport = (updateData) => {
	return service({
		method: "PUT",
		url: "/admin/report/update",
		params: {
			reportId: updateData.reportId,
			handlerId: updateData.handlerId,
			status: updateData.status,
			handleResult: updateData.handleResult || undefined
		}
	});
};

/**
 * 管理端：统计指定对象的举报次数
 * 后端接口：/admin/report/count
 *
 * @param {Number} reportType - 举报类型（必需，1-视频，2-评论）
 * @param {String} targetId - 被举报对象ID（必需）
 * @returns {Promise} 返回举报次数
 */
export const countReports = (reportType, targetId) => {
	return service({
		method: "GET",
		url: "/admin/report/count",
		params: {
			reportType: reportType,
			targetId: targetId
		}
	});
};

