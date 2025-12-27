<template>
	<div class="card">
	<el-form :inline="true" :model="params" class="demo-form-inline">
		<el-form-item label="视频ID">
			<el-input v-model="params.vlogId" placeholder="请输入视频ID（留空则查询所有评论）" clearable />
		</el-form-item>
		<el-form-item label="评论者ID">
			<el-input v-model="params.userId" placeholder="请输入评论者ID（留空则不按用户筛选）" clearable />
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="handleSearch()">搜索</el-button>
			<el-button type="info" @click="handleReset()">清空</el-button>
		</el-form-item>
	</el-form>

	<el-alert v-if="!params.vlogId && !params.userId" type="info" show-icon title="未输入筛选条件，将查询所有评论" style="margin-bottom: 10px" />

	<div class="table-wrapper">
		<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
			<!-- 使用 CommentAdminVO 的字段 -->
			<el-table-column prop="id" label="评论ID" width="180" show-overflow-tooltip />

			<el-table-column prop="vlogId" label="视频ID" width="180" show-overflow-tooltip />

			<el-table-column prop="vlogTitle" label="视频标题" width="200" show-overflow-tooltip />

			<el-table-column prop="vlogerId" label="视频作者ID" width="180" show-overflow-tooltip />

			<el-table-column prop="vlogerNickname" label="视频作者昵称" width="150" show-overflow-tooltip />

			<el-table-column prop="vlogerFace" label="视频作者头像" width="120">
				<template #default="{ row }">
					<el-image
						v-if="row.vlogerFace"
						:src="row.vlogerFace"
						style="width: 50px; height: 50px; border-radius: 50%"
						fit="cover"
						:preview-src-list="[row.vlogerFace]"
					/>
					<span v-else>无头像</span>
				</template>
			</el-table-column>

			<el-table-column prop="commentUserId" label="评论者ID" width="180" show-overflow-tooltip />

			<el-table-column prop="commentUserNickname" label="评论者昵称" width="150" show-overflow-tooltip />

			<el-table-column prop="commentUserFace" label="评论者头像" width="120">
				<template #default="{ row }">
					<el-image
						v-if="row.commentUserFace"
						:src="row.commentUserFace"
						style="width: 50px; height: 50px; border-radius: 50%"
						fit="cover"
						:preview-src-list="[row.commentUserFace]"
					/>
					<span v-else>无头像</span>
				</template>
			</el-table-column>

			<el-table-column prop="fatherCommentId" label="父评论ID" width="180" show-overflow-tooltip />

			<el-table-column prop="content" label="评论内容" min-width="260" show-overflow-tooltip />

			<el-table-column prop="replyedUserNickname" label="被回复用户昵称" width="150" show-overflow-tooltip />

			<el-table-column prop="likeCounts" label="点赞数" width="90" />

			<el-table-column prop="createTime" label="创建时间" width="190">
				<template #default="{ row }">
					<span>{{ row.createTime ? new Date(row.createTime).toLocaleString() : "-" }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="isDeleted" label="删除状态" width="100">
				<template #default="{ row }">
					<el-tag :type="(row.isDeleted === 1 || row.isDeleted === '1') ? 'danger' : 'success'">
						{{ (row.isDeleted === 1 || row.isDeleted === '1') ? "已删除" : "正常" }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" fixed="right">
				<template #default="{ row }">
					<el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
					<el-button
						v-if="row.isDeleted !== 1 && row.isDeleted !== '1'"
						type="danger"
						size="small"
						:loading="deleteOrRestoreLoadingMap[row.id]"
						@click="handleDeleteOrRestoreComment(row)"
					>
						删除
					</el-button>
					<el-button
						v-if="row.isDeleted === 1 || row.isDeleted === '1'"
						type="success"
						size="small"
						:loading="deleteOrRestoreLoadingMap[row.id]"
						@click="handleDeleteOrRestoreComment(row)"
					>
						恢复
					</el-button>
				</template>
			</el-table-column>
		</el-table>
				</div>

		<!-- 编辑评论对话框 -->
		<el-dialog v-model="dialogVisible" title="修改评论信息" width="600px" :close-on-click-modal="false">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
				<el-form-item label="评论ID" prop="commentId">
					<el-input v-model="editForm.commentId" disabled />
				</el-form-item>
				<el-form-item label="视频ID" prop="vlogId">
					<el-input v-model="editForm.vlogId" disabled />
				</el-form-item>
				<el-form-item label="评论内容" prop="content">
					<el-input v-model="editForm.content" type="textarea" :rows="4" placeholder="请输入评论内容" clearable />
				</el-form-item>
				<el-form-item label="父评论ID" prop="fatherCommentId">
					<el-input v-model="editForm.fatherCommentId" placeholder="请输入父评论ID（留空表示顶级评论）" clearable />
				</el-form-item>
				<!-- 注意：新的 CommentAdminVO 中没有 isLike 字段，如果需要编辑点赞状态，可能需要单独处理 -->
				<!-- <el-form-item label="是否点赞" prop="isLike">
					<el-select v-model="editForm.isLike" placeholder="请选择是否点赞" clearable style="width: 100%">
						<el-option label="未点赞" :value="0" />
						<el-option label="已点赞" :value="1" />
					</el-select>
				</el-form-item> -->
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
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

<script setup name="commentMgt">
import { onMounted, onActivated, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getCommentAdminList, updateCommentInfo, deleteOrRestoreComment } from "@/api/commentMgt";
import { useTable } from "@/utils/tableMethod";

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
		api: getCommentAdminList,
		// 后端返回：ok(PagedGridResult)，axios res.data = { status, msg, success, data: { page, total, records, rows } }
		tableDataKey: "data.rows", // 从 res.data 开始取列表
		totalKey: "data.records", // 从 res.data 开始取总记录数
		params: {
			vlogId: "", // 可选：如果为空则不按视频筛选
			userId: "", // 可选：评论者ID，如果为空则不按用户筛选
			page: 1,
			pageSize: 10
		}
	},
	response: {
		handleResponseData: (list) => {
			// 调试：打印第一条数据，检查 isDeleted 字段
			if (list && list.length > 0) {
				console.log("【评论管理】第一条数据示例:", list[0]);
				console.log("【评论管理】isDeleted 字段值:", list[0].isDeleted, "类型:", typeof list[0].isDeleted);
			}
			return list;
		}
	}
});

// 直接使用 baseHandleSearch，vlogId 和 userId 都为空时也可以查询所有评论
const handleSearch = () => {
	baseHandleSearch();
};

// 编辑对话框相关
const dialogVisible = ref(false);
const editFormRef = ref();
const submitLoading = ref(false);
const editForm = reactive({
	commentId: "", // 对应 CommentAdminVO 的 id 字段
	vlogId: "",
	content: "",
	fatherCommentId: ""
	// 注意：新的 CommentAdminVO 中没有 isLike 字段
	// isLike: undefined
});

// 表单验证规则
const editFormRules = {
	commentId: [{ required: true, message: "评论ID不能为空", trigger: "blur" }]
};

// 打开编辑对话框
const handleEdit = row => {
	// 填充表单数据，使用新的 CommentAdminVO 字段名
	editForm.commentId = row.id || ""; // CommentAdminVO 使用 id 字段
	editForm.vlogId = row.vlogId || "";
	editForm.content = row.content || "";
	editForm.fatherCommentId = row.fatherCommentId || "";
	// 注意：新的 CommentAdminVO 中没有 isLike 字段，如果需要编辑点赞状态，可能需要单独处理
	// editForm.isLike = row.isLike !== undefined && row.isLike !== null ? row.isLike : undefined;
	dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
	if (!editFormRef.value) return;

	try {
		await editFormRef.value.validate();

		if (!editForm.commentId) {
			ElMessage.error("评论ID不能为空");
			return;
		}

		submitLoading.value = true;

		// 构建提交数据，只包含有值的字段
		const submitData = {
			commentId: editForm.commentId // 或者使用 id，取决于后端接口要求
		};

		if (editForm.content !== undefined && editForm.content !== null && editForm.content !== "") {
			submitData.content = editForm.content;
		}
		if (editForm.fatherCommentId !== undefined && editForm.fatherCommentId !== null && editForm.fatherCommentId !== "") {
			submitData.fatherCommentId = editForm.fatherCommentId;
			}
		// 注意：新的 CommentAdminVO 中没有 isLike 字段，如果需要编辑点赞状态，可能需要单独处理
		// if (editForm.isLike !== undefined && editForm.isLike !== null) submitData.isLike = editForm.isLike;

		const res = await updateCommentInfo(submitData);

		if (res.data && res.data.success) {
			ElMessage.success("修改成功");
			dialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "修改失败");
		}
	} catch (error) {
		console.error("修改评论信息失败:", error);
		ElMessage.error(error.response?.data?.msg || "修改失败，请稍后重试");
	} finally {
		submitLoading.value = false;
	}
};

// 每个评论删除操作的 loading 状态
const deleteOrRestoreLoadingMap = reactive({});

// 删除/恢复评论（切换逻辑删除状态）
const handleDeleteOrRestoreComment = async row => {
	if (!row || !row.id) {
		ElMessage.error("评论ID不能为空");
		return;
	}

	// 处理 null/undefined 的情况，以及字符串 '1' 的情况
	const isCurrentlyDeleted = row.isDeleted === 1 || row.isDeleted === '1';
	const actionText = isCurrentlyDeleted ? "恢复" : "删除";
	const confirmText = isCurrentlyDeleted
		? "确定要恢复该评论吗？恢复后评论将可以正常显示。"
		: "确定要删除该评论吗？删除后评论将无法显示，但数据会保留。";

	try {
		await ElMessageBox.confirm(confirmText, `确认${actionText}`, {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		deleteOrRestoreLoadingMap[row.id] = true;
		const res = await deleteOrRestoreComment(row.id);

		if (res.data && res.data.success) {
			ElMessage.success(`${actionText}成功`);
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || `${actionText}失败`);
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error(`${actionText}评论失败:`, error);
			ElMessage.error(error.response?.data?.msg || `${actionText}失败，请稍后重试`);
			}
	} finally {
		deleteOrRestoreLoadingMap[row.id] = false;
	}
};

onMounted(() => {
	// 可以自动查询所有评论（因为 vlogId 和 userId 都是可选参数）
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
