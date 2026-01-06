<template>
	<div ref="echartsRef" class="card content-box" style="height: 300px" v-loading="loading"></div>
</template>

<script setup name="columnChart">
import { ref, onMounted } from "vue";
import echarts from "@/plugins/echarts";
import { useEcharts } from "@/hooks/useEcharts";
import { getMonthlyVideos } from "@/api/home.js";
import { ElMessage } from "element-plus";

const echartsRef = ref();
const loading = ref(false);
let myChart = null;

// 初始化图表
const initChart = data => {
	if (!myChart) {
		myChart = echarts.init(echartsRef.value);
	}

	// 确保数据是12个月，如果不足则补0
	const monthlyData = Array(12).fill(0);
	if (Array.isArray(data)) {
		data.forEach((item, index) => {
			if (index < 12) {
				monthlyData[index] = Number(item) || 0;
			}
		});
	}

	let option = {
		tooltip: {
			show: true,
			trigger: "axis",
			axisPointer: {
				type: "shadow",
				z: 100,
				shadowStyle: {
					// shadowColor: "rgba(167, 167, 167, 1)",
					// shadowBlur: 10,
					// color: "rgba(255, 255, 255, 1)"
				}
			},
			formatter: function (params) {
				let result = params[0].name + "<br/>";
				params.forEach(function (item) {
					result += item.seriesName + ": " + item.value + "个视频<br/>";
				});
				return result;
			}
		},
		grid: {
			top: 20,
			bottom: 20,
			left: 30,
			right: 20
		},
		xAxis: [
			{
				type: "category",
				axisTick: {
					show: false,
					alignWithLabel: true
				},
				axisLine: {
					lineStyle: {
						color: "#889fcc"
					}
				},
				data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
			}
		],
		yAxis: [
			{
				type: "value",
				splitLine: {
					show: true,
					lineStyle: {
						color: "rgba(136, 159, 204, .2)"
					}
				},
				axisLine: {
					show: false,
					lineStyle: {
						color: "#889fcc"
					}
				},
				axisTick: {
					show: false
				}
			}
		],
		series: [
			{
				name: "视频数量",
				z: 200,
				type: "line",
				smooth: true,
				symbolSize: 15,
				showSymbol: false,
				show: false,
				color: "#3282FF", //改变折线点的颜色
				lineStyle: {
					color: "#3282FF" //改变折线颜色
				},
				label: {
					show: false, //开启显示
					position: "top", //在上方显示
					//数值样式
					color: "#999999",
					fontSize: 10
				},
				emphasis: {
					show: true,
					color: "#3282FF",
					borderColor: "#ffffff",
					label: {
						show: true, //开启显示
						position: "top", //在上方显示
						//数值样式
						color: "#fff",
						fontSize: 14
					}
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "rgba(50,130,255,0.3)"
							},
							{
								offset: 1,
								color: "rgba(50,130,255,0)"
							}
						],
						false
					),
					shadowColor: "rgba(59, 34, 201,1)",
					shadowBlur: 10
				},
				data: monthlyData
			}
		]
	};
	useEcharts(myChart, option);
};

// 获取每月视频数据
const fetchMonthlyVideos = async () => {
	try {
		loading.value = true;
		const currentYear = new Date().getFullYear();
		const res = await getMonthlyVideos(currentYear);

		console.log("每月视频数据:", res);

		// 处理返回数据
		let monthlyData = [];
		if (res.data && res.data.data) {
			monthlyData = Array.isArray(res.data.data) ? res.data.data : [];
		} else if (Array.isArray(res.data)) {
			monthlyData = res.data;
		}

		// 如果后端返回的是对象数组，需要提取数量字段
		if (monthlyData.length > 0 && typeof monthlyData[0] === "object") {
			monthlyData = monthlyData.map(item => item.count || item.videoCount || item.counts || 0);
		}

		console.log("处理后的每月视频数据:", monthlyData);

		// 初始化图表
		initChart(monthlyData);
	} catch (error) {
		console.error("获取每月视频数据失败:", error);
		ElMessage.error("获取每月视频数据失败");
		// 如果接口不存在或出错，使用空数据初始化图表
		initChart([]);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchMonthlyVideos();
});
</script>
