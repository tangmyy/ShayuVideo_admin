import service from "@/utils/service.js";

/**
 * 查询用户列表（支持分页和搜索）
 * 后端接口：/admin/users/list
 * @param {Object} params - 查询参数
 * @param {String} params.name - 搜索名称（昵称或手机号，可选）
 * @param {String} params.date - 注册日期（格式：YYYY-MM-DD，可选）
 * @param {Number} params.page - 页码（默认1）
 * @param {Number} params.pageSize - 每页数量（默认10）
 * @returns {Promise} 返回用户列表数据
 */
export const getUserList = (params) => {
	return service({
		method: "GET",
		url: "/admin/users/list", // 新的统一管理接口路径
		params: {
			name: params.name || undefined,
			date: params.date || undefined,
			page: params.page || 1,
			pageSize: params.pageSize || 10
		}
	});
};

/**
 * 管理端：修改用户信息
 * 后端接口：/admin/users/updateInfo
 * UserInfoModifyType 枚举：
 * - NICKNAME(1, "昵称")
 * - VIDEONUM(2, "视频号")
 * - SEX(3, "性别")
 * - BIRTHDAY(4, "生日")
 * - LOCATION(5, "所在地")
 * - DESC(6, "简介")
 * @param {Object} updatedUserBO - 用户信息对象
 * @param {String} updatedUserBO.id - 用户ID（必需）
 * @param {String} updatedUserBO.nickname - 昵称（可选，type=1）
 * @param {String} updatedUserBO.videoNum - 视频号（可选，type=2）
 * @param {Number} updatedUserBO.sex - 性别：0-女，1-男，2-未知（可选，type=3）
 * @param {String} updatedUserBO.birthday - 生日（可选，type=4）
 * @param {String} updatedUserBO.country - 国家（可选，type=5）
 * @param {String} updatedUserBO.province - 省份（可选，type=5）
 * @param {String} updatedUserBO.city - 城市（可选，type=5）
 * @param {String} updatedUserBO.district - 区县（可选，type=5）
 * @param {String} updatedUserBO.description - 个人简介（可选，type=6）
 * @param {Number} type - 修改类型（必需）：1-昵称，2-视频号，3-性别，4-生日，5-所在地，6-简介
 * @returns {Promise} 返回修改后的用户信息
 */
export const updateUserInfo = (updatedUserBO, type) => {
	return service({
		method: "POST",
		url: "/admin/users/updateInfo",
		data: updatedUserBO,
		params: {
			type: type
		}
	});
};

/**
 * 管理端：修改用户头像或背景图
 * 后端接口：/admin/users/modifyImage
 * FileTypeEnum 枚举：
 * - BGIMG(1, "用户背景图")
 * - FACE(2, "用户头像")
 * @param {String} userId - 用户ID（必需）
 * @param {Number} type - 文件类型（必需）：1-背景图，2-头像
 * @param {File} file - 图片文件（必需）
 * @returns {Promise} 返回修改后的用户信息
 */
export const modifyUserImage = (userId, type, file) => {
	const formData = new FormData();
	formData.append("file", file);
	return service({
		method: "POST",
		url: "/admin/users/modifyImage",
		data: formData,
		params: {
			userId: userId,
			type: type
		},
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
};

/**
 * 管理端：删除用户（逻辑删除）
 * 后端接口：/admin/users/delete
 * @param {String} userId - 用户ID（必需）
 * @returns {Promise} 返回删除结果
 */
export const deleteUser = (userId) => {
	return service({
		method: "POST",
		url: "/admin/users/delete",
		params: {
			userId: userId
		}
	});
};

