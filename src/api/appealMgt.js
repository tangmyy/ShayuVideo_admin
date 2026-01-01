import service from "@/utils/service.js";

/**
 * 管理端：申诉列表
 * 后端接口：/admin/appeal/list
 *
 * @param {Object} params - 查询参数
 * @param {Number} [params.appealType] - 申诉类型（可选，1-视频，2-评论）
 * @param {Number} [params.status] - 处理状态（可选，0-待处理，1-已处理（通过），2-已驳回）
 * @param {String} [params.targetId] - 被申诉对象ID（可选）
 * @param {String} [params.reportId] - 举报记录ID（可选）
 * @param {Number} [params.page] - 页码（默认 1）
 * @param {Number} [params.pageSize] - 每页数量（默认 10）
 * @returns {Promise} 返回申诉列表分页数据
 */
export const getAppealList = (params = {}) => {
	return service({
		method: "GET",
		url: "/admin/appeal/list",
		params: {
			appealType: params.appealType !== undefined && params.appealType !== null ? params.appealType : undefined,
			status: params.status !== undefined && params.status !== null ? params.status : undefined,
			targetId: params.targetId || undefined,
			reportId: params.reportId || undefined,
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};

/**
 * 管理端：处理申诉
 * 后端接口：/admin/appeal/handle
 *
 * @param {Object} handleData - 处理数据
 * @param {String} handleData.appealId - 申诉ID（必需）
 * @param {String} handleData.handlerId - 处理人ID（必需）
 * @param {Number} handleData.status - 处理状态（必需，1-已处理（通过），2-已驳回）
 * @param {String} [handleData.handleResult] - 处理结果说明（可选）
 * @param {Boolean} [handleData.notifyAppealer] - 是否通知申诉人（可选，默认false）
 * @returns {Promise} 返回处理后的申诉信息
 */
export const handleAppeal = (handleData) => {
	return service({
		method: "POST",
		url: "/admin/appeal/handle",
		params: {
			appealId: handleData.appealId,
			handlerId: handleData.handlerId,
			status: handleData.status,
			handleResult: handleData.handleResult || undefined,
			notifyAppealer: handleData.notifyAppealer !== undefined ? handleData.notifyAppealer : false
		}
	});
};

/**
 * 管理端：修改已处理的申诉记录
 * 后端接口：/admin/appeal/update
 *
 * @param {Object} updateData - 更新数据
 * @param {String} updateData.appealId - 申诉ID（必需）
 * @param {String} updateData.handlerId - 处理人ID（必需）
 * @param {Number} updateData.status - 处理状态（必需，1-已处理（通过），2-已驳回）
 * @param {String} [updateData.handleResult] - 处理结果说明（可选）
 * @returns {Promise} 返回更新后的申诉信息
 */
export const updateAppeal = (updateData) => {
	return service({
		method: "PUT",
		url: "/admin/appeal/update",
		params: {
			appealId: updateData.appealId,
			handlerId: updateData.handlerId,
			status: updateData.status,
			handleResult: updateData.handleResult || undefined
		}
	});
};

/**
 * 管理端：重置申诉的处理记录
 * 后端接口：/admin/appeal/reset
 *
 * @param {String} appealId - 申诉ID（必需）
 * @returns {Promise} 返回重置后的申诉信息
 */
export const resetAppeal = (appealId) => {
	return service({
		method: "PUT",
		url: "/admin/appeal/reset",
		params: {
			appealId: appealId
		}
	});
};

