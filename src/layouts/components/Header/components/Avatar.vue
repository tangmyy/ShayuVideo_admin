<template>
	<el-dropdown trigger="click">
		<div class="avatar">
			<img v-if="adminInfo && adminInfo.avatar" :src="adminInfo.avatar" alt="avatar" />
			<el-icon v-else class="avatar-icon"><User /></el-icon>
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="logout">
					<el-icon><SwitchButton /></el-icon>退出登录
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup>
import { computed } from "vue";
import { User, SwitchButton } from "@element-plus/icons-vue";
import { GlobalStore } from "@/stores";
import { LOGIN_URL } from "@/config/config";
import { useRouter } from "vue-router";
import { adminLogout } from "@/api/login";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const globalStore = GlobalStore();

// 获取管理员信息
const adminInfo = computed(() => globalStore.adminInfo);

// 退出登录
const logout = async () => {
	try {
		await ElMessageBox.confirm("确定要退出登录吗？", "提示", {
			confirmButtonText: "确定",
			cancelButtonText: "取消",
			type: "warning"
		});

		// 如果有管理员ID，调用后端登出接口
		if (adminInfo.value && adminInfo.value.id) {
			try {
				await adminLogout(adminInfo.value.id);
			} catch (error) {
				console.error("登出接口调用失败:", error);
				// 即使接口失败也继续执行本地登出
			}
		}

		// 清除本地存储
		globalStore.setToken("");
		globalStore.setAdminInfo(null);
		router.replace(LOGIN_URL);
		ElMessage.success("已退出登录");
	} catch (error) {
		if (error !== "cancel") {
			console.error("退出登录失败:", error);
		}
	}
};
</script>

<style scoped lang="scss">
.avatar {
	width: 40px;
	height: 40px;
	overflow: hidden;
	cursor: pointer;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f0f0f0;
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.avatar-icon {
		font-size: 24px;
		color: #999;
	}
}
</style>
