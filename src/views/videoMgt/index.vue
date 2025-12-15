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
    </el-table>

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
import { onMounted } from "vue";
import { getVlogAdminList } from "@/api/vlogMgt";
import { useTable } from "@/utils/tableMethod";

const { params, tableTotal, tableData, tableLoading, handleSearch, handleReset, handleSizeChange, handleCurrentChange } =
  useTable({
    request: {
      api: getVlogAdminList,
      // 后端返回：ok(PagedGridResult)，axios res.data = { status, msg, success, data: { page, total, records, rows } }
      tableDataKey: "data.rows",   // 从 res.data 开始取列表
      totalKey: "data.records",    // 从 res.data 开始取总记录数
      params: {
        search: "",
        page: 1,
        pageSize: 10
      }
    }
  });

onMounted(() => {
  handleSearch();
});
</script>


