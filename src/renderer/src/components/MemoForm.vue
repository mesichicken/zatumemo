<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { Memo, Notebook } from '@renderer/types'
import { useNotebookStore } from '@renderer/store/notebook'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
const store = useNotebookStore()
const currentNotebook = ref<Notebook | null>(store.currentNotebook)
const quillEditorRef = ref()

watchEffect(() => {
  currentNotebook.value = store.currentNotebook
})

const memo_content = ref<string>('')
const isMessageSendable = computed(() => {
  return memo_content.value && memo_content.value != '<p><br></p>'
})
type Emits = {
  (event: 'add', memo: Memo): void
}
const emit = defineEmits<Emits>()
const onAdd = async (): Promise<void> => {
  try {
    if (!currentNotebook.value) {
      alert('ノートブックを選択してください')
      return
    }
    if (!isMessageSendable.value) {
      return
    }
    /* @ts-ignore dbOpでエラーを出さない */
    await window.dbOp.insertMemo(memo_content.value, currentNotebook.value.id)
    /* @ts-ignore dbOpでエラーを出さない */
    const Memo: Memo = await window.dbOp.selectLastMemo()
    emit('add', Memo)
    quillEditorRef.value.setHTML('')
  } catch (error) {
    console.error(error)
    alert('メモ追加時にエラーが発生しました')
  }
}
</script>

<template>
  <div class="absolute bottom-0 left-1/5 memo-form">
    <form @submit.prevent="onAdd">
      <label for="chat" class="sr-only">メモを入力</label>
      <div class="px-3 py-2 bg-gray-700 w-full">
        <QuillEditor
          ref="quillEditorRef"
          v-model:content="memo_content"
          theme="bubble"
          class="block p-2.5 w-full text-sm rounded-lg border bg-gray-800 border-gray-600 text-white"
          contentType="html"
        />
        <div class="flex justify-between w-full">
          <div>
            <button
              type="button"
              class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 18"
              >
                <path
                  fill="currentColor"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                />
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                />
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                />
              </svg>
              <span class="sr-only">Upload image</span>
            </button>
          </div>
          <button
            type="submit"
            class="inline-flex justify-center p-2 text-blue-600 rounded-full"
            :class="isMessageSendable ? 'cursor-pointer hover:bg-gray-600' : 'cursor-default'"
          >
            <svg
              class="w-5 h-5 rotate-90 rtl:-rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              :fill="isMessageSendable ? 'currentColor' : 'grey'"
              viewBox="0 0 18 20"
            >
              <path
                d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"
              />
            </svg>
            <span class="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';
.memo-form {
  width: calc(80%);
}
</style>
