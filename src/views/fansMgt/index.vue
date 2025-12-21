<template>
	<div class="card">
		<el-form :inline="true" :model="params" class="demo-form-inline">
			<el-form-item label="用户ID">
				<el-input v-model="params.myId" placeholder="请输入用户ID（留空则查询所有粉丝关系）" clearable />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch()">搜索</el-button>
				<el-button type="info" @click="handleReset()">清空</el-button>
			</el-form-item>
		</el-form>

		<el-alert v-if="!params.myId" type="info" show-icon title="未输入用户ID，将查询所有粉丝关系" style="margin-bottom: 10px" />

		<div class="table-wrapper">
			<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
				<!-- 使用 FansRelationVO 的字段 -->
				<el-table-column prop="id" label="关系ID" width="180" show-overflow-tooltip />

				<el-table-column prop="vlogerId" label="博主ID" width="180" show-overflow-tooltip />

				<el-table-column prop="vlogerNickname" label="博主昵称" width="160" show-overflow-tooltip />

				<el-table-column prop="vlogerFace" label="博主头像" width="120">
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

				<el-table-column prop="fanId" label="粉丝ID" width="180" show-overflow-tooltip />

				<el-table-column prop="fanNickname" label="粉丝昵称" width="160" show-overflow-tooltip />

				<el-table-column prop="fanFace" label="粉丝头像" width="120">
					<template #default="{ row }">
						<el-image
							v-if="row.fanFace"
							:src="row.fanFace"
							style="width: 50px; height: 50px; border-radius: 50%"
							fit="cover"
							:preview-src-list="[row.fanFace]"
						/>
						<span v-else>无头像</span>
					</template>
				</el-table-column>

				<el-table-column prop="isFanFriendOfMine" label="是否互相关注" width="140">
					<template #default="{ row }">
						<el-tag :type="row.isFanFriendOfMine === 1 ? 'success' : 'info'">
							{{ row.isFanFriendOfMine === 1 ? "互相关注" : "非互关" }}
						</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</div>

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

<script setup name="fansMgt">
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getFansAdminList } from "@/api/fansMgt";
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
		api: getFansAdminList,
		// 后端返回：ok(PagedGridResult)，axios res.data = { status, msg, success, data: { page, total, records, rows } }
		tableDataKey: "data.rows", // 从 res.data 开始取列表
		totalKey: "data.records", // 从 res.data 开始取总记录数
		params: {
			myId: "", // 可选：如果为空则查询所有粉丝关系，否则查询指定用户的粉丝列表
			page: 1,
			pageSize: 10
		}
	}
});

// 直接使用 baseHandleSearch，myId 为空时也可以查询所有粉丝关系
const handleSearch = () => {
	baseHandleSearch();
};

onMounted(() => {
	// 可以自动查询所有粉丝关系
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
