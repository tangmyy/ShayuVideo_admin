<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="请输入用户名">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input 
				v-model="loginForm.password" 
				type="password" 
				placeholder="请输入密码" 
				show-password 
				autocomplete="new-password"
				@keyup.enter="login(loginFormRef)"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button size="large" type="primary" :loading="loading" @click="login(loginFormRef)"> 登录 </el-button>
		<el-button size="large" @click="resetForm(loginFormRef)">重置</el-button>
	</div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElNotification, ElMessage } from "element-plus";
import { GlobalStore } from "@/stores";
import { TabsStore } from "@/stores/modules/tabs";
import { HOME_URL } from "@/config/config";
import { adminLogin } from "@/api/login";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { KeepAliveStore } from "@/stores/modules/keepAlive";

const router = useRouter();
const tabsStore = TabsStore();
const globalStore = GlobalStore();
const keepAlive = KeepAliveStore();

// 定义 formRef（校验规则）
const loginFormRef = ref();
const loginRules = reactive({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive({ username: "", password: "" });
const login = formEl => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			const res = await adminLogin({
				username: loginForm.username,
				password: loginForm.password
			});
			
			if (res.data && res.data.success) {
				const adminData = res.data.data;
				// 保存token和管理员信息
				globalStore.setToken(adminData.adminToken || "");
				globalStore.setAdminInfo({
					id: adminData.id,
					username: adminData.username,
					email: adminData.email,
					realName: adminData.realName,
					avatar: adminData.avatar,
					adminToken: adminData.adminToken
				});
				
				await initDynamicRouter();
				tabsStore.closeMultipleTab();
				keepAlive.setKeepAliveName();
				router.push(HOME_URL);
				
				ElNotification({
					title: "登录成功",
					message: `欢迎登录，${adminData.realName || adminData.username}`,
					type: "success",
					duration: 3000
				});
			} else {
				ElMessage.error(res.data?.msg || "登录失败，请检查用户名和密码");
			}
		} catch (error) {
			console.error("登录失败:", error);
			ElMessage.error(error.response?.data?.msg || "登录失败，请稍后重试");
		} finally {
			loading.value = false;
		}
	});
};

// resetForm
const resetForm = formEl => {
	if (!formEl) return;
	formEl.resetFields();
};
</script>

<style scoped lang="scss"></style>
