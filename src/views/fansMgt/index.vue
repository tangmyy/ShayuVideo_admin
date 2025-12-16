<template>
  <div class="card">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="用户ID">
        <el-input v-model="params.myId" placeholder="请输入要查看粉丝的用户ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch()">搜索</el-button>
        <el-button type="info" @click="handleReset()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-alert
      v-if="!params.myId"
      type="warning"
      show-icon
      title="请先输入用户ID后再搜索粉丝列表"
      style="margin-bottom: 10px"
    />

    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
      <el-table-column prop="fanId" label="粉丝ID" width="200" show-overflow-tooltip />

      <el-table-column prop="nickname" label="粉丝昵称" width="160" show-overflow-tooltip />

      <el-table-column prop="face" label="粉丝头像" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.face"
            :src="row.face"
            style="width: 50px; height: 50px; border-radius: 50%"
            fit="cover"
            :preview-src-list="[row.face]"
          />
          <span v-else>无头像</span>
        </template>
      </el-table-column>

      <el-table-column prop="isFriend" label="是否互相关注" width="120">
        <template #default="{ row }">
          <el-tag :type="row.isFriend ? 'success' : 'info'">
            {{ row.isFriend ? "互相关注" : "非互关" }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 10px">
      <div style="margin-right: 20px; font-size: 12px; color: #999;">
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
      myId: "",  // 必填：查看该用户的粉丝列表
      page: 1,
      pageSize: 10
    }
  }
});

// 包一层，防止 myId 为空时直接请求报错
const handleSearch = () => {
  if (!params.value.myId) {
    ElMessage.warning("请先输入用户ID");
    return;
  }
  baseHandleSearch();
};

onMounted(() => {
  // 默认不自动查询，避免 myId 为空
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


