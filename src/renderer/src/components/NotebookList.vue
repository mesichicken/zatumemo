<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Notebook } from '@renderer/types'
import { useNotebookStore } from '@renderer/store/notebook'
const notebookStore = useNotebookStore()
const notebooks = ref<Notebook[]>([])
const notebook_name = ref<string>('')
const selectedNotebookId = ref<number | null>(1)
notebooks.value = notebookStore.notebooks

const selectedNotebookIdValue = computed(() => selectedNotebookId.value)

const fetchData = async () => {
  try {
    /* @ts-ignore dbOpでエラーを出さない */
    const data = await window.dbOp.selectAllNotebook()
    notebookStore.setNotebooks(data)
    notebooks.value = notebookStore.notebooks
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('ノートブックの取得に失敗しました')
  }
}

onMounted(async () => {
  fetchData()
})

const makeNotebook = () => {
  toggleModal()
}

const onAdd = async (): Promise<void> => {
  const name = notebook_name.value
  try {
    /* @ts-ignore dbOpでエラーを出さない */
    await window.dbOp.insertNotebook(name)
    /* @ts-ignore dbOpでエラーを出さない */
    const notebook: Notebook = await window.dbOp.selectLastNotebook()
    notebookStore.addNotebook(notebook)
    notebookStore.setCurrentNotebook(notebook)
  } catch (error) {
    console.error(error)
    alert('ノートブック追加時にエラーが発生しました')
  }

  notebook_name.value = ''
  toggleModal()
}

const showModal = ref<boolean>(false)
const toggleModal = () => {
  showModal.value = !showModal.value
}

const setCurrentNotebook = (notebook: Notebook) => {
  notebookStore.setCurrentNotebook(notebook)
  selectedNotebookId.value = notebook.id
  console.log(notebookStore.currentNotebook)
}
</script>

<template>
  <div class="notebook-area bg-gray-900 border-r-2 border-gray-700 text-gray-50 p-2">
    <h1>
      <img src="../assets/images/zatumemo-white.svg" alt="zatumemo" />
    </h1>
    <template v-for="notebook in notebooks" :key="notebook.id">
      <h2
        class="text-sm font-normal py-1 text-center rounded cursor-pointer hover:bg-gray-500"
        :class="{
          'bg-blue-500': notebook.id === selectedNotebookIdValue
        }"
        @click="setCurrentNotebook(notebook)"
      >
        {{ notebook.name }}
      </h2>
    </template>
    <h2
      class="text-xs text-orange-500 font-normal py-2 text-center rounded cursor-pointer hover:bg-gray-500"
      @click="makeNotebook"
    >
      ノートブックの作成+
    </h2>
  </div>

  <div v-if="showModal" class="modal" @click="toggleModal">
    <div class="modal-content" @click.stop>
      <span class="close" @click="toggleModal">&times;</span>
      <h3 class="text-gray-50">ノートブックの作成</h3>
      <form class="py-4" @submit.prevent="onAdd">
        <label for="notebook-name" class="sr-only">ノートブック名</label>
        <input
          id="notebook-name"
          v-model="notebook_name"
          type="text"
          class="block p-2.5 w-full text-sm text-gray-900 rounded-lg border bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="ノートブック名"
        />
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';

.notebook-area {
  width: 20%;
  height: 100vh;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #464646;
  margin: 15% auto;
  border-radius: 10px;
  padding: 20px;
  width: 80%;
  display: flex;
  flex-direction: column;
}

.close {
  align-self: flex-end;
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: rgb(255, 255, 255);
}
</style>
