<script setup lang="ts">
import { onMounted } from "vue"
import { request } from "@/functions/request"
import { useChangesStore } from "@/stores/ChangesStore"

const { refreshChanges } = useChangesStore()

const handleFormSubmit = (event: Event) => {
	event.preventDefault()
	const { target: form } = event

	request("$uploadPdf", form)
		.then(response => {
			console.log(JSON.parse(response))
		})
		.catch(console.error)
}

onMounted(() => {
	refreshChanges()
})
</script>

<template>
	<form @submit="handleFormSubmit">
		<label for="mr_number">MR Number</label>
		<input type="text" inputmode="numeric" name="mr_number" id="mr_number" />
		<label for="attachment"></label>
		<input type="file" name="attachment" id="attachment" />
		<button type="submit">Submit</button>
	</form>
</template>
