<template>
	<div class="region art-custom-card">
		<el-table :data="tableData" height="374px">
			<template #default>
				<el-table-column label="名称" prop="avatar" width="150px">
					<template #default="scope">
						<div style="display: flex; align-items: center">
							<img class="avatar" src="@/assets/images/403.png" />
							<span class="user-name">{{ scope.row.username }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="进度">
					<template #default="scope">
						<el-progress :percentage="scope.row.pro" :color="scope.row.color" :stroke-width="4" />
					</template>
				</el-table-column>
			</template>
		</el-table>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import avatar from "@/assets/images/403.png";

const radio2 = ref("本月");

const tableData = reactive([
	{
		username: "打工人",
		percentage: 100,
		pro: 0,
		color: "#f05e53"
	},
	{
		username: "二狗子",
		percentage: 40,
		pro: 0,
		color: "#926fd0"
	},
	{
		username: "五月",
		percentage: 20,
		pro: 0,
		color: "#7ab9eb"
	},
	{
		username: "钢钢",
		percentage: 50,
		pro: 0,
		color: "#f0c17b"
	},
	{
		username: "纯牛马",
		percentage: 70,
		pro: 0,
		color: "#8be38f"
	},
	{
		username: "996",
		percentage: 90,
		pro: 0,
		color: "#f19e83"
	},
	{
		username: "今晚加班",
		percentage: 90,
		pro: 0,
		color: "#8392e6"
	}
]);

onMounted(() => {
	addAnimation();
});

const addAnimation = () => {
	setTimeout(() => {
		for (let i = 0; i < tableData.length; i++) {
			let item = tableData[i];
			tableData[i].pro = item.percentage;
		}
	}, 100);
};
</script>

<style lang="scss" scoped>
.region {
	width: 100%;
	height: 371px;
	background-color: var(--el-bg-color);
	border: 1px solid var(--el-border-color-light);
	border-radius: 4px;
	box-shadow: 0 0 12px rgb(0 0 0 / 5%);
	.any-table {
		box-shadow: none;
	}

	.card-header {
		padding-left: 25px !important;
	}

	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 6px;
	}

	.user-name {
		margin-left: 10px;
	}
}
</style>
