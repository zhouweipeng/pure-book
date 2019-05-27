<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'app'
	}
</script>

<style lang="less">
	.auto_img{
		width: 100%;
		display: block;
	}
	.auto-img{
		height: 100%;
		display: block;
	}
	.nowrap{
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.line2{
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	.noMP{
		margin: 0;
		padding: 0;
	}
</style>
