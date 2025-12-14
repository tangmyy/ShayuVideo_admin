<template>
	<img src="@/assets/svg/pifu.svg" style="width: 20x; height: 20px; cursor: pointer" @click="openDrawer" />
</template>

<script setup>
import mittBus from "@/utils/mittBus";
const openDrawer = () => {
	mittBus.emit("openThemeDrawer");
};
</script>
