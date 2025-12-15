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
		<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
			<el-table-column prop="id" label="用户ID" width="120" />
			<el-table-column prop="nickname" label="昵称" width="150" />
			<el-table-column prop="mobile" label="手机号" width="130" />
			<el-table-column prop="videoNum" label="视频号" width="130" />
			<el-table-column prop="face" label="头像" width="100">
				<template #default="{ row }">
					<el-image v-if="row.face" :src="row.face" style="width: 50px; height: 50px" fit="cover" :preview-src-list="[row.face]" />
					<span v-else>无头像</span>
				</template>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="80">
				<template #default="{ row }">
					<span>{{ row.sex === 0 ? '女' : row.sex === 1 ? '男' : row.sex === 2 ? '未知' : '未知' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="birthday" label="生日" width="120">
				<template #default="{ row }">
					<span>{{ row.birthday ? new Date(row.birthday).toLocaleDateString() : '-' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="country" label="国家" width="100" />
			<el-table-column prop="province" label="省份" width="120" />
			<el-table-column prop="city" label="城市" width="120" />
			<el-table-column prop="district" label="区县" width="100" />
			<el-table-column prop="description" label="个人简介" min-width="200" show-overflow-tooltip />
			<el-table-column prop="bgImg" label="背景图" width="120">
				<template #default="{ row }">
					<el-image v-if="row.bgImg" :src="row.bgImg" style="width: 100px; height: 50px" fit="cover" :preview-src-list="[row.bgImg]" />
					<span v-else>无背景图</span>
				</template>
			</el-table-column>
			<el-table-column prop="createdTime" label="注册时间" width="180">
				<template #default="{ row }">
					<span>{{ row.createdTime ? new Date(row.createdTime).toLocaleString() : '-' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="updatedTime" label="更新时间" width="180">
				<template #default="{ row }">
					<span>{{ row.updatedTime ? new Date(row.updatedTime).toLocaleString() : '-' }}</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="display: flex; justify-content: flex-end; margin-top: 10px">
			<!-- 临时调试信息 -->
			<div style="margin-right: 20px; padding: 5px; background: #f0f0f0; border-radius: 4px; font-size: 12px;">
				总数: {{ tableTotal }} | 当前页: {{ params.page }} | 每页: {{ params.pageSize }} | 数据条数: {{ tableData.length }}
			</div>
			<el-pagination
				@current-change="(page) => { console.log('页码改变:', page); handleCurrentChange(page); }"
				@size-change="(size) => { console.log('每页数量改变:', size); handleSizeChange(size); }"
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
import { onMounted } from "vue";
import { getUserList } from "@/api/userMgt";
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

onMounted(() => {
	handleSearch();
});
</script>
