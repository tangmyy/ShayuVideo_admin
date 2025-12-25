<template>
	<div class="app-container">
		<el-row :gutter="10">
			<el-col :xs="24" :sm="24" :md="8" :lg="8">
				<HomeUser />
			</el-col>
			<el-col :xs="24" :sm="24" :md="5" :lg="5">
				<HomeCount :list="countList[0]" />
				<HomeCount :list="countList[1]" />
			</el-col>
			<el-col :xs="24" :sm="24" :md="5" :lg="5">
				<HomeCount :list="countList[2]" />
				<HomeCount :list="countList[3]" />
			</el-col>
			<el-col :xs="24" :sm="24" :md="6" :lg="6">
				<HomeList />
			</el-col>
			<el-col :xs="24" :sm="24" :md="8" :lg="8">
				<HomeTable />
			</el-col>
			<el-col :xs="24" :sm="24" :md="16" :lg="16">
				<HomeLine />
			</el-col>
			<el-col :xs="24" :sm="24" :md="24" :lg="24">
				<HomeLine />
			</el-col>
		</el-row>
	</div>
</template>

<script setup name="home">
import { ref, reactive, onMounted } from "vue";
import HomeUser from "./components/HomeUser.vue";
import HomeCount from "./components/HomeCount.vue";
import HomeList from "./components/HomeList.vue";
import HomeLine from "./components/HomeLine.vue";
import HomeTable from "./components/HomeTable.vue";
import { getCommentCounts, getLikeCounts } from "@/api/countsMgt";

const countList = reactive([
	{
		name: "点赞量",
		date: "总",
		type: "primary",
		count: 0, // 初始值为0，将从后端获取
		icon: new URL("@/assets/images/money.png", import.meta.url).href
	},
	{
		name: "视频数量",
		date: "总",
		type: "success",
		count: 21999,
		icon: new URL("@/assets/images/see.png", import.meta.url).href
	},
	{
		name: "评论量",
		date: "总",
		type: "warning",
		count: 0, // 初始值为0，将从后端获取
		icon: new URL("@/assets/images/pie.png", import.meta.url).href
	},
	{
		name: "账号数量",
		date: "总",
		type: "danger",
		count: 18999,
		icon: new URL("@/assets/images/upload.png", import.meta.url).href
	}
]);

// 获取点赞总量
const fetchLikeCounts = async () => {
	try {
		const res = await getLikeCounts();
		if (res.data && res.data.success && res.data.data !== undefined) {
			countList[0].count = Number(res.data.data) || 0;
		}
	} catch (error) {
		console.error("获取点赞总量失败:", error);
		// 失败时保持默认值0
	}
};

// 获取评论总量
const fetchCommentCounts = async () => {
	try {
		const res = await getCommentCounts();
		if (res.data && res.data.success && res.data.data !== undefined) {
			countList[2].count = Number(res.data.data) || 0;
		}
	} catch (error) {
		console.error("获取评论总量失败:", error);
		// 失败时保持默认值0
	}
};

onMounted(() => {
	fetchLikeCounts();
	fetchCommentCounts();
});
</script>
