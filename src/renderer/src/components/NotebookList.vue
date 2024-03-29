<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { Notebook } from '@renderer/types'
import { useNotebookStore } from '@renderer/store/notebook'
import PopupMenu from './PopupMenu.vue'
import { useRightClickPopup } from '@renderer/composables/useRightClickPopup'
const notebookStore = useNotebookStore()
const notebooks = ref<Notebook[]>([])
const notebook_name = ref<string>('')
const selectedNotebookId = ref<number | null>(null)

watch(
  () => notebookStore.notebooks,
  async (newVal) => {
    notebooks.value = newVal
  },
  { immediate: true }
)

const selectedNotebookIdValue = computed(() => selectedNotebookId.value)

const fetchData = async () => {
  try {
    /* @ts-ignore dbOpでエラーを出さない */
    const data = await window.dbOp.selectAllNotebook()
    await notebookStore.setNotebooks(data)
    setCurrentNotebook(notebooks.value[0])
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
    setCurrentNotebook(notebook)
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

watch(showModal, async (newVal) => {
  if (newVal) {
    await nextTick() // コンポーネントの更新が完了するのを待つ
    const input = document.getElementById('notebook-name')
    input?.focus()
  }
})

const setCurrentNotebook = (notebook: Notebook) => {
  console.log('setCurrentNotebook', notebook)
  if (!notebook) return
  notebookStore.setCurrentNotebook(notebook)
  selectedNotebookId.value = notebook.id
}

const {
  showPopup,
  popupPosition,
  popupId: popupNotebookId,
  onRightClick,
  closePopup
} = useRightClickPopup()

const deleteNotebookAction = async () => {
  try {
    if (!popupNotebookId.value) {
      throw new Error('Invalid notebook id')
    }
    /* @ts-ignore dbOpでエラーを出さない */
    await window.dbOp.deleteNotebook(popupNotebookId.value)
    notebookStore.deleteNotebook(popupNotebookId.value)
    closePopup()
    setCurrentNotebook(notebooks.value[0])
  } catch (error) {
    console.error('Error deleting notebook:', error)
    alert('ノートブックの削除に失敗しました')
  }
}

const visiblePopup = (visible: boolean) => {
  showPopup.value = visible
}
</script>

<template>
  <div class="notebook-area bg-gray-900 border-r-2 border-gray-700 text-gray-50 p-2">
    <h1>
      <img src="../assets/images/zatumemo-white.svg" alt="zatumemo" />
    </h1>
    <template v-for="notebook in notebooks" :key="notebook.id">
      <h2
        class="text-sm font-normal px-2 py-1 rounded cursor-pointer hover:bg-gray-500"
        :class="{
          'bg-blue-500': notebook.id === selectedNotebookIdValue
        }"
        @click="setCurrentNotebook(notebook)"
        @contextmenu="(event) => onRightClick(event, notebook.id)"
      >
        {{ notebook.name }}
      </h2>
    </template>
    <h2
      class="text-xs text-orange-500 font-normal p-2 rounded cursor-pointer hover:bg-gray-500"
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
  <PopupMenu
    :visible="showPopup"
    :position="popupPosition"
    :on-select-action="deleteNotebookAction"
    @update:visible="visiblePopup"
  />
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
