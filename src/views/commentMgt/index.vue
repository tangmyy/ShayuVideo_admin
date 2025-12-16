<template>
  <div class="card">
    <el-form :inline="true" :model="params" class="demo-form-inline">
      <el-form-item label="视频ID">
        <el-input v-model="params.vlogId" placeholder="请输入要查看评论的 视频ID" clearable />
      </el-form-item>
      <el-form-item label="评论用户ID(可选)">
        <el-input v-model="params.userId" placeholder="可选：当前登录用户ID" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch()">搜索</el-button>
        <el-button type="info" @click="handleReset()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-alert
      v-if="!params.vlogId"
      type="warning"
      show-icon
      title="请先输入视频ID后再搜索评论列表"
      style="margin-bottom: 10px"
    />

    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
      <el-table-column prop="commentId" label="评论ID" width="180" />
      <el-table-column prop="vlogId" label="视频ID" width="180" />
      <el-table-column prop="fatherCommentId" label="父评论ID" width="180" show-overflow-tooltip />

      <el-table-column prop="commentUserNickname" label="评论用户" width="150" show-overflow-tooltip />

      <el-table-column prop="commentUserFace" label="用户头像" width="110">
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

      <el-table-column prop="content" label="评论内容" min-width="260" show-overflow-tooltip />

      <el-table-column prop="replyedUserNickname" label="被回复用户" width="150" show-overflow-tooltip />

      <el-table-column prop="likeCounts" label="点赞数" width="90" />

      <el-table-column prop="isLike" label="是否点赞" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isLike === 1 ? 'success' : 'info'">
            {{ row.isLike === 1 ? "已点赞" : "未点赞" }}
          </el-tag>
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

<script setup name="commentMgt">
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getCommentAdminList } from "@/api/commentMgt";
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
      vlogId: "", // 必填：需要你在页面上输入某个视频ID
      userId: "", // 可选：当前登录用户ID（管理端可以留空）
      page: 1,
      pageSize: 10
    }
  }
});

// 包一层，防止 vlogId 为空时直接请求报错
const handleSearch = () => {
  // params 是一个 ref，在脚本中需要通过 params.value 访问
  if (!params.value.vlogId) {
    ElMessage.warning("请先输入视频ID");
    return;
  }
  baseHandleSearch();
};

onMounted(() => {
  // 默认不自动查询，避免 vlogId 为空
  // 如果你想默认查询某个视频，可以在这里给 params.vlogId 赋值后再调用 handleSearch()
  // params.vlogId = "某个视频ID";
  // handleSearch();
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


