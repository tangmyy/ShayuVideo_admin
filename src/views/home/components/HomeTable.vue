<template>
    <div class="total-revenue-body">
        <div ref="echartsRef" style="height: 100%;"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useEcharts } from "@/hooks/useEcharts";
import echarts from "@/plugins/echarts";

const echartsRef = ref(null);

onMounted(() => {
    let myChart = echarts.init(echartsRef.value);
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: 20,
            right: 3,
            bottom: 0,
            left: 3,
            containLabel: true
        },
        legend: {
            data: [],
            bottom: 0,
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            textStyle: {
                fontSize: 12,
                color: '#222B45'
            }
        },
        xAxis: {
            type: 'category',
            data: ['one', 'two', 'three', 'four', 'five', 'six'],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#889fcc'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
                lineStyle: {
                    color: '#EFF1F3',
                    width: 0.8
                }
            },
            axisLabel: { color: '#889fcc' },
            
        },
        series: [
            {
                name: 'aa',
                type: 'bar',
                data: [11, 23, 15, 15, 6, 10],
                barWidth: '15',
                itemStyle: {
                    color: '#83ddb6',
                    borderRadius: [4, 4, 0, 0]
                }
            },
            {
                name: 'bbb',
                type: 'bar',
                data: [6, 13, 10, 5, 12, 5],
                barWidth: '15',
                itemStyle: {
                    color: '#639dfa',
                    borderRadius: [4, 4, 0, 0]
                }
            }
        ]
    }
    useEcharts(myChart, option);
})

</script>

<style lang="scss" scoped>
.total-revenue-body {
    box-sizing: border-box;
    height: 300px;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}
</style>