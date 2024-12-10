<script setup lang="ts">
import { onMounted, ref } from "vue"
import { request } from "@functions/request"

const msg = ref()

onMounted(() => {
	request("helloWorld", undefined).then((response: string) => {
		msg.value = JSON.parse(response).message
	})
})
</script>

<template>
	<h1>{{ msg }}</h1>
</template>
