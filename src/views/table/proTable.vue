<template>
  <div class="card">
    <pro-table ref="multipleTable" align="center" :data="tableData" :tableConfig="tableConfig" :is-show-pagination="true"
      :current-page="pageConfig.page" :page-size="pageConfig.pageSize" :total="pageConfig.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup name="proTable">
import { ref, markRaw, onMounted } from 'vue';
import ProTable from '@/components/ProTable/index.vue';
import { getReqresList } from '@/api/useTable'
import { ElMessage } from "element-plus";

const pageConfig = ref({
  page: 1,
  pageSize: 2,
  total: 0
})

const tableConfig = ref([
  {
    prop: "id",
    label: "ID",
    width: 100
  },
  {
    prop: "first_name",
    label: "名称",
  },
  {
    prop: "email",
    label: "邮箱",
  },
  {
    prop: "avatar",
    label: "头像",
    component: markRaw({
      props: ['avatar'], // 传递 props
      components: { ElImage }, // 注册 ElInput 为局部组件
      template: `
        <el-image :src="avatar" />
      `,
    }),
    comProps: (row, col, index) => {
      return {
        src: row.avatar
      }
    },
    headerComponent: markRaw({
      components: { ElButton }, // 注册 ElInput 为局部组件
      props: ['propFn'], // 传递 props
      template: `
        <div>
          <el-button @click="propFn()">
            自定义表头
          </el-button>
        </div>
      `,
    }),
    headerProps: (col, index) => {
      console.log('表头数据', col, index)
      return {
        propFn: propFn, // 将外部的 propFn 函数传递进去
      };
    },
  },
  {
    prop: 'btns',
    label: '操作',
    width: 140,
    size: 'small',
    btns: [
      {
        label: '编辑',
        type: 'primary',
        fn: (row, col, index) => {
          ElMessage({
            message: row,
            type: "success"
          });
        }
      },
      {
        label: '删除',
        type: 'danger',
        fn: (row, col, index) => {
          ElMessage({
            message: row,
            type: "success"
          });
        }
      }
    ],
  }
]);
const tableData = ref([]);

const handleSizeChange = (val) => {
  pageConfig.value.pageSize = val;
  pageConfig.value.page = 1;
  getGetReqresList();
}
const handleCurrentChange = (val) => {
  pageConfig.value.page = val;
  getGetReqresList();
}
const propFn = () => {
  ElMessage({
    message: "提示消息",
    type: "success"
  });
};
const getGetReqresList = async () => {
  const res = await getReqresList(pageConfig.value);
  pageConfig.value.total = res.data.total
  tableData.value = res.data.data;
}
onMounted(() => {
  getGetReqresList();
})
</script>
