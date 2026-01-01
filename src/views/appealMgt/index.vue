<template>
	<div class="card">
		<el-form :inline="true" :model="params" class="demo-form-inline" style="display: flex; align-items: center; flex-wrap: wrap">
			<el-form-item label="申诉类型">
				<el-select v-model="params.appealType" placeholder="请选择申诉类型" clearable style="width: 150px">
					<el-option label="全部" :value="undefined" />
					<el-option label="视频" :value="1" />
					<el-option label="评论" :value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="处理状态">
				<el-select v-model="params.status" placeholder="请选择处理状态" clearable style="width: 150px">
					<el-option label="全部" :value="undefined" />
					<el-option label="待处理" :value="0" />
					<el-option label="已处理（通过）" :value="1" />
					<el-option label="已驳回" :value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="被申诉对象ID">
				<el-input v-model="params.targetId" placeholder="请输入被申诉对象ID" clearable style="width: 200px" />
			</el-form-item>
			<el-form-item label="举报记录ID">
				<el-input v-model="params.reportId" placeholder="请输入举报记录ID" clearable style="width: 200px" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch()">搜索</el-button>
				<el-button type="info" @click="handleReset()">清空</el-button>
			</el-form-item>
		</el-form>

		<div class="table-wrapper">
			<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
				<el-table-column prop="id" label="申诉ID" width="180" show-overflow-tooltip />

				<el-table-column label="申诉人" width="200">
					<template #default="{ row }">
						<div style="display: flex; align-items: center">
							<el-image
								v-if="row.appealerFace"
								:src="row.appealerFace"
								style="width: 40px; height: 40px; border-radius: 50%; margin-right: 8px"
								fit="cover"
								:preview-src-list="[row.appealerFace]"
							/>
							<div>
								<div style="font-weight: 500">{{ row.appealerNickname || row.appealerId || "-" }}</div>
								<div style="font-size: 12px; color: #999">{{ row.appealerId }}</div>
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column prop="appealType" label="申诉类型" width="100">
					<template #default="{ row }">
						<el-tag :type="row.appealType === 1 ? 'primary' : 'warning'">
							{{ row.appealType === 1 ? "视频" : row.appealType === 2 ? "评论" : "-" }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="被申诉对象" min-width="250">
					<template #default="{ row }">
						<div v-if="row.appealType === 1">
							<div style="font-weight: 500; margin-bottom: 4px">
								{{ row.targetTitle || row.targetId || "-" }}
							</div>
							<div style="font-size: 12px; color: #999">视频ID: {{ row.targetId }}</div>
							<div v-if="row.targetUserNickname" style="font-size: 12px; color: #999">作者: {{ row.targetUserNickname }}</div>
						</div>
						<div v-else-if="row.appealType === 2">
							<div style="font-weight: 500; margin-bottom: 4px">
								{{ row.targetContent || row.targetId || "-" }}
							</div>
							<div style="font-size: 12px; color: #999">评论ID: {{ row.targetId }}</div>
							<div v-if="row.targetUserNickname" style="font-size: 12px; color: #999">评论者: {{ row.targetUserNickname }}</div>
						</div>
						<div v-else>-</div>
					</template>
				</el-table-column>

				<el-table-column prop="reportId" label="举报记录ID" width="180" show-overflow-tooltip />

				<el-table-column prop="reason" label="申诉理由" width="150" show-overflow-tooltip />

				<el-table-column prop="description" label="申诉描述" min-width="200" show-overflow-tooltip />

				<el-table-column prop="status" label="处理状态" width="120">
					<template #default="{ row }">
						<el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'danger'">
							{{ row.status === 0 ? "待处理" : row.status === 1 ? "已处理（通过）" : row.status === 2 ? "已驳回" : "-" }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="处理人" width="150">
					<template #default="{ row }">
						<div v-if="row.handlerNickname">
							<div style="font-size: 12px; color: #999">ID: {{ row.handlerId }}</div>
							<div style="font-weight: 500">{{ row.handlerNickname }}</div>
						</div>
						<span v-else>-</span>
					</template>
				</el-table-column>

				<el-table-column prop="handleTime" label="处理时间" width="180">
					<template #default="{ row }">
						<span>{{ row.handleTime ? new Date(row.handleTime).toLocaleString() : "-" }}</span>
					</template>
				</el-table-column>

				<el-table-column prop="handleResult" label="处理结果" min-width="150" show-overflow-tooltip />

				<el-table-column prop="createTime" label="申诉时间" width="180">
					<template #default="{ row }">
						<span>{{ row.createTime ? new Date(row.createTime).toLocaleString() : "-" }}</span>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="280" fixed="right">
					<template #default="{ row }">
						<el-button
							v-if="row.status === 0"
							type="primary"
							size="small"
							:loading="handleLoadingMap[row.id]"
							@click="handleOpenDialog(row)"
						>
							处理
						</el-button>
						<el-button
							v-if="row.status === 1 || row.status === 2"
							type="warning"
							size="small"
							:loading="editLoadingMap[row.id]"
							@click="handleOpenEditDialog(row)"
						>
							编辑
						</el-button>
						<el-button
							v-if="row.status === 1 || row.status === 2"
							type="danger"
							size="small"
							:loading="resetLoadingMap[row.id]"
							@click="handleResetAppeal(row)"
						>
							重置
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 编辑申诉对话框 -->
		<el-dialog v-model="editDialogVisible" title="编辑申诉记录" width="600px" :close-on-click-modal="false">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
				<el-form-item label="申诉ID" prop="appealId">
					<el-input v-model="editForm.appealId" disabled />
				</el-form-item>
				<el-form-item label="申诉类型" prop="appealType">
					<el-input :value="editForm.appealType === 1 ? '视频' : editForm.appealType === 2 ? '评论' : '-'" disabled />
				</el-form-item>
				<el-form-item label="处理人ID" prop="handlerId">
					<el-input
						v-model="editForm.handlerId"
						:placeholder="adminInfo ? `当前管理员ID: ${adminInfo.id}` : '请输入处理人ID'"
						:disabled="!!adminInfo"
					/>
					<div style="font-size: 12px; color: #999; margin-top: 5px">
						{{ adminInfo ? `当前登录管理员: ${adminInfo.realName || adminInfo.username}` : "提示：请输入当前登录管理员的用户ID" }}
					</div>
				</el-form-item>
				<el-form-item label="处理状态" prop="status">
					<el-radio-group v-model="editForm.status">
						<el-radio :label="1">已处理（通过）</el-radio>
						<el-radio :label="2">已驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="处理结果说明" prop="handleResult">
					<el-input
						v-model="editForm.handleResult"
						type="textarea"
						:rows="4"
						placeholder="请输入处理结果说明（可选）"
						clearable
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="editDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="editSubmitLoading" @click="handleEditSubmit">确定</el-button>
			</template>
		</el-dialog>

		<!-- 处理申诉对话框 -->
		<el-dialog v-model="handleDialogVisible" title="处理申诉" width="600px" :close-on-click-modal="false">
			<el-form ref="handleFormRef" :model="handleForm" :rules="handleFormRules" label-width="100px">
				<el-form-item label="申诉ID" prop="appealId">
					<el-input v-model="handleForm.appealId" disabled />
				</el-form-item>
				<el-form-item label="申诉类型" prop="appealType">
					<el-input :value="handleForm.appealType === 1 ? '视频' : handleForm.appealType === 2 ? '评论' : '-'" disabled />
				</el-form-item>
				<el-form-item label="处理人ID" prop="handlerId">
					<el-input
						v-model="handleForm.handlerId"
						:placeholder="adminInfo ? `当前管理员ID: ${adminInfo.id}` : '请输入处理人ID'"
						:disabled="!!adminInfo"
					/>
					<div style="font-size: 12px; color: #999; margin-top: 5px">
						{{ adminInfo ? `当前登录管理员: ${adminInfo.realName || adminInfo.username}` : "提示：请输入当前登录管理员的用户ID" }}
					</div>
				</el-form-item>
				<el-form-item label="处理状态" prop="status">
					<el-radio-group v-model="handleForm.status">
						<el-radio :label="1">已处理（通过）</el-radio>
						<el-radio :label="2">已驳回</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="处理结果说明" prop="handleResult">
					<el-input
						v-model="handleForm.handleResult"
						type="textarea"
						:rows="4"
						placeholder="请输入处理结果说明（可选）"
						clearable
					/>
				</el-form-item>
				<el-form-item label="通知申诉人" prop="notifyAppealer">
					<el-switch v-model="handleForm.notifyAppealer" />
					<div style="font-size: 12px; color: #999; margin-top: 5px">提示：开启后将通过消息通知申诉人处理结果</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="handleDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="handleSubmitLoading" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>

		<div style="display: flex; justify-content: flex-end; margin-top: 10px">
			<div style="margin-right: 20px; font-size: 12px; color: #999">
				总数: {{ tableTotal }} | 当前页: {{ params.page }} | 每页: {{ params.pageSize }} | 数据条数: {{ tableData.length }}
			</div>
			<el-pagination
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
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

<script setup name="appealMgt">
import { onMounted, onActivated, ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getAppealList, handleAppeal, updateAppeal, resetAppeal } from "@/api/appealMgt";
import { useTable } from "@/utils/tableMethod";
import { GlobalStore } from "@/stores";

const globalStore = GlobalStore();

// 获取当前管理员信息
const adminInfo = computed(() => globalStore.adminInfo);

const {
	params,
	tableTotal,
	tableData,
	tableLoading,
	handleSearch: baseHandleSearch,
	handleReset,
	handleSizeChange,
	handleCurrentChange
} = useTable({
	request: {
		api: getAppealList,
		// 后端返回：ok(PagedGridResult)，axios res.data = { status, msg, success, data: { page, total, records, rows } }
		tableDataKey: "data.rows", // 从 res.data 开始取列表
		totalKey: "data.records", // 从 res.data 开始取总记录数
		params: {
			appealType: undefined, // 可选：1-视频，2-评论
			status: undefined, // 可选：0-待处理，1-已处理（通过），2-已驳回
			targetId: "", // 可选：被申诉对象ID
			reportId: "", // 可选：举报记录ID
			page: 1,
			pageSize: 10
		}
	}
});

// 直接使用 baseHandleSearch
const handleSearch = () => {
	baseHandleSearch();
};

// 处理申诉对话框相关
const handleDialogVisible = ref(false);
const handleFormRef = ref();
const handleSubmitLoading = ref(false);
const handleForm = reactive({
	appealId: "",
	appealType: undefined,
	handlerId: "",
	status: 1, // 默认选择"已处理（通过）"
	handleResult: "",
	notifyAppealer: false
});

// 表单验证规则
const handleFormRules = {
	appealId: [{ required: true, message: "申诉ID不能为空", trigger: "blur" }],
	handlerId: [{ required: true, message: "处理人ID不能为空", trigger: "blur" }],
	status: [{ required: true, message: "请选择处理状态", trigger: "change" }]
};

// 每个申诉处理操作的 loading 状态
const handleLoadingMap = reactive({});

// 编辑申诉对话框相关
const editDialogVisible = ref(false);
const editFormRef = ref();
const editSubmitLoading = ref(false);
const editForm = reactive({
	appealId: "",
	appealType: undefined,
	handlerId: "",
	status: 1, // 默认选择"已处理（通过）"
	handleResult: ""
});

// 编辑表单验证规则
const editFormRules = {
	appealId: [{ required: true, message: "申诉ID不能为空", trigger: "blur" }],
	handlerId: [{ required: true, message: "处理人ID不能为空", trigger: "blur" }],
	status: [{ required: true, message: "请选择处理状态", trigger: "change" }]
};

// 每个申诉编辑操作的 loading 状态
const editLoadingMap = reactive({});

// 每个申诉重置操作的 loading 状态
const resetLoadingMap = reactive({});

// 打开处理对话框
const handleOpenDialog = row => {
	if (!row || !row.id) {
		ElMessage.error("申诉ID不能为空");
		return;
	}

	// 填充表单数据
	handleForm.appealId = row.id || "";
	handleForm.appealType = row.appealType;
	// 自动填充当前管理员ID
	handleForm.handlerId = adminInfo.value ? String(adminInfo.value.id) : "";
	handleForm.status = 1; // 默认选择"已处理（通过）"
	handleForm.handleResult = "";
	handleForm.notifyAppealer = false;

	handleDialogVisible.value = true;

	// 重置表单验证状态
	if (handleFormRef.value) {
		handleFormRef.value.clearValidate();
	}
};

// 提交处理
const handleSubmit = async () => {
	if (!handleFormRef.value) return;

	try {
		await handleFormRef.value.validate();

		if (!handleForm.appealId) {
			ElMessage.error("申诉ID不能为空");
			return;
		}

		if (!handleForm.handlerId) {
			ElMessage.error("处理人ID不能为空");
			return;
		}

		if (handleForm.status !== 1 && handleForm.status !== 2) {
			ElMessage.error("请选择处理状态（已处理（通过）或已驳回）");
			return;
		}

		handleSubmitLoading.value = true;
		handleLoadingMap[handleForm.appealId] = true;

		const res = await handleAppeal({
			appealId: handleForm.appealId,
			handlerId: handleForm.handlerId,
			status: handleForm.status,
			handleResult: handleForm.handleResult || undefined,
			notifyAppealer: handleForm.notifyAppealer
		});

		if (res.data && res.data.success) {
			ElMessage.success("处理成功");
			handleDialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "处理失败");
		}
	} catch (error) {
		if (error !== false) {
			// error !== false 表示不是表单验证失败
			console.error("处理申诉失败:", error);
			ElMessage.error(error.response?.data?.msg || "处理失败，请稍后重试");
		}
	} finally {
		handleSubmitLoading.value = false;
		handleLoadingMap[handleForm.appealId] = false;
	}
};

// 打开编辑对话框
const handleOpenEditDialog = row => {
	if (!row || !row.id) {
		ElMessage.error("申诉ID不能为空");
		return;
	}

	// 验证记录是否已被处理过（只能编辑已处理的记录）
	if (row.status === 0 || row.status === null || row.status === undefined) {
		ElMessage.warning("只能编辑已处理的申诉记录");
		return;
	}

	// 填充表单数据
	editForm.appealId = row.id || "";
	editForm.appealType = row.appealType;
	// 自动填充当前管理员ID，如果没有则使用原处理人ID
	editForm.handlerId = adminInfo.value ? String(adminInfo.value.id) : row.handlerId || "";
	// 使用当前状态
	editForm.status = row.status === 1 ? 1 : 2;
	// 使用当前处理结果
	editForm.handleResult = row.handleResult || "";

	editDialogVisible.value = true;

	// 重置表单验证状态
	if (editFormRef.value) {
		editFormRef.value.clearValidate();
	}
};

// 提交编辑
const handleEditSubmit = async () => {
	if (!editFormRef.value) return;

	try {
		await editFormRef.value.validate();

		if (!editForm.appealId) {
			ElMessage.error("申诉ID不能为空");
			return;
		}

		if (!editForm.handlerId) {
			ElMessage.error("处理人ID不能为空");
			return;
		}

		if (editForm.status !== 1 && editForm.status !== 2) {
			ElMessage.error("请选择处理状态（已处理（通过）或已驳回）");
			return;
		}

		editSubmitLoading.value = true;
		editLoadingMap[editForm.appealId] = true;

		const res = await updateAppeal({
			appealId: editForm.appealId,
			handlerId: editForm.handlerId,
			status: editForm.status,
			handleResult: editForm.handleResult || undefined
		});

		if (res.data && res.data.success) {
			ElMessage.success("编辑成功");
			editDialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "编辑失败");
		}
	} catch (error) {
		if (error !== false) {
			// error !== false 表示不是表单验证失败
			console.error("编辑申诉失败:", error);
			ElMessage.error(error.response?.data?.msg || "编辑失败，请稍后重试");
		}
	} finally {
		editSubmitLoading.value = false;
		editLoadingMap[editForm.appealId] = false;
	}
};

// 重置申诉
const handleResetAppeal = async row => {
	if (!row || !row.id) {
		ElMessage.error("申诉ID不能为空");
		return;
	}

	try {
		await ElMessageBox.confirm("确定要重置这条申诉记录吗？重置后状态将归零，处理信息将被清空，相关消息将被删除。", "确认重置", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		resetLoadingMap[row.id] = true;
		const res = await resetAppeal(row.id);

		if (res.data && res.data.success) {
			ElMessage.success("重置成功");
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "重置失败");
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error("重置申诉失败:", error);
			ElMessage.error(error.response?.data?.msg || "重置失败，请稍后重试");
		}
	} finally {
		resetLoadingMap[row.id] = false;
	}
};

onMounted(() => {
	// 自动查询申诉列表
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

