<template>
	<div class="count">
		<div class="count-title">
			<div>{{ list.name }}</div>
			<el-tag class="ml-2" :type="list.type">{{ list.date }}</el-tag>
		</div>
		<ul class="count-info">
			<li class="count-info-item">
				<div class="font-26" style="margin-left: -6px">
					<CountTo prefix="" :end-val="list.count" />
				</div>
				<div class="count-info-item-icon">
					<img :src="list.icon" alt="" style="margin-left: 6px" />
				</div>
			</li>
			<li class="count-info-item">
				<div class="font-16">{{ list.name }}</div>
				<div class="font-16">
					<!-- <CountTo :endVal="list.count" style="font-size:16px;"/> -->
				</div>
			</li>
		</ul>
	</div>
</template>
<script setup>
import CountTo from "@/components/CountTo";
defineProps({
	list: {
		type: Object,
		default() {
			return {
				name: "xxx",
				date: "xxx",
				type: "",
				count: 999,
				icon: "@/assets/images/see.png"
			};
		}
	}
});
</script>

<style lang="scss" scoped>
.font-26 {
	font-size: 26px;
}
.font-16 {
	font-size: 16px;
}

.count {
	box-sizing: border-box;
	background: var(--el-bg-color);
	box-shadow: 0 0 12px rgb(0 0 0 / 5%);
	border: 1px solid var(--el-border-color-light);
	margin-bottom: 6px;
	height: 185px;
	.count-title {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #f0f0f0;
		padding: 8px 16px;
	}
	.count-info {
		padding: 16px 32px;
		color: var(--el-text-color-primary);
		.count-info-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 16px;
			text-align: center;
			.count-info-item-icon {
				width: 40px;
				height: 40px;
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
