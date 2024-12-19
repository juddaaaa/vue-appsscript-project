<script setup lang="ts">
import { onMounted } from "vue"
import { storeToRefs } from "pinia"
import { useChangesStore } from "@/stores/ChangesStore"

const changesStore = useChangesStore()
const { createChange, refreshChanges, updateChange } = changesStore
const { closed, open, pending } = storeToRefs(changesStore)

onMounted(() => {
	updateChange({ mr_number: 6618, columns: { wip_check: true } })
	refreshChanges()
})
</script>

<template>
	<button @click="createChange">Create Change</button>
	<pre>
		<code>
{{ pending }}
{{ open }}
{{ closed }}
		</code>
	</pre>
</template>
