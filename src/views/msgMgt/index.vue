<template>
	<div class="card">
		<el-form :inline="true" :model="params" class="demo-form-inline">
			<el-form-item label="接收用户ID">
				<el-input v-model="params.userId" placeholder="请输入接收消息的用户ID" clearable />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleSearch()">搜索</el-button>
				<el-button type="info" @click="handleReset()">清空</el-button>
			</el-form-item>
		</el-form>

		<el-alert
			v-if="!params.userId"
			type="warning"
			show-icon
			title="请先输入接收消息的用户ID后再搜索消息列表"
			style="margin-bottom: 10px"
		/>

		<div class="table-wrapper">
			<el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
			<el-table-column prop="id" label="消息ID" width="220" show-overflow-tooltip />

			<el-table-column prop="fromNickname" label="发送方昵称" width="160" show-overflow-tooltip />

			<el-table-column prop="fromFace" label="发送方头像" width="120">
				<template #default="{ row }">
					<el-image
						v-if="row.fromFace"
						:src="row.fromFace"
						style="width: 50px; height: 50px; border-radius: 50%"
						fit="cover"
						:preview-src-list="[row.fromFace]"
					/>
					<span v-else>无头像</span>
				</template>
			</el-table-column>

			<el-table-column prop="fromUserId" label="发送方ID" width="220" show-overflow-tooltip />

			<el-table-column prop="toUserId" label="接收方ID" width="220" show-overflow-tooltip />

			<el-table-column prop="msgType" label="消息类型" width="120">
				<template #default="{ row }">
					<el-tag type="info">{{ row.msgType }}</el-tag>
				</template>
			</el-table-column>

			<el-table-column prop="msgContent" label="消息内容" min-width="260">
				<template #default="{ row }">
					<pre style="margin: 0; white-space: pre-wrap">{{ formatMsgContent(row.msgContent) }}</pre>
				</template>
			</el-table-column>

			<el-table-column prop="createTime" label="创建时间" width="190">
				<template #default="{ row }">
					<span>{{ row.createTime ? new Date(row.createTime).toLocaleString() : "-" }}</span>
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

<script setup name="msgMgt">
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getMsgAdminList } from "@/api/msgMgt";
import { useTable } from "@/utils/tableMethod";

// 包一层 API，加调试日志，方便确认是否有请求和返回什么数据
const getMsgAdminListWithDebug = async params => {
	console.log("【msgMgt】发起请求参数:", params);
	try {
		const res = await getMsgAdminList(params);
		console.log("【msgMgt】完整响应对象:", res);
		console.log("【msgMgt】res.data:", res?.data);
		console.log("【msgMgt】res.data.data (消息数组):", res?.data?.data);
		if (Array.isArray(res?.data?.data)) {
			console.log("【msgMgt】消息条数:", res.data.data.length);
		}
		return res;
	} catch (e) {
		console.error("【msgMgt】请求报错:", e);
		console.error("【msgMgt】错误详情:", e.response?.data || e.message);
		throw e;
	}
};

// 使用 useTable 统一管理分页、loading 等
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
		api: getMsgAdminListWithDebug,
		// /msg/admin/list 返回的是 list<MessageMO>
		// axios res.data = { status, msg, success, data: [ ... ] }
		tableDataKey: "data", // 从 res.data 开始取数组
		totalKey: "data.length", // 用长度作为总数（后端返回的是数组）
		params: {
			userId: "", // 必填：接收消息的用户 ID
			page: 1, // 前端从 1 开始
			pageSize: 10
		}
	}
});

// 包一层，防止 userId 为空时直接请求报错
const handleSearch = () => {
	console.log("【msgMgt】当前查询参数 params.value:", params.value);
	if (!params.value.userId) {
		ElMessage.warning("请先输入接收消息的用户ID");
		return;
	}
	console.log("【msgMgt】开始调用 baseHandleSearch");
	baseHandleSearch();
};

// 格式化 msgContent（Map）为更易读的字符串
const formatMsgContent = content => {
	if (!content) return "-";
	try {
		if (typeof content === "string") return content;
		return JSON.stringify(content, null, 2);
	} catch {
		return String(content);
	}
};

onMounted(() => {
	// 默认不自动查询，避免 userId 为空
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
