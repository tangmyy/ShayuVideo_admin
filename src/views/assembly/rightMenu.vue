<template>
	<div class="page-content">
		<el-button @contextmenu.prevent="e => showMenu(e)">右键触发菜单</el-button>
		<RightMenu ref="menuRef" :menu-items="menuItems" @select="handleSelect" />
	</div>
</template>

<script setup>
import { ref } from "vue";
import RightMenu from "@/components/RightMenu/index.vue";

const menuRef = ref();

// 右键菜单选项（图标为Element Plus图标）
const menuItems = [
	{
		key: "export",
		label: "带图标",
		icon: "Position"
	},
	{
		key: "exportPdf",
		label: "不带图标"
	},
	{
		key: "disabled",
		label: "禁用中",
		disabled: true
	}
];

const handleSelect = item => {
	console.log(item.key);
};

const showMenu = e => {
	menuRef.value.show(e);
};
</script>
