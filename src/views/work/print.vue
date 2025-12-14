<template>
	<div class="card" style="display: flex;">
		<div style="flex: 1">
			<el-button type="primary" @click="bindPrint">基于print打印，不带分页</el-button>
			<div id="printTable">
				<p>vue-diverse-admin</p>
			</div>
		</div>
		<div style="flex: 1">
			<el-button type="primary" @click="bindPrintPdf">浏览器原生打印，带分页</el-button>
			<div ref="htmlRef">
				<p>夜幕降临，华灯初上。在这座城市的每一个角落，灯光如同繁星般闪烁，照亮了夜晚的街道。而在无数灯火之中，有一盏灯显得格外温馨，它不仅照亮了我的回家路，更给予了我无尽的温暖与力量。</p>
				<p style="page-break-before: always;">生活中总有那么几盏灯，在不经意间为我们点亮前行的道路，给予我们勇气与希望。无论是家庭的港湾，还是陌生人的善意，这些温暖的力量都值得我们去珍惜、去传递。让我们怀着感恩的心，成为别人生命中的一盏明灯，共同编织出更加美好的未来。因为在爱的光芒照耀下，世界将会变得更加光明与美好。</p>
			</div>

		</div>
	</div>
</template>
<script setup name="print">
import { ref } from "vue";
import printJS from "print-js";
import print from "@/utils/printPdf";

const htmlRef = ref(null);

const bindPrint = () => {
	printJS({
		printable: "printTable",
		type: "html",
		header: null,
		targetStyles: ["*"],
		style: "@page {margin:0 10mm}"
	});
};

const bindPrintPdf = async () => {
    await print.printHtml(htmlRef.value.innerHTML);
};
</script>
