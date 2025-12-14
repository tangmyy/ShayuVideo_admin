<template>
	<div class="right-menu">
		<Transition name="right-menu-item" @before-enter="onBeforeEnter">
			<div v-show="visible" :style="menuStyle" class="right-menu-item">
				<ul class="menu-list">
					<template v-for="item in props.menuItems" :key="item.key">
						<li v-if="!item.children" class="menu-item" :class="{ 'is-disabled': item.disabled }" @click="handleMenuClick(item)">
							<el-icon v-if="item.icon">
								<component :is="item.icon" />
							</el-icon>
							<span class="menu-label">{{ item.label }}</span>
						</li>
						<li v-else class="menu-item r-menu">
							<div class="menu-title">
								<el-icon v-if="item.icon">
									<component :is="item.icon" />
								</el-icon>
								<span class="menu-label">{{ item.label }}</span>
								<el-icon>
									<ArrowRight />
								</el-icon>
							</div>
							<ul class="r-menu-list">
								<li
									v-for="child in item.children"
									:key="child.key"
									class="menu-item"
									:class="{ 'is-disabled': child.disabled }"
									@click="handleMenuClick(child)"
								>
									<el-icon v-if="child.icon">
										<component :is="child.icon" />
									</el-icon>
									<span class="menu-label">{{ child.label }}</span>
								</li>
							</ul>
						</li>
					</template>
				</ul>
			</div>
		</Transition>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	menuItems: {
		type: Array,
		required: true
	}
});

const emit = defineEmits(["select"]);

const visible = ref(false);
const position = ref({ x: 0, y: 0 });

const menuStyle = computed(() => ({
	position: "fixed",
	left: `${position.value.x}px`,
	top: `${position.value.y}px`,
	zIndex: 2000
}));

const show = e => {
	e.preventDefault();
	position.value = { x: e.clientX, y: e.clientY };
	visible.value = true;
	document.addEventListener("click", hide, { once: true });
};

const hide = () => {
	visible.value = false;
};

const handleMenuClick = item => {
	if (item.disabled) return;
	emit("select", item);
	hide();
};

// 添加动画钩子函数
const onBeforeEnter = el => {
	el.style.transformOrigin = "top left";
};
defineExpose({
	show,
	hide
});
</script>

<style lang="scss" scoped>
.right-menu {
	.right-menu-item {
		min-width: 120px;
		padding: 4px 0;
		background: var(--el-bg-color);
		border-radius: var(--el-border-radius-base);
		box-shadow: var(--el-box-shadow-light);

		.menu-list {
			padding: 0;
			padding: 5px;
			margin: 0;
			list-style: none;

			.menu-item {
				position: relative;
				display: flex;
				align-items: center;
				height: 32px;
				padding: 0 16px;
				font-size: 13px;
				color: var(--el-text-color-primary);
				cursor: pointer;
				border-radius: 4px;

				&:hover {
					background-color: #252f4a10;
				}

				.el-icon {
					margin-right: 8px;
					font-size: 16px;
					color: #252f4a;
				}

				.menu-label {
					color: #252f4a;
				}

				&.is-disabled {
					color: var(--el-text-color-disabled);
					cursor: not-allowed;
					background-color: transparent !important;

					.el-icon {
						color: var(--el-text-color-disabled) !important;
					}

					.menu-label {
						color: var(--el-text-color-disabled) !important;
					}
				}

				&.r-menu {
					position: relative;

					&:hover {
						.r-menu-list {
							display: block;
						}
					}

					.menu-title {
						display: flex;
						align-items: center;
						width: 100%;

						.el-icon:last-child {
							margin-left: auto;
							font-size: 12px;
						}
					}

					.r-menu-list {
						position: absolute;
						top: 0;
						left: 100%;
						display: none;
						min-width: 150px;
						padding: 4px 0;
						list-style: none;
						background: var(--el-bg-color);
						border-radius: var(--el-border-radius-base);
						box-shadow: var(--el-box-shadow-light);

						.menu-item {
							&:hover {
								background-color: var(--el-menu-hover-bg-color);
							}
						}
					}
				}
			}
		}
	}

	.right-menu-item-enter-active,
	.right-menu-item-leave-active {
		transition: all 0.1s ease-out;
	}

	.right-menu-item-enter-from,
	.right-menu-item-leave-to {
		opacity: 0;
		transform: scale(0.9);
	}

	.right-menu-item-enter-to,
	.right-menu-item-leave-from {
		opacity: 1;
		transform: scale(1);
	}
}
</style>
