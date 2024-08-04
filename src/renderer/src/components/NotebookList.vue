<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useNotebookStore } from '@renderer/store/notebook'
import PopupMenu from './PopupMenu.vue'
import { useRightClickPopup } from '@renderer/composables/useRightClickPopup'
const notebookStore = useNotebookStore()
const editingNotebookName = ref<string>('')

onMounted(async () => {
  await notebookStore.prepareNotebooks()
})

const onAddNotebook = async (): Promise<void> => {
  if (!editingNotebookName.value) {
    return
  }
  notebookStore.addNotebook(editingNotebookName.value)

  editingNotebookName.value = ''
  toggleEditNotebookModal()
}

const showModal = ref<boolean>(false)
const toggleEditNotebookModal = () => {
  showModal.value = !showModal.value
}

// モーダルが表示されたらinputにフォーカスを当てる
watch(showModal, async (newVal) => {
  if (newVal) {
    await nextTick() // コンポーネントの更新が完了するのを待つ
    const input = document.getElementById('notebook-name')
    input?.focus()
  }
})

const {
  showPopup,
  popupPosition,
  popupId: popupNotebookId,
  onRightClick,
  closePopup
} = useRightClickPopup()

const deleteNotebookAction = async () => {
  if (!popupNotebookId.value) {
    return
  }
  await notebookStore.deleteNotebook(popupNotebookId.value)
  closePopup()
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
    <template v-for="notebook in notebookStore.notebooks" :key="notebook.id">
      <h2
        class="text-sm font-normal px-2 py-1 rounded cursor-pointer hover:bg-gray-500"
        :class="{
          'bg-blue-500': notebook.id === notebookStore.currentNotebook?.id
        }"
        @click="notebookStore.setCurrentNotebook(notebook)"
        @contextmenu="(event) => onRightClick(event, notebook.id)"
      >
        {{ notebook.name }}
      </h2>
    </template>
    <h2
      class="text-xs text-orange-500 font-normal p-2 rounded cursor-pointer hover:bg-gray-500"
      @click="toggleEditNotebookModal"
    >
      ノートブックの作成+
    </h2>
  </div>

  <div v-if="showModal" class="modal" @click="toggleEditNotebookModal">
    <div class="modal-content" @click.stop>
      <span class="close" @click="toggleEditNotebookModal">&times;</span>
      <h3 class="text-gray-50">ノートブックの作成</h3>
      <form class="py-4" @submit.prevent="onAddNotebook">
        <label for="notebook-name" class="sr-only">ノートブック名</label>
        <input
          id="notebook-name"
          v-model="editingNotebookName"
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
    :on-delete-action="deleteNotebookAction"
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
