<template>
	<div>
		<el-card>
			<el-divider content-position="left">自定义指令控制(单条件)</el-divider>
			<el-button v-authButton="'create'" type="primary">新增</el-button>
			<el-button v-authButton="'remove'" type="danger">删除</el-button>
			<el-divider content-position="left">自定义指令控制(多条件)</el-divider>
			<el-button v-authButton="['create', 'remove']" type="primary">新增</el-button>
			<el-divider content-position="left">Hooks控制</el-divider>
			<el-button v-if="isButton.create" type="primary">新增</el-button>
			<el-button v-if="isButton.remove" type="danger">新增</el-button>
		</el-card>
	</div>
</template>
<script setup>
import { useAuthButtons } from "@/hooks/useAuthButtons";
const isButton = useAuthButtons();
</script>
