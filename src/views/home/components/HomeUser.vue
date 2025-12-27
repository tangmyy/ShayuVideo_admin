<template>
	<div class="user">
		<div class="greet">{{ getTimeState() }}~ {{ adminName }}</div>
		<img
			v-if="adminInfo && adminInfo.avatar"
			class="image"
			:src="adminInfo.avatar"
			alt=""
		/>
		<div v-else class="image image-placeholder">
			<el-icon class="placeholder-icon"><User /></el-icon>
		</div>
		<div class="info">
			<div class="name">{{ adminName }}</div>
			<div class="introduce">
				<el-link type="primary">{{ APPNAME }}</el-link>
				由vue3 + vite + element-plus，自定义主题颜色。界面设置配置。支持4种Layouts布局切换。i18n等...
			</div>
			<div class="introduce">
				后端接口文档地址：<el-link :href="url" target="_blank" type="danger">{{ url }}</el-link>
			</div>
			<el-tag>前端韭菜</el-tag>
		</div>
	</div>
</template>
<script setup>
import { computed } from "vue";
import { User } from "@element-plus/icons-vue";
import { APP_NAME } from "@/config/config";
import { GlobalStore } from "@/stores";
import { getTimeState } from "@/utils/util.js";

const APPNAME = APP_NAME;
const url = "http://tmyyy.top:8088/doc.html#/home";

const globalStore = GlobalStore();

// 获取管理员信息
const adminInfo = computed(() => globalStore.adminInfo);

// 获取管理员名称
const adminName = computed(() => {
	if (adminInfo.value) {
		return adminInfo.value.realName || adminInfo.value.username || "管理员";
	}
	return "管理员";
});
</script>
<style lang="scss" scoped>
.user {
	background-color: var(--el-bg-color);
	border: 1px solid var(--el-border-color-light);
	border-radius: 4px;
	box-shadow: 0 0 12px rgb(0 0 0 / 5%);
	text-align: center;
	padding: 16px;
	height: 341px;
	.greet {
		text-align: left;
		display: flex;
		align-items: center;
	}
	.image {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin: 36px auto 0;
		display: block;
		object-fit: cover;
	}
	.image-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f0f0f0;
		margin: 36px auto 0;
		.placeholder-icon {
			font-size: 40px;
			color: #999;
		}
	}
	.info {
		.name {
			font-weight: bold;
			margin-top: 8px;
		}
		.introduce {
			font-size: 13px;
			color: #92959b;
			margin: 8px 0;
		}
	}
}
</style>
