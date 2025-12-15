import { ref } from 'vue';
import { get, cloneDeep } from 'lodash-es';

export function useTable(config) {
  const defaultResponseConfig = {
    tableDataKey: config.tableDataKey || 'data.data',
    totalKey: config.totalKey || 'data.total',
  };
  const { params: requestParams = {} } = config.request;
  const cacheConfig = cloneDeep(config);
  cacheConfig.response = Object.assign({}, defaultResponseConfig, cacheConfig.response || {});
  const {
    pageNumKey = 'page',
    pageSizeKey = 'pageSize',
    handleCustomReset,
    resetApi,
  } = cacheConfig.request;
  let { api } = cacheConfig.request;

  const {
    tableDataKey,
    totalKey,
    handleResponseData,
  } = cacheConfig.response;

  const tableData = ref([]);
  const tableTotal = ref(0);
  const tableLoading = ref(false);
  const params = ref(cloneDeep(requestParams));

  const handleSearch = async (page = 1) => {
    if (pageNumKey in params.value) {
      params.value[pageNumKey] = page;
    }
    if (resetApi) {
      api = resetApi();
    }
    try {
      tableLoading.value = true;
      const res = await api(params.value);
      // axios 返回的数据在 res.data 中
      const responseData = res.data || res;
      
      let list = get(responseData, tableDataKey);
      
      // 确保 list 是数组
      if (!Array.isArray(list)) {
        // 尝试直接从 res.data.data.rows 获取
        if (res.data && res.data.data && res.data.data.rows) {
          list = res.data.data.rows;
        } else {
          list = [];
        }
      }
      
      // 获取总数 - 优先从 res.data.data.records 获取（总记录数）
      let total = 0;
      if (res.data && res.data.data) {
        // 优先使用 records（总记录数）
        total = res.data.data.records || res.data.data.total || 0;
      } else {
        // 备用方案：从配置的路径获取
        total = get(responseData, totalKey) || 0;
      }
      tableTotal.value = Number(total);
      console.log('分页调试 - 总数:', tableTotal.value, '当前页:', params.value[pageNumKey], '每页:', params.value[pageSizeKey]);
      
      if (handleResponseData) {
        const processedData = handleResponseData(list);
        // 如果 handleResponseData 返回了数据，使用返回的数据
        if (Array.isArray(processedData)) {
          list = processedData;
        }
      }
      tableData.value = list;
      return Promise.resolve(res);
    } catch (err) {
      if (err && err.isCancel) {
        setTimeout(() => {
          tableLoading.value = true;
        });
      }
      return Promise.reject(err);
    } finally {
      tableLoading.value = false;
    }
  };
  // 重置查询参数
  const handleReset = () => {
    if (handleCustomReset) {
      params.value = handleCustomReset(
        params.value,
        cloneDeep(requestParams),
      );
    } else {
      params.value = cloneDeep(requestParams);
    }
    return handleSearch();
  };
  //  切换分页大小
  const handleSizeChange = (pageSize) => {
    if (pageSizeKey in (params.value)) {
      params.value[pageSizeKey] = pageSize;
    }
    return handleSearch(1);
  };
  //  切换页码
  const handleCurrentChange = (page) => {
    return handleSearch(page);
  };

  return {
    params,
    tableData,
    tableTotal,
    tableLoading,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
  };
}
