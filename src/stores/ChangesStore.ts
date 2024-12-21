import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { request } from "@/functions/request"
import { MR } from "@/types"

export const useChangesStore = defineStore("changes-store", () => {
  /* STATE */
  const changes = ref<MR[]>([])

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
    request("$update", args)
      .then(response => {
        const [ updated ] = JSON.parse(response)
        const changesCopy = [ ...changes.value ]

        const changeRow = changesCopy.findIndex(({ mr_number }) => mr_number === updated.mr_number)
        changesCopy[changeRow] = updated

        changes.value = changesCopy
      })
      .catch(console.error)
  }

  const deleteChange = (args: object) => {
    request("$delete", args)
      .then(response => {
        const [ deleted ] = JSON.parse(response)
        const changesCopy = [ ...changes.value ]

        const changeRow = changesCopy.findIndex(({ mr_number }) => mr_number === deleted.mr_number)
        changesCopy.splice(changeRow, 1)

        changes.value = changesCopy
      })
      .catch(console.error)
  }

  return {
    /* STATE & GETTERS */
    changes,
    closed,
    open,
    pending,

    /* ACTIONS */
    createChange,
    deleteChange,
    refreshChanges,
    updateChange
  }
})