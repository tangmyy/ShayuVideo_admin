<template>
	<div class="card">
		<el-form :inline="true" :model="params" class="demo-form-inline">
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
		</el-form>
		<div class="table-wrapper">
			<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
				<el-table-column prop="id" label="用户ID" width="120" />
				<el-table-column prop="nickname" label="昵称" width="150" />
				<el-table-column prop="mobile" label="手机号" width="130" />
				<el-table-column prop="videoNum" label="视频号" width="130" />
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
				<el-table-column label="操作" width="120" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" size="small" @click="handleEdit(row)">修改</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 编辑用户对话框 -->
		<el-dialog v-model="dialogVisible" title="修改用户信息" width="600px" :close-on-click-modal="false">
			<el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
				<el-form-item label="用户ID" prop="id">
					<el-input v-model="editForm.id" disabled />
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="editForm.nickname" placeholder="请输入昵称" clearable />
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile" placeholder="请输入手机号" clearable />
				</el-form-item>
				<el-form-item label="头像URL" prop="face">
					<el-input v-model="editForm.face" placeholder="请输入头像URL" clearable />
					<el-image
						v-if="editForm.face"
						:src="editForm.face"
						style="width: 50px; height: 50px; margin-top: 5px"
						fit="cover"
						:preview-src-list="[editForm.face]"
					/>
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
				<el-form-item label="背景图URL" prop="bgImg">
					<el-input v-model="editForm.bgImg" placeholder="请输入背景图URL" clearable />
					<el-image
						v-if="editForm.bgImg"
						:src="editForm.bgImg"
						style="width: 100px; height: 50px; margin-top: 5px"
						fit="cover"
						:preview-src-list="[editForm.bgImg]"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
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
import { onMounted, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getUserList, updateUserInfo } from "@/api/userMgt";
import { useTable } from "@/utils/tableMethod";

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
const editForm = reactive({
	id: "",
	nickname: "",
	mobile: "",
	face: "",
	sex: undefined,
	birthday: "",
	country: "",
	province: "",
	city: "",
	district: "",
	description: "",
	bgImg: ""
});

// 表单验证规则
const editFormRules = {
	id: [{ required: true, message: "用户ID不能为空", trigger: "blur" }]
};

// 打开编辑对话框
const handleEdit = row => {
	// 填充表单数据
	editForm.id = row.id || "";
	editForm.nickname = row.nickname || "";
	editForm.mobile = row.mobile || "";
	editForm.face = row.face || "";
	editForm.sex = row.sex !== undefined && row.sex !== null ? row.sex : undefined;
	editForm.birthday = row.birthday ? new Date(row.birthday).toISOString().split("T")[0] : "";
	editForm.country = row.country || "";
	editForm.province = row.province || "";
	editForm.city = row.city || "";
	editForm.district = row.district || "";
	editForm.description = row.description || "";
	editForm.bgImg = row.bgImg || "";
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

		// 构建提交数据，只包含有值的字段
		const submitData = {
			id: editForm.id
		};

		if (editForm.nickname) submitData.nickname = editForm.nickname;
		if (editForm.mobile) submitData.mobile = editForm.mobile;
		if (editForm.face) submitData.face = editForm.face;
		if (editForm.sex !== undefined && editForm.sex !== null) submitData.sex = editForm.sex;
		if (editForm.birthday) submitData.birthday = editForm.birthday;
		if (editForm.country) submitData.country = editForm.country;
		if (editForm.province) submitData.province = editForm.province;
		if (editForm.city) submitData.city = editForm.city;
		if (editForm.district) submitData.district = editForm.district;
		if (editForm.description) submitData.description = editForm.description;
		if (editForm.bgImg) submitData.bgImg = editForm.bgImg;

		const res = await updateUserInfo(submitData);

		if (res.data && res.data.success) {
			ElMessage.success("修改成功");
			dialogVisible.value = false;
			// 刷新列表
			handleSearch();
		} else {
			ElMessage.error(res.data?.msg || "修改失败");
		}
	} catch (error) {
		console.error("修改用户信息失败:", error);
		ElMessage.error(error.response?.data?.msg || "修改失败，请稍后重试");
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
