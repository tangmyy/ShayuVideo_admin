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
      let list = get(res, tableDataKey);
      
      tableTotal.value = Number(get(res, totalKey) || 0);
      if (handleResponseData) {
        handleResponseData(list);
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
