<template>
	<div class="region art-custom-card">
		<el-table :data="tableData" height="374px" v-loading="loading">
			<template #default>
				<el-table-column label="名称" prop="avatar" width="150px">
					<template #default="scope">
						<div style="display: flex; align-items: center">
							<img class="avatar" :src="scope.row.face || defaultAvatar" :onerror="handleImageError" />
							<span class="user-name">{{ scope.row.nickname || scope.row.username }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="排行榜">
					<template #header>
						<div class="table-header-wrapper">
							<span>排行榜</span>
							<el-radio-group v-model="sortType" size="small" @change="handleSortTypeChange">
								<el-radio-button label="videos">视频</el-radio-button>
								<el-radio-button label="fans">粉丝</el-radio-button>
							</el-radio-group>
						</div>
					</template>
					<template #default="scope">
						<div class="progress-wrapper">
							<el-progress :percentage="scope.row.pro" :color="scope.row.color" :stroke-width="4" :show-text="false" />
							<span class="count-text">
								{{ sortType === 'fans' ? `${scope.row.fansCount || 0}个粉丝` : `${scope.row.videoCount || 0}个视频` }}
							</span>
						</div>
					</template>
				</el-table-column>
			</template>
		</el-table>
	</div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import defaultAvatar from "@/assets/images/403.png";
import { getActiveUsers } from "@/api/home.js";
import { ElMessage } from "element-plus";

const loading = ref(false);
const tableData = reactive([]);
const sortType = ref("videos"); // 默认显示视频排行榜

// 颜色数组，用于进度条
const colors = ["#f05e53", "#926fd0", "#7ab9eb", "#f0c17b", "#8be38f", "#f19e83", "#8392e6", "#e6a3d3", "#a3d3e6", "#d3e6a3"];

// 切换排行榜类型
const handleSortTypeChange = (value) => {
	fetchActiveUsers();
};

// 处理图片加载错误
const handleImageError = event => {
	event.target.src = defaultAvatar;
};

// 获取活跃用户数据
const fetchActiveUsers = async () => {
	try {
		loading.value = true;
		const res = await getActiveUsers({
			limit: 10,
			sortBy: sortType.value // 根据当前选择的类型排序
		});

		console.log("API 返回数据:", res);

		// 处理返回数据
		let userList = [];
		if (res.data && res.data.data) {
			userList = Array.isArray(res.data.data) ? res.data.data : [];
		} else if (Array.isArray(res.data)) {
			userList = res.data;
		}

		console.log("解析后的用户列表:", userList);
		// 打印第一个用户的完整结构，方便调试
		if (userList.length > 0) {
			console.log("第一个用户的完整数据:", JSON.stringify(userList[0], null, 2));
		}

		if (userList.length === 0) {
			console.warn("未获取到用户数据");
			ElMessage.warning("暂无活跃用户数据");
			return;
		}

		// 根据排序类型获取对应的数值
		const getCount = user => {
			if (sortType.value === "fans") {
				// 粉丝数：后端返回的字段名是 fansCounts（复数）
				const count =
					user.fansCounts !== undefined
						? user.fansCounts
						: user.fansCount !== undefined
						? user.fansCount
						: user.fans !== undefined
						? user.fans
						: user.fanCount !== undefined
						? user.fanCount
						: user.followerCount !== undefined
						? user.followerCount
						: 0;
				return Number(count) || 0;
			} else {
				// 视频数：后端返回的字段名是 videoNumCount
				const count =
					user.videoNumCount !== undefined
						? user.videoNumCount
						: user.videoCount !== undefined
						? user.videoCount
						: user.videos !== undefined
						? user.videos
						: user.videoCount !== undefined
						? user.videoCount
						: 0;
				return Number(count) || 0;
			}
		};

		const counts = userList.map(user => getCount(user));
		const maxCount = counts.length > 0 ? Math.max(...counts) : 0;

		console.log(`所有用户的${sortType.value === 'fans' ? '粉丝数' : '视频数'}:`, counts);
		console.log(`最高${sortType.value === 'fans' ? '粉丝数' : '视频数'}:`, maxCount);

		// 清空并填充数据
		tableData.length = 0;
		userList.forEach((user, index) => {
			const count = getCount(user);
			// 计算进度百分比：最高值为100%，其余按比例
			let percentage = 0;
			if (maxCount > 0) {
				percentage = Math.round((count / maxCount) * 100);
			} else {
				percentage = 0;
			}

			console.log(`用户 ${index}:`, {
				nickname: user.nickname || user.username,
				count,
				percentage,
				user: user // 打印完整用户对象以便调试
			});

			tableData.push({
				...user,
				username: user.nickname || user.username || "未知用户",
				nickname: user.nickname || user.username || "未知用户",
				face: user.face || user.avatar || defaultAvatar,
				fansCount: sortType.value === "fans" ? count : (user.fansCounts || 0),
				videoCount: sortType.value === "videos" ? count : (user.videoNumCount || 0),
				fansCounts: user.fansCounts, // 保留原始字段
				videoNumCount: user.videoNumCount, // 保留原始字段
				percentage: percentage,
				pro: percentage, // 直接设置进度值，不再使用动画延迟
				color: colors[index % colors.length]
			});
		});

		console.log("最终表格数据:", tableData);
		console.log(
			"进度条值检查:",
			tableData.map(item => ({ nickname: item.nickname, pro: item.pro, percentage: item.percentage }))
		);
	} catch (error) {
		console.error("获取活跃用户失败:", error);
		ElMessage.error("获取活跃用户数据失败");
	} finally {
		loading.value = false;
	}
};

// 添加动画效果（如果需要动画，可以取消注释）
// const addAnimation = () => {
// 	setTimeout(() => {
// 		for (let i = 0; i < tableData.length; i++) {
// 			let item = tableData[i];
// 			tableData[i].pro = item.percentage || 0;
// 			console.log(`设置进度条 ${i}:`, tableData[i].pro);
// 		}
// 	}, 100);
// };

onMounted(() => {
	fetchActiveUsers();
});
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
		object-fit: cover;
	}

	.user-name {
		margin-left: 10px;
	}

	.table-header-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;

		:deep(.el-radio-group) {
			margin-left: auto;
		}

		:deep(.el-radio-button__inner) {
			padding: 5px 15px;
		}
	}

	.progress-wrapper {
		display: flex;
		align-items: center;
		gap: 12px;
		width: 100%;

		:deep(.el-progress) {
			flex: 1;
		}

		.count-text {
			font-size: 14px;
			color: var(--el-text-color-regular);
			white-space: nowrap;
			min-width: 70px;
			text-align: right;
		}
	}
}
</style>
