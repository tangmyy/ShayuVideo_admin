<template>
	<div v-waterMarker="waterMarker" style="height: 100%"></div>
</template>
<script setup name="watermark">
import { reactive } from "vue";
const waterMarker = reactive({
	text: "练习前端2年半",
	textColor: "rgba(0,0,0,0.6)"
});
</script>
