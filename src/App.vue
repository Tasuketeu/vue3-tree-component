<template>
	<div id="app">
		<h1>Tree Table</h1>
		<TreeTable :items="mockItems" />
	</div>
</template>

<script setup lang="ts">
	import TreeTable from '@/components/treetable/TreeTable.vue';
	import { mockItems } from '@/mockData';
</script>

<style>
	#app {
		font-family: Arial, sans-serif;
		padding: 20px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	#app h1 {
		margin-bottom: 20px;
	}
</style>
