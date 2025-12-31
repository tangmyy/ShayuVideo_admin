<template>
	<div class="card">
		<el-form :inline="true" :model="params" class="demo-form-inline" style="display: flex; align-items: center; flex-wrap: wrap">
			<el-form-item label="搜索名称">
				<el-input v-model="params.name" placeholder="请输入昵称或手机号" clearable />
			</el-form-item>
			<el-form-item label="注册日期">
				<el-date-picker v-model="params.date" value-format="YYYY-MM-DD" type="date" placeholder="选择注册日期" clearable />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch()">搜索</el-button>
				<el-button type="info" @click="handleReset()">清空</el-button>
			</el-form-item>
			<el-form-item style="margin-left: auto">
				<el-button type="success" @click="handleAddUser">新增用户</el-button>
			</el-form-item>
		</el-form>
		<div class="table-wrapper">
			<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
				<el-table-column prop="id" label="用户ID" width="120" />
				<el-table-column prop="nickname" label="昵称" width="150" />
				<el-table-column prop="mobile" label="手机号" width="130" />
				<el-table-column prop="videoNum" label="视频号" width="130" />
				<el-table-column prop="canVideoNumBeUpdated" label="视频号可修改" width="120">
					<template #default="{ row }">
						<el-tag :type="row.canVideoNumBeUpdated === 1 ? 'success' : 'danger'">
							{{ row.canVideoNumBeUpdated === 1 ? "可修改" : "不可修改" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="face" label="头像" width="100">
					<template #default="{ row }">
						<el-image
							v-if="row.face"
							:src="row.face"
							style="width: 50px; height: 50px"
							fit="cover"
							:preview-src-list="[row.face]"
						/>
						<span v-else>无头像</span>
					</template>
				</el-table-column>
				<el-table-column prop="sex" label="性别" width="80">
					<template #default="{ row }">
						<span>{{ row.sex === 0 ? "女" : row.sex === 1 ? "男" : row.sex === 2 ? "未知" : "未知" }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="birthday" label="生日" width="120">
					<template #default="{ row }">
						<span>{{ row.birthday ? new Date(row.birthday).toLocaleDateString() : "-" }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="country" label="国家" width="100" />
				<el-table-column prop="province" label="省份" width="120" />
				<el-table-column prop="city" label="城市" width="120" />
				<el-table-column prop="district" label="区县" width="100" />
				<el-table-column prop="description" label="个人简介" min-width="200" show-overflow-tooltip />
				<el-table-column prop="bgImg" label="背景图" width="120">
					<template #default="{ row }">
						<el-image
							v-if="row.bgImg"
							:src="row.bgImg"
							style="width: 100px; height: 50px"
							fit="cover"
							:preview-src-list="[row.bgImg]"
						/>
						<span v-else>无背景图</span>
					</template>
				</el-table-column>
				<el-table-column prop="createdTime" label="注册时间" width="180">
					<template #default="{ row }">
						<span>{{ row.createdTime ? new Date(row.createdTime).toLocaleString() : "-" }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="updatedTime" label="更新时间" width="180">
					<template #default="{ row }">
						<span>{{ row.updatedTime ? new Date(row.updatedTime).toLocaleString() : "-" }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="封禁状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.status === 2 ? 'danger' : row.status === 1 ? 'warning' : 'success'">
							{{ row.status === 2 ? "已封禁" : row.status === 1 ? "已禁言" : "正常" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="isDeleted" label="删除状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.isDeleted === 1 ? 'danger' : 'success'">
							{{ row.isDeleted === 1 ? "已删除" : "正常" }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="360" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
						<!-- 正常状态：显示禁言和封禁 -->
						<el-button
							v-if="row.status === 0"
							type="warning"
							size="small"
							:loading="banOrRestoreLoadingMap[row.id]"
							@click="handleSetUserStatus(row, 1)"
						>
							禁言
						</el-button>
						<!-- 禁言状态：显示恢复和封禁 -->
						<el-button
							v-if="row.status === 1"
							type="success"
							size="small"
							:loading="banOrRestoreLoadingMap[row.id]"
							@click="handleSetUserStatus(row, 0)"
						>
							恢复
						</el-button>
						<!-- 封禁状态：显示禁言和恢复 -->
						<el-button
							v-if="row.status === 2"
							type="warning"
							size="small"
							:loading="banOrRestoreLoadingMap[row.id]"
							@click="handleSetUserStatus(row, 1)"
						>
							禁言
						</el-button>
						<!-- 正常或禁言状态：显示封禁按钮 -->
						<el-button
							v-if="row.status === 0 || row.status === 1"
							type="danger"
							size="small"
							:loading="banOrRestoreLoadingMap[row.id]"
							@click="handleSetUserStatus(row, 2)"
						>
							封禁
						</el-button>
						<!-- 封禁状态：封禁按钮变成恢复按钮 -->
						<el-button
							v-if="row.status === 2"
							type="success"
							size="small"
							:loading="banOrRestoreLoadingMap[row.id]"
							@click="handleSetUserStatus(row, 0)"
						>
							恢复
						</el-button>
						<el-button
							v-if="row.isDeleted !== 1"
							type="danger"
							size="small"
							:loading="deleteOrRestoreLoadingMap[row.id]"
							@click="handleDeleteOrRestoreUser(row)"
						>
							删除
						</el-button>
						<el-button
							v-if="row.isDeleted === 1"
							type="success"
							size="small"
							:loading="deleteOrRestoreLoadingMap[row.id]"
							@click="handleDeleteOrRestoreUser(row)"
						>
							恢复
						</el-button>
					</template>
				</el-table-column>
		</el-table>
		</div>
		<!-- 编辑用户对话框 -->
		<el-dialog v-model="dialogVisible" title="编辑用户信息" width="600px" :close-on-click-modal="false">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
				<el-form-item label="用户ID" prop="id">
					<el-input v-model="editForm.id" disabled />
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" placeholder="请输入昵称" clearable />
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile" placeholder="手机号（不支持编辑）" disabled />
				</el-form-item>
				<el-form-item label="视频号" prop="videoNum">
					<el-input
						v-model="editForm.videoNum"
						:placeholder="editForm.canVideoNumBeUpdated === 1 ? '请输入视频号' : '视频号不可修改'"
						:disabled="editForm.canVideoNumBeUpdated !== 1"
						clearable
					/>
					<div v-if="editForm.canVideoNumBeUpdated !== 1" style="font-size: 12px; color: #f56c6c; margin-top: 5px">
						提示：该用户的视频号已修改过，不能再修改
					</div>
				</el-form-item>
				<el-form-item label="头像" prop="face">
					<el-input v-model="editForm.face" placeholder="头像URL（仅显示，需通过文件上传功能编辑）" disabled />
					<el-image
						v-if="editForm.face"
						:src="editForm.face"
						style="width: 50px; height: 50px; margin-top: 5px"
						fit="cover"
						:preview-src-list="[editForm.face]"
					/>
					<div style="font-size: 12px; color: #999; margin-top: 5px">提示：头像需通过文件上传功能编辑</div>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="editForm.sex" placeholder="请选择性别" clearable style="width: 100%">
						<el-option label="女" :value="0" />
						<el-option label="男" :value="1" />
						<el-option label="未知" :value="2" />
					</el-select>
				</el-form-item>
				<el-form-item label="生日" prop="birthday">
					<el-date-picker
						v-model="editForm.birthday"
						type="date"
						placeholder="选择生日"
						value-format="YYYY-MM-DD"
						style="width: 100%"
						clearable
					/>
				</el-form-item>
				<el-form-item label="国家" prop="country">
					<el-input v-model="editForm.country" placeholder="请输入国家" clearable />
				</el-form-item>
				<el-form-item label="省份" prop="province">
					<el-input v-model="editForm.province" placeholder="请输入省份" clearable />
				</el-form-item>
				<el-form-item label="城市" prop="city">
					<el-input v-model="editForm.city" placeholder="请输入城市" clearable />
				</el-form-item>
				<el-form-item label="区县" prop="district">
					<el-input v-model="editForm.district" placeholder="请输入区县" clearable />
				</el-form-item>
				<el-form-item label="个人简介" prop="description">
					<el-input v-model="editForm.description" type="textarea" :rows="3" placeholder="请输入个人简介" clearable />
				</el-form-item>
				<el-form-item label="背景图" prop="bgImg">
					<el-input v-model="editForm.bgImg" placeholder="背景图URL（仅显示，需通过文件上传功能编辑）" disabled />
					<el-image
						v-if="editForm.bgImg"
						:src="editForm.bgImg"
						style="width: 100px; height: 50px; margin-top: 5px"
						fit="cover"
						:preview-src-list="[editForm.bgImg]"
					/>
					<div style="font-size: 12px; color: #999; margin-top: 5px">提示：背景图需通过文件上传功能编辑</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>
		<!-- 新增用户对话框 -->
		<el-dialog v-model="addDialogVisible" title="新增用户" width="500px" :close-on-click-modal="false">
			<el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="addForm.mobile" placeholder="请输入手机号" clearable maxlength="11" />
					<div style="font-size: 12px; color: #999; margin-top: 5px">
						提示：如果该手机号未注册不，将创建新用户；如果该手机号已存在，将返回现有用户信息。
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="addDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="addSubmitLoading" @click="handleAddUserSubmit">确定</el-button>
			</template>
		</el-dialog>
		<div style="display: flex; justify-content: flex-end; margin-top: 10px">
			<el-pagination
				@current-change="
					page => {
						console.log('页码改变:', page);
						handleCurrentChange(page);
					}
				"
				@size-change="
					size => {
						console.log('每页数量改变:', size);
						handleSizeChange(size);
					}
				"
				:page-size="params.pageSize"
				:page-sizes="[10, 20, 50, 100]"
				v-model:current-page="params.page"
				layout="total, sizes, prev, pager, next, jumper"
				:total="tableTotal"
			>
			</el-pagination>
		</div>
	</div>
</template>
<script setup name="userMgt">
import { onMounted, onActivated, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getUserList, updateUserInfo, deleteOrRestoreUser, banOrRestoreUser, addUser } from "@/api/userMgt";
import { useTable } from "@/utils/tableMethod";

// UserInfoModifyType 枚举值
const MODIFY_TYPE = {
	NICKNAME: 1, // 昵称
	VIDEONUM: 2, // 视频号
	SEX: 3, // 性别
	BIRTHDAY: 4, // 生日
	LOCATION: 5, // 所在地
	DESC: 6 // 简介
};

const { params, tableTotal, tableData, tableLoading, handleSearch, handleReset, handleSizeChange, handleCurrentChange } =
	useTable({
		request: {
			api: getUserList,
			tableDataKey: "data.rows", // 用户列表数据路径（从 res.data 开始）
			totalKey: "data.records", // 总数路径（使用 records 作为总记录数，而不是 total 总页数）
			params: {
				name: "",
				date: "",
				page: 1,
				pageSize: 10
			}
		}
	});

// 编辑对话框相关
const dialogVisible = ref(false);
const editFormRef = ref();
const submitLoading = ref(false);

// 新增用户对话框相关
const addDialogVisible = ref(false);
const addFormRef = ref();
const addSubmitLoading = ref(false);
const addForm = reactive({
	mobile: ""
});

// 新增用户表单验证规则
const addFormRules = {
	mobile: [
		{ required: true, message: "手机号不能为空", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
	]
};
// 使用 Map 来管理每个用户的 loading 状态
const deleteOrRestoreLoadingMap = ref({});
const banOrRestoreLoadingMap = ref({});
const editForm = reactive({
	id: "",
	nickname: "",
	mobile: "",
	videoNum: "",
	canVideoNumBeUpdated: undefined,
	face: "",
	sex: undefined,
	birthday: "",
	country: "",
	province: "",
	city: "",
	district: "",
	description: "",
	bgImg: "",
	isDeleted: undefined,
	status: undefined
});

// 表单验证规则
const editFormRules = {
	id: [{ required: true, message: "用户ID不能为空", trigger: "blur" }]
};

// 保存原始数据，用于比较是否有编辑
const originalData = reactive({});

// 打开编辑对话框
const handleEdit = row => {
	// 填充表单数据
	editForm.id = row.id || "";
	editForm.nickname = row.nickname || "";
	editForm.mobile = row.mobile || "";
	editForm.videoNum = row.videoNum || "";
	editForm.canVideoNumBeUpdated = row.canVideoNumBeUpdated;
	editForm.face = row.face || "";
	editForm.sex = row.sex !== undefined && row.sex !== null ? row.sex : undefined;
	editForm.birthday = row.birthday ? new Date(row.birthday).toISOString().split("T")[0] : "";
	editForm.country = row.country || "";
	editForm.province = row.province || "";
	editForm.city = row.city || "";
	editForm.district = row.district || "";
	editForm.description = row.description || "";
	editForm.bgImg = row.bgImg || "";
	editForm.isDeleted = row.isDeleted;
	editForm.status = row.status;

	// 保存原始数据用于比较
	originalData.id = row.id || "";
	originalData.nickname = row.nickname || "";
	originalData.videoNum = row.videoNum || "";
	originalData.canVideoNumBeUpdated = row.canVideoNumBeUpdated;
	originalData.sex = row.sex;
	originalData.birthday = row.birthday ? new Date(row.birthday).toISOString().split("T")[0] : "";
	originalData.country = row.country || "";
	originalData.province = row.province || "";
	originalData.city = row.city || "";
	originalData.district = row.district || "";
	originalData.description = row.description || "";
	originalData.isDeleted = row.isDeleted;
	originalData.status = row.status;

	dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
	if (!editFormRef.value) return;

	try {
		await editFormRef.value.validate();

		if (!editForm.id) {
			ElMessage.error("用户ID不能为空");
			return;
		}

		submitLoading.value = true;

		// 检查哪些字段被编辑了，并根据类型分组
		const updateTasks = [];

		// 1. 检查昵称是否编辑 (type=1)
		if (editForm.nickname !== originalData.nickname && editForm.nickname) {
			updateTasks.push({
				type: MODIFY_TYPE.NICKNAME,
				data: { id: editForm.id, nickname: editForm.nickname }
			});
		}

		// 2. 检查视频号是否编辑 (type=2)
		if (editForm.videoNum !== originalData.videoNum && editForm.videoNum) {
			// 检查是否可以修改视频号
			if (editForm.canVideoNumBeUpdated !== 1) {
				ElMessage.error("该用户的视频号已修改过，不能再修改");
				submitLoading.value = false;
				return;
			}
			updateTasks.push({
				type: MODIFY_TYPE.VIDEONUM,
				data: { id: editForm.id, videoNum: editForm.videoNum }
			});
		}

		// 3. 检查性别是否编辑 (type=3)
		if (editForm.sex !== originalData.sex && editForm.sex !== undefined && editForm.sex !== null) {
			updateTasks.push({
				type: MODIFY_TYPE.SEX,
				data: { id: editForm.id, sex: editForm.sex }
			});
		}

		// 4. 检查生日是否编辑 (type=4)
		if (editForm.birthday !== originalData.birthday && editForm.birthday) {
			updateTasks.push({
				type: MODIFY_TYPE.BIRTHDAY,
				data: { id: editForm.id, birthday: editForm.birthday }
			});
		}

		// 5. 检查所在地是否编辑 (type=5) - country/province/city/district 任意一个改变都算
		const locationChanged =
			editForm.country !== originalData.country ||
			editForm.province !== originalData.province ||
			editForm.city !== originalData.city ||
			editForm.district !== originalData.district;

		if (locationChanged) {
			const locationData = { id: editForm.id };
			if (editForm.country) locationData.country = editForm.country;
			if (editForm.province) locationData.province = editForm.province;
			if (editForm.city) locationData.city = editForm.city;
			if (editForm.district) locationData.district = editForm.district;
			updateTasks.push({
				type: MODIFY_TYPE.LOCATION,
				data: locationData
			});
		}

		// 6. 检查简介是否编辑 (type=6)
		if (editForm.description !== originalData.description && editForm.description) {
			updateTasks.push({
				type: MODIFY_TYPE.DESC,
				data: { id: editForm.id, description: editForm.description }
			});
		}

		// 如果没有需要更新的字段
		if (updateTasks.length === 0) {
			ElMessage.warning("没有需要编辑的内容");
			submitLoading.value = false;
			return;
		}

		// 依次执行所有更新任务
		let successCount = 0;
		let failCount = 0;

		for (const task of updateTasks) {
			try {
				const res = await updateUserInfo(task.data, task.type);
				if (res.data && res.data.success) {
					successCount++;
				} else {
					failCount++;
					console.error(`编辑失败 (type=${task.type}):`, res.data?.msg || "未知错误");
				}
			} catch (error) {
				failCount++;
				console.error(`编辑失败 (type=${task.type}):`, error);
			}
		}

		// 显示结果
		if (failCount === 0) {
			ElMessage.success(`编辑成功（共 ${successCount} 项）`);
			dialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else if (successCount > 0) {
			ElMessage.warning(`部分编辑成功（成功 ${successCount} 项，失败 ${failCount} 项）`);
			// 即使部分失败也刷新列表
			handleSearch();
		} else {
			ElMessage.error("编辑失败，请稍后重试");
		}
	} catch (error) {
		console.error("编辑用户信息失败:", error);
		ElMessage.error(error.response?.data?.msg || "编辑失败，请稍后重试");
	} finally {
		submitLoading.value = false;
	}
};

// 删除/恢复用户（切换逻辑删除状态）
const handleDeleteOrRestoreUser = async row => {
	if (!row || !row.id) {
		ElMessage.error("用户ID不能为空");
		return;
	}

	const isCurrentlyDeleted = row.isDeleted === 1;
	const actionText = isCurrentlyDeleted ? "恢复" : "删除";
	const confirmText = isCurrentlyDeleted
		? "确定要恢复该用户吗？恢复后用户将可以正常登录。"
		: "确定要删除该用户吗？删除后用户将无法登录，但数据会保留。";

	try {
		await ElMessageBox.confirm(confirmText, `确认${actionText}`, {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		deleteOrRestoreLoadingMap.value[row.id] = true;
		const res = await deleteOrRestoreUser(row.id);

		if (res.data && res.data.success) {
			ElMessage.success(`${actionText}成功`);
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || `${actionText}失败`);
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error(`${actionText}用户失败:`, error);
			ElMessage.error(error.response?.data?.msg || `${actionText}失败，请稍后重试`);
		}
	} finally {
		deleteOrRestoreLoadingMap.value[row.id] = false;
	}
};

// 设置用户状态（支持在三个状态之间任意转换）
const handleSetUserStatus = async (row, targetStatus) => {
	if (!row || !row.id) {
		ElMessage.error("用户ID不能为空");
		return;
	}

	// 如果目标状态和当前状态相同，无需操作
	if (row.status === targetStatus) {
		ElMessage.warning("用户已经是该状态，无需操作");
		return;
	}

	const statusMap = {
		0: "正常",
		1: "禁言",
		2: "封禁"
	};
	const currentStatusText = statusMap[row.status] || "未知";
	const targetStatusText = statusMap[targetStatus] || "未知";
	
	let actionDesc = "";
	if (targetStatus === 0) {
		// 恢复为正常状态
		actionDesc = `恢复后用户将解除${currentStatusText}状态，可以正常使用所有功能。`;
	} else if (targetStatus === 1) {
		// 设置为禁言状态
		actionDesc = "禁言后用户将无法发布评论，但仍可以发布视频、被关注。";
	} else if (targetStatus === 2) {
		// 设置为封禁状态
		actionDesc = "封禁后用户将无法发布视频、发表评论、关注他人和被他人关注。";
	}
	
	const confirmText = `确定要将用户状态从"${currentStatusText}"设置为"${targetStatusText}"吗？${actionDesc}`;

	try {
		await ElMessageBox.confirm(confirmText, `确认设置为${targetStatusText}`, {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		banOrRestoreLoadingMap.value[row.id] = true;
		const res = await banOrRestoreUser(row.id, targetStatus);

		if (res.data && res.data.success) {
			ElMessage.success(`设置为${targetStatusText}成功`);
			// 刷新列表以更新状态
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || `设置为${targetStatusText}失败`);
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error(`设置用户状态失败:`, error);
			ElMessage.error(error.response?.data?.msg || `设置为${targetStatusText}失败，请稍后重试`);
		}
	} finally {
		banOrRestoreLoadingMap.value[row.id] = false;
	}
};

// 打开新增用户对话框
const handleAddUser = () => {
	addForm.mobile = "";
	addDialogVisible.value = true;
	// 重置表单验证状态
	if (addFormRef.value) {
		addFormRef.value.clearValidate();
	}
};

// 提交新增用户
const handleAddUserSubmit = async () => {
	if (!addFormRef.value) return;

	try {
		await addFormRef.value.validate();

		if (!addForm.mobile) {
			ElMessage.error("手机号不能为空");
			return;
		}

		// 先检查当前列表中是否已存在该手机号的用户（包括已删除的）
		const existingUserInList = tableData.value.find(user => user.mobile === addForm.mobile);
		// 检查是否存在且未删除的用户
		const existingActiveUser = existingUserInList && (existingUserInList.isDeleted !== 1 && existingUserInList.isDeleted !== '1');

		addSubmitLoading.value = true;
		const res = await addUser(addForm.mobile);

		if (res.data && res.data.success) {
			const userData = res.data.data;
			const userId = userData?.id || "未知";
			const nickname = userData?.nickname || "未设置";
			
			// 根据后端逻辑判断操作类型：
			// 1. 如果用户之前就存在且未删除，后端直接返回用户信息
			// 2. 如果用户之前被逻辑删除，后端会恢复用户
			// 3. 如果用户完全不存在，后端会创建新用户
			
			// 检查返回的用户是否在当前列表中
			const userExistsInList = tableData.value.find(user => user.id === userData?.id);
			
			if (existingActiveUser) {
				// 用户之前就存在且未删除
				ElMessage.info(`该手机号已注册！用户ID: ${userId}，昵称: ${nickname}`);
			} else if (existingUserInList && (existingUserInList.isDeleted === 1 || existingUserInList.isDeleted === '1')) {
				// 用户之前被逻辑删除，现在已恢复
				ElMessage.success(`用户恢复成功！用户ID: ${userId}，昵称: ${nickname}`);
			} else {
				// 用户是新创建的
				ElMessage.success(`新增用户成功！用户ID: ${userId}，昵称: ${nickname}`);
			}
			
			addDialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "操作失败");
		}
	} catch (error) {
		if (error !== false) {
			// error !== false 表示不是表单验证失败
			console.error("新增用户失败:", error);
			ElMessage.error(error.response?.data?.msg || "操作失败，请稍后重试");
		}
	} finally {
		addSubmitLoading.value = false;
	}
};

onMounted(() => {
	handleSearch();
});

// 使用 onActivated 确保每次激活页面时都自动请求（适用于 keep-alive 缓存的页面）
onActivated(() => {
	// 每次激活页面时自动请求列表
	handleSearch();
});
</script>
<style scoped>
.table-wrapper {
	overflow-x: auto;
	overflow-y: visible;
}
.table-wrapper :deep(.el-table__body-wrapper) {
	overflow-y: visible !important;
	overflow-x: auto !important;
}
</style>
