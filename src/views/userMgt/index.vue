<template>
	<div class="card">
		<el-form :inline="true" :model="params" class="demo-form-inline">
			<el-form-item label="Approved by">
				<el-input v-model="params.nane" placeholder="Approved by" />
			</el-form-item>
			<el-form-item label="Activity time">
				<el-date-picker v-model="params.date" value-format="YYYY-MM-DD" type="date" placeholder="Pick a date" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleGet()">搜索</el-button>
				<el-button type="info" @click="handleReset()">清空</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData" style="width: 100%" border v-load="tableLoading">
			<el-table-column prop="email" label="email" width="380" />
			<el-table-column prop="first_name" label="first_name" width="180" />
			<el-table-column prop="last_name" label="last_name" />
		</el-table>
		<div style="display: flex; justify-content: flex-end; margin-top: 10px">
			<el-pagination
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-size="params.pageSize"
				:page-sizes="[2, 5, 10, 1000]"
				v-model:current-page="params.page"
				layout="total,sizes, prev, pager,next,jumper"
				:total="tableTotal"
			>
			</el-pagination>
		</div>
	</div>
</template>
<script setup name="useTable">
import { onMounted } from "vue";
import { getReqresList } from "@/api/useTable";
import { useTable } from "@/utils/tableMethod";
import { ElMessage } from "element-plus";

const { params, tableTotal, tableData, tableLoading, handleSearch, handleReset, handleSizeChange, handleCurrentChange } =
	useTable({
		request: {
			api: getReqresList,
			tableDataKey: "data.data", // list key
			totalKey: "data.total", //  total key
			params: {
				name: "",
				date: "",
				value: "",
				page: 1,
				pageSize: 2
			}
		},
		response: {
			handleResponseData(data) {
				console.log("自定义处理返回data", data);
				// return data.map(v => ({
				//   email: v.email,
				//   first_name: v.first_name,
				//   last_name: v.last_name,
				// }));
			}
		}
	});
const handleGet = () => {
	ElMessage({ type: "success", message: params.value });
	//  执行handleSearch即可
	// handleSearch()
};
onMounted(async () => {
	handleSearch();
});
</script>
