<template>
    <section class="tables">
        <el-table :data="data" border v-bind="$attrs" v-on="tableListeners">
            <template v-for="item in tableConfig" :key="item.prop">
                <!-- 自定义列 -->
                <el-table-column v-if="item.btns || item.component || item.getter" v-bind="item" :width="item.width"
                    :align="props.align">
                    <!-- 自定义表头 -->
                    <template v-if="item.headerComponent" #header="{ column, $index }">
                        <component :is="item.headerComponent"
                            v-bind="(item.headerProps && item.headerProps(column, $index)) || {}"></component>
                    </template>

                    <template #default="{ row, column, $index }">
                        <!-- 自定义组件 -->
                        <component v-if="item.component" :is="item.component"
                            v-bind="(item.comProps && item.comProps(row, column, $index)) || {}"></component>

                        <!-- 按钮 -->
                        <div v-else-if="
                            item.btns &&
                            (item.btns.length || typeof item.btns === 'function')
                        ">
                            <el-button v-for="btn in (typeof item.btns === 'function'
                                ? item.btns(row, column, $index)
                                : item.btns)" :key="btn.label" :type="btn.type" :size="item.size" v-bind="btn"
                                @click="btn.fn(row, column, $index)">
                                {{ btn.label }}
                            </el-button>
                        </div>

                        <div v-else>{{ row[item.prop] }}</div>
                    </template>
                </el-table-column>

                <!-- 常规列 -->
                <el-table-column v-else v-bind="item" :width="item.width" :align="props.align">
                    <template v-if="item.headerComponent" #header="{ column, $index }">
                        <component :is="item.headerComponent"
                            v-bind="(item.headerProps && item.headerProps(column, $index)) || {}"></component>
                    </template>
                </el-table-column>
            </template>
        </el-table>

        <!-- 分页 -->
        <div v-if="isShowPagination" style="display: flex;justify-content: flex-end;margin-top: 10px;">
            <el-pagination :page-sizes="[2, 10, 30, 50, 100, 200, 300]" layout="total,sizes, prev, pager,next,jumper"
                v-bind="$attrs"></el-pagination>
        </div>
    </section>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

// 定义 props
const props = defineProps({
    // 表格数据
    data: {
        type: Array,
        default: () => [],
    },
    // 表格组件参数
    tableConfig: {
        type: Array,
        default: () => [],
    },
    // 是否显示分页
    isShowPagination: {
        type: Boolean,
        default: true,
    },
    //  对齐方式
    align: {
        type: String,
        default: ''
    }
});

// 定义 emit
const emit = defineEmits(["selection-change", "table-current-change"]);

// 计算属性：合并事件监听器
const tableListeners = computed(() => ({
    ...props.$attrs,
    "current-change": (currentRow, oldCurrentRow) => {
        emit("table-current-change", currentRow, oldCurrentRow);
    },
}));
</script>