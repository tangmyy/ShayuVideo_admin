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
			<el-form-item label="推荐视频流排序规则">
				<el-select v-model="sortType" placeholder="请选择排序规则" style="width: 180px" :loading="sortTypeLoading">
					<el-option label="创建时间" :value="0" />
					<el-option label="点赞数" :value="1" />
					<el-option label="评论数" :value="2" />
				</el-select>
				<el-button type="primary" :loading="setSortTypeLoading" @click="handleSetSortType" style="margin-left: 10px"
					>设置</el-button
				>
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

				<el-table-column prop="tag" label="标签" width="120">
					<template #default="{ row }">
						<el-tag v-if="row.tag" type="info" size="small">{{ row.tag }}</el-tag>
						<span v-else style="color: #999">-</span>
					</template>
				</el-table-column>

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

				<el-table-column prop="auditStatus" label="审核状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.auditStatus === 2 ? 'danger' : row.auditStatus === 1 ? 'success' : 'info'">
							{{ row.auditStatus === 2 ? "已封禁" : row.auditStatus === 1 ? "已通过" : "待审核" }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="isDeleted" label="删除状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.isDeleted === 1 || row.isDeleted === '1' ? 'danger' : 'success'">
							{{ row.isDeleted === 1 || row.isDeleted === "1" ? "已删除" : "正常" }}
						</el-tag>
					</template>
				</el-table-column>

				<!-- IndexVlogVO 中没有时间字段，这里先不展示创建/更新时间 -->
				<el-table-column label="操作" width="280" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
						<el-button
							v-if="row.auditStatus !== 2"
							type="warning"
							size="small"
							:loading="banOrRestoreLoadingMap[row.vlogId]"
							@click="handleBanOrRestoreVlog(row)"
						>
							封禁
						</el-button>
						<el-button
							v-if="row.auditStatus === 2"
							type="success"
							size="small"
							:loading="banOrRestoreLoadingMap[row.vlogId]"
							@click="handleBanOrRestoreVlog(row)"
						>
							解封
						</el-button>
						<el-button
							v-if="row.isDeleted !== 1 && row.isDeleted !== '1'"
							type="danger"
							size="small"
							:loading="deleteOrRestoreLoadingMap[row.vlogId]"
							@click="handleDeleteOrRestoreVlog(row)"
						>
							删除
						</el-button>
						<el-button
							v-if="row.isDeleted === 1 || row.isDeleted === '1'"
							type="success"
							size="small"
							:loading="deleteOrRestoreLoadingMap[row.vlogId]"
							@click="handleDeleteOrRestoreVlog(row)"
						>
							恢复
						</el-button>
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
import { onMounted, onActivated, ref, reactive, inject, nextTick } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getVlogAdminList, updateVlogInfo, deleteOrRestoreVlog, setVlogSortType, getVlogSortType, auditVlog } from "@/api/vlogMgt";
import { GlobalStore } from "@/stores";
import { useTable } from "@/utils/tableMethod";
import { KeepAliveStore } from "@/stores/modules/keepAlive";

const route = useRoute();
const keepAliveStore = KeepAliveStore();
const refreshCurrentPage = inject("refresh");
const globalStore = GlobalStore();

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
		},
		response: {
			handleResponseData: list => {
				// 调试：打印第一条数据，检查 isDeleted 字段
				if (list && list.length > 0) {
					console.log("【视频管理】第一条数据示例:", list[0]);
					console.log("【视频管理】isDeleted 字段值:", list[0].isDeleted, "类型:", typeof list[0].isDeleted);
				}
				return list;
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

		// 构建提交数据，后端需要 id 字段（不是 vlogId）
		// 根据后端 VlogBO，需要传入 id 字段
		const submitData = {
			id: editForm.vlogId // 将 vlogId 转换为 id 提交给后端
		};

		// 只添加有值的字段，后端会使用 BeanUtils.copyProperties 复制属性
		// 注意：Vlog POJO 中使用的是 title 字段，不是 content
		if (editForm.content !== undefined && editForm.content !== null && editForm.content !== "") {
			submitData.title = editForm.content; // 前端使用 content，后端 Vlog 使用 title
		}
		if (editForm.cover !== undefined && editForm.cover !== null && editForm.cover !== "") {
			submitData.cover = editForm.cover;
		}
		if (editForm.url !== undefined && editForm.url !== null && editForm.url !== "") {
			submitData.url = editForm.url;
		}
		if (editForm.width !== undefined && editForm.width !== null) {
			submitData.width = editForm.width;
		}
		if (editForm.height !== undefined && editForm.height !== null) {
			submitData.height = editForm.height;
		}
		if (editForm.isPrivate !== undefined && editForm.isPrivate !== null) {
			submitData.isPrivate = editForm.isPrivate;
		}

		console.log("【视频编辑】提交数据:", submitData);
		const res = await updateVlogInfo(submitData);
		console.log("【视频编辑】完整响应:", res);
		console.log("【视频编辑】响应数据:", res.data);

		if (res.data && res.data.success) {
			ElMessage.success("编辑成功");
			dialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			const errorMsg = res.data?.msg || res.data?.message || "编辑失败";
			console.error("【视频编辑】编辑失败:", errorMsg, res.data);
			ElMessage.error(errorMsg);
		}
	} catch (error) {
		console.error("【视频编辑】编辑视频信息异常:", error);
		console.error("【视频编辑】错误响应:", error.response);
		console.error("【视频编辑】错误数据:", error.response?.data);
		const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || "编辑失败，请稍后重试";
		ElMessage.error(errorMsg);
	} finally {
		submitLoading.value = false;
	}
};

// 每个视频删除操作的 loading 状态
const deleteOrRestoreLoadingMap = reactive({});
// 每个视频封禁操作的 loading 状态
const banOrRestoreLoadingMap = reactive({});

// 封禁/解封视频（使用审核接口）
const handleBanOrRestoreVlog = async row => {
	if (!row || !row.vlogId) {
		ElMessage.error("视频ID不能为空");
		return;
	}

	// 获取当前管理员信息
	const adminInfo = globalStore.adminInfo;
	if (!adminInfo || !adminInfo.id) {
		ElMessage.error("管理员信息不存在，请重新登录");
		return;
	}

	// 处理审核状态：auditStatus === 2 表示已封禁，需要解封（auditStatus = 1）
	// auditStatus !== 2 表示未封禁，需要封禁（auditStatus = 2）
	const isCurrentlyBanned = row.auditStatus === 2;
	const auditStatus = isCurrentlyBanned ? 1 : 2; // 1-通过（解封），2-拒绝（封禁）
	const actionText = isCurrentlyBanned ? "解封" : "封禁";
	const confirmText = isCurrentlyBanned
		? "确定要解封该视频吗？解封后视频将可以正常显示。"
		: "确定要封禁该视频吗？封禁后视频将无法显示。";

	try {
		await ElMessageBox.confirm(confirmText, `确认${actionText}`, {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		banOrRestoreLoadingMap[row.vlogId] = true;
		const res = await auditVlog({
			vlogId: row.vlogId,
			auditStatus: auditStatus,
			adminId: Number(adminInfo.id),
			auditRemark: `${actionText}操作`
		});

		if (res.data && res.data.success) {
			ElMessage.success(`${actionText}成功`);
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || `${actionText}失败`);
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error(`${actionText}视频失败:`, error);
			ElMessage.error(error.response?.data?.msg || `${actionText}失败，请稍后重试`);
		}
	} finally {
		banOrRestoreLoadingMap[row.vlogId] = false;
	}
};

// 删除/恢复视频（切换逻辑删除状态）
const handleDeleteOrRestoreVlog = async row => {
	if (!row || !row.vlogId) {
		ElMessage.error("视频ID不能为空");
		return;
	}

	// 处理 null/undefined 的情况，以及字符串 '1' 的情况
	const isCurrentlyDeleted = row.isDeleted === 1 || row.isDeleted === "1";
	const actionText = isCurrentlyDeleted ? "恢复" : "删除";
	const confirmText = isCurrentlyDeleted
		? "确定要恢复该视频吗？恢复后视频将可以正常显示。"
		: "确定要删除该视频吗？删除后视频将无法显示，但数据会保留。";

	try {
		await ElMessageBox.confirm(confirmText, `确认${actionText}`, {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		deleteOrRestoreLoadingMap[row.vlogId] = true;
		const res = await deleteOrRestoreVlog(row.vlogId);

		if (res.data && res.data.success) {
			ElMessage.success(`${actionText}成功`);
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || `${actionText}失败`);
		}
	} catch (error) {
		if (error !== "cancel") {
			console.error(`${actionText}视频失败:`, error);
			ElMessage.error(error.response?.data?.msg || `${actionText}失败，请稍后重试`);
		}
	} finally {
		deleteOrRestoreLoadingMap[row.vlogId] = false;
	}
};

// 排序类型状态（0-创建时间，1-点赞数，2-评论数）
const sortType = ref(null);
const sortTypeLoading = ref(false);
const setSortTypeLoading = ref(false);

// 枚举名称到数字的映射
const sortTypeEnumMap = {
	CREATED_TIME: 0, // 创建时间
	LIKE_COUNTS: 1, // 点赞数
	COMMENTS_COUNTS: 2 // 评论数
};

// 将后端返回的排序类型转换为数字
const convertSortTypeToNumber = data => {
	// 如果返回的是对象，尝试获取 type 字段
	if (data && typeof data === "object") {
		// 如果对象有 type 字段且是数字
		if (data.type !== undefined && data.type !== null) {
			if (typeof data.type === "number") {
				return data.type;
			}
			// 如果 type 是字符串枚举名称，进行映射
			if (typeof data.type === "string" && sortTypeEnumMap[data.type] !== undefined) {
				return sortTypeEnumMap[data.type];
			}
		}
		// 如果对象本身是枚举名称（检查对象的 name 或其他字段）
		if (data.name && sortTypeEnumMap[data.name] !== undefined) {
			return sortTypeEnumMap[data.name];
		}
	}

	// 如果直接是数字
	if (typeof data === "number") {
		return data;
	}

	// 如果直接是字符串枚举名称
	if (typeof data === "string" && sortTypeEnumMap[data] !== undefined) {
		return sortTypeEnumMap[data];
	}

	return null;
};

// 获取当前排序类型
const fetchSortType = async () => {
	try {
		sortTypeLoading.value = true;
		const res = await getVlogSortType();
		if (res.data && res.data.success && res.data.data) {
			const sortTypeData = res.data.data;
			console.log("【视频管理】获取到的排序类型数据:", sortTypeData);

			// 转换为数字
			const typeNumber = convertSortTypeToNumber(sortTypeData);
			if (typeNumber !== null) {
				sortType.value = typeNumber;
				console.log("【视频管理】已填充排序类型:", sortType.value);
			} else {
				console.warn("【视频管理】无法解析排序类型数据:", sortTypeData);
			}
		}
	} catch (error) {
		console.error("获取排序类型失败:", error);
		// 不显示错误提示，因为可能是首次使用，Redis 中没有值
	} finally {
		sortTypeLoading.value = false;
	}
};

// 设置排序类型（点击设置按钮时调用）
const handleSetSortType = async () => {
	if (sortType.value === null || sortType.value === undefined) {
		ElMessage.warning("请先选择排序规则");
		return;
	}

	try {
		setSortTypeLoading.value = true;
		const res = await setVlogSortType(sortType.value);
		if (res.data && res.data.success) {
			ElMessage.success("排序规则设置成功");
			// 刷新页面
			if (refreshCurrentPage) {
				setTimeout(() => {
					keepAliveStore.removeKeepLiveName(route.name);
					refreshCurrentPage(false);
					nextTick(() => {
						keepAliveStore.addKeepLiveName(route.name);
						refreshCurrentPage(true);
					});
				}, 0);
			} else {
				// 如果没有刷新函数，则刷新列表数据
				handleSearch();
			}
		} else {
			ElMessage.error(res.data?.msg || "排序规则设置失败");
			// 恢复原值
			await fetchSortType();
		}
	} catch (error) {
		console.error("设置排序类型失败:", error);
		ElMessage.error(error.response?.data?.msg || "排序规则设置失败，请稍后重试");
		// 恢复原值
		await fetchSortType();
	} finally {
		setSortTypeLoading.value = false;
	}
};

onMounted(() => {
	handleSearch();
	// 获取当前排序类型
	fetchSortType();
});

// 使用 onActivated 确保每次激活页面时都自动请求（适用于 keep-alive 缓存的页面）
onActivated(() => {
	// 每次激活页面时自动请求列表
	handleSearch();
	// 获取当前排序类型
	fetchSortType();
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
