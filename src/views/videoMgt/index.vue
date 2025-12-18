<template>
	<div class="card">
		<el-form :inline="true" :model="params" class="demo-form-inline">
			<el-form-item label="搜索关键字">
				<el-input v-model="params.search" placeholder="请输入视频标题关键字" clearable />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch()">搜索</el-button>
				<el-button type="info" @click="handleReset()">清空</el-button>
			</el-form-item>
		</el-form>

		<div class="table-wrapper">
			<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
				<!-- 使用 IndexVlogVO 的字段 -->
				<el-table-column prop="vlogId" label="视频ID" width="180" />

				<el-table-column prop="vlogerName" label="作者昵称" width="160" show-overflow-tooltip />

				<el-table-column prop="vlogerFace" label="作者头像" width="120">
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

				<el-table-column prop="content" label="标题/文案" min-width="220" show-overflow-tooltip />

				<el-table-column prop="cover" label="封面" width="140">
					<template #default="{ row }">
						<el-image
							v-if="row.cover"
							:src="row.cover"
							style="width: 110px; height: 62px"
							fit="cover"
							:preview-src-list="[row.cover]"
						/>
						<span v-else>无封面</span>
					</template>
				</el-table-column>

				<el-table-column prop="url" label="播放地址" min-width="220" show-overflow-tooltip />
				<el-table-column prop="width" label="宽度" width="90" />
				<el-table-column prop="height" label="高度" width="90" />
				<el-table-column prop="likeCounts" label="点赞数" width="100" />
				<el-table-column prop="commentsCounts" label="评论数" width="100" />

				<el-table-column prop="isPrivate" label="权限" width="100">
					<template #default="{ row }">
						<el-tag :type="row.isPrivate === 1 ? 'warning' : 'success'">
							{{ row.isPrivate === 1 ? "私密" : "公开" }}
						</el-tag>
					</template>
				</el-table-column>

				<!-- IndexVlogVO 中没有时间字段，这里先不展示创建/更新时间 -->
				<el-table-column label="操作" width="120" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 编辑视频对话框 -->
		<el-dialog v-model="dialogVisible" title="编辑视频信息" width="600px" :close-on-click-modal="false">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
				<el-form-item label="视频ID" prop="vlogId">
					<el-input v-model="editForm.vlogId" disabled />
				</el-form-item>
				<el-form-item label="标题/文案" prop="content">
					<el-input v-model="editForm.content" type="textarea" :rows="3" placeholder="请输入标题/文案" clearable />
				</el-form-item>
				<el-form-item label="封面URL" prop="cover">
					<el-input v-model="editForm.cover" placeholder="请输入封面URL" clearable />
					<el-image
						v-if="editForm.cover"
						:src="editForm.cover"
						style="width: 110px; height: 62px; margin-top: 5px"
						fit="cover"
						:preview-src-list="[editForm.cover]"
					/>
				</el-form-item>
				<el-form-item label="播放地址" prop="url">
					<el-input v-model="editForm.url" placeholder="请输入播放地址" clearable />
				</el-form-item>
				<el-form-item label="宽度" prop="width">
					<el-input-number v-model="editForm.width" :min="0" placeholder="请输入宽度" style="width: 100%" />
				</el-form-item>
				<el-form-item label="高度" prop="height">
					<el-input-number v-model="editForm.height" :min="0" placeholder="请输入高度" style="width: 100%" />
				</el-form-item>
				<el-form-item label="权限" prop="isPrivate">
					<el-select v-model="editForm.isPrivate" placeholder="请选择权限" clearable style="width: 100%">
						<el-option label="公开" :value="0" />
						<el-option label="私密" :value="1" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
			</template>
		</el-dialog>

		<div style="display: flex; justify-content: flex-end; margin-top: 10px">
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

<script setup name="videoMgt">
import { onMounted, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getVlogAdminList, updateVlogInfo } from "@/api/vlogMgt";
import { useTable } from "@/utils/tableMethod";

const { params, tableTotal, tableData, tableLoading, handleSearch, handleReset, handleSizeChange, handleCurrentChange } =
	useTable({
		request: {
			api: getVlogAdminList,
			// 后端返回：ok(PagedGridResult)，axios res.data = { status, msg, success, data: { page, total, records, rows } }
			tableDataKey: "data.rows", // 从 res.data 开始取列表
			totalKey: "data.records", // 从 res.data 开始取总记录数
			params: {
				search: "",
				page: 1,
				pageSize: 10
			}
		}
	});

// 编辑对话框相关
const dialogVisible = ref(false);
const editFormRef = ref();
const submitLoading = ref(false);
const editForm = reactive({
	vlogId: "",
	content: "",
	cover: "",
	url: "",
	width: undefined,
	height: undefined,
	isPrivate: undefined
});

// 表单验证规则
const editFormRules = {
	vlogId: [{ required: true, message: "视频ID不能为空", trigger: "blur" }]
};

// 打开编辑对话框
const handleEdit = row => {
	// 填充表单数据
	editForm.vlogId = row.vlogId || "";
	editForm.content = row.content || "";
	editForm.cover = row.cover || "";
	editForm.url = row.url || "";
	editForm.width = row.width !== undefined && row.width !== null ? row.width : undefined;
	editForm.height = row.height !== undefined && row.height !== null ? row.height : undefined;
	editForm.isPrivate = row.isPrivate !== undefined && row.isPrivate !== null ? row.isPrivate : undefined;
	dialogVisible.value = true;
};

// 提交表单
const handleSubmit = async () => {
	if (!editFormRef.value) return;

	try {
		await editFormRef.value.validate();

		if (!editForm.vlogId) {
			ElMessage.error("视频ID不能为空");
			return;
		}

		submitLoading.value = true;

		// 构建提交数据，只包含有值的字段
		const submitData = {
			vlogId: editForm.vlogId
		};

		if (editForm.content) submitData.content = editForm.content;
		if (editForm.cover) submitData.cover = editForm.cover;
		if (editForm.url) submitData.url = editForm.url;
		if (editForm.width !== undefined && editForm.width !== null) submitData.width = editForm.width;
		if (editForm.height !== undefined && editForm.height !== null) submitData.height = editForm.height;
		if (editForm.isPrivate !== undefined && editForm.isPrivate !== null) submitData.isPrivate = editForm.isPrivate;

		const res = await updateVlogInfo(submitData);

		if (res.data && res.data.success) {
			ElMessage.success("编辑成功");
			dialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "编辑失败");
		}
	} catch (error) {
		console.error("编辑视频信息失败:", error);
		ElMessage.error(error.response?.data?.msg || "编辑失败，请稍后重试");
	} finally {
		submitLoading.value = false;
	}
};

onMounted(() => {
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
