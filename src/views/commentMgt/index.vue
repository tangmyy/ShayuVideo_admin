<template>
	<div class="new-page-container">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>新页面</span>
				</div>
			</template>
			<div class="content">
				<h2>欢迎来到新页面！</h2>
				<p>这是在大屏数据下面添加的新页面。</p>
				<p>你可以在这里添加自己的内容。</p>
			</div>
		</el-card>
	</div>
</template>

<script setup name="newPage">
// 页面逻辑代码
</script>

<style lang="scss" scoped>
.new-page-container {
	padding: 20px;
	
	.box-card {
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: bold;
		}
		
		.content {
			padding: 20px;
			
			h2 {
				margin-bottom: 16px;
				color: var(--el-text-color-primary);
			}
			
			p {
				margin-bottom: 12px;
				color: var(--el-text-color-regular);
				line-height: 1.6;
			}
		}
	}
}
</style>

