import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { request } from "@/functions/request"
import { MR } from "@/types"

export const useChangesStore = defineStore("changes-store", () => {
  /* STATE */
  const changes = ref()

  /* GETTERS */
  const open = computed(() => changes.value.filter((row: MR) => row.status === "Open"))
  const pending = computed(() => changes.value.filter((row: MR) => row.status === "Pending"))
  const closed = computed(() => changes.value.filter((row: MR) => row.status === "Closed"))

  /* ACTIONS */
  const refreshChanges = (): void => {
    request("$read", undefined)
      .then(response => {
        changes.value = JSON.parse(response)
      })
      .catch(console.error)
  }

  const createChange = (): void => {
    request("$create", undefined)
      .then(response => {
        changes.value = [...changes.value, ...JSON.parse(response)]
      })
      .catch(console.error)
  }

  const updateChange = (args: object): void => {
    console.log(args)
    request("$update", args)
      .then(response => {
        console.log(JSON.parse(response))
      })
  }

  return {
    /* STATE & GETTERS */
    changes,
    closed,
    open,
    pending,

    /* ACTIONS */
    createChange,
    refreshChanges,
    updateChange
  }
})