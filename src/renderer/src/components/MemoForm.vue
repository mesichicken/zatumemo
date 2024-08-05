<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useNotebookStore } from '@renderer/store/notebook'
import { useMemoStore } from '@renderer/store/memo'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
const notebookStore = useNotebookStore()
const memoStore = useMemoStore()
const quillEditorRef = ref()

const emit = defineEmits(['formHeightChanged', 'scrollToBottom', 'add'])
onMounted(() => {
  emit('formHeightChanged')
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
      onAdd()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', onAdd)
})

const memo_content = ref<string>('')
const isMessageSendable = computed(() => {
  return memo_content.value && memo_content.value != '<p><br></p>'
})

const onAdd = async (): Promise<void> => {
  try {
    if (!notebookStore.currentNotebook) {
      alert('ノートブックを選択してください')
      return
    }
    if (!isMessageSendable.value) {
      return
    }
    await memoStore.addMemo(memo_content.value, notebookStore.currentNotebook.id)

    emit('add')
    quillEditorRef.value.setHTML('')
  } catch (error) {
    console.error(error)
    alert('メモ追加時にエラーが発生しました')
  }
}

const onTextChange = () => {
  emit('formHeightChanged')
  emit('scrollToBottom')
}
</script>

<template>
  <div class="absolute bottom-0 left-1/5 memo-form">
    <form @submit.prevent="onAdd">
      <label for="chat" class="sr-only">メモを入力</label>
      <div class="px-3 py-2 bg-gray-700 w-full text-white">
        <QuillEditor
          ref="quillEditorRef"
          v-model:content="memo_content"
          theme="snow"
          toolbar="#quill-toolbar"
          class="block p-2.5 w-full text-sm border bg-gray-800 border-gray-600 text-white rounded-b-lg"
          content-type="html"
          placeholder="メモを入力"
          @text-change="onTextChange"
        >
          <template #toolbar>
            <div id="quill-toolbar" class="bg-gray-800 rounded-t-lg">
              <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
              </span>
              <span class="ql-formats">
                <button class="ql-header" value="1"></button>
                <button class="ql-header" value="2"></button>
                <button class="ql-blockquote"></button>
                <button class="ql-code-block"></button>
              </span>
              <span class="ql-formats">
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
              </span>
              <span class="ql-formats">
                <button class="ql-link"></button>
                <button class="ql-image"></button>
              </span>
              <span class="ql-formats">
                <button class="ql-clean"></button>
              </span>
            </div>
          </template>
        </QuillEditor>
        <div class="flex flex-row-reverse w-full">
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

<style lang="scss">
@import '../assets/scss/main.scss';
.memo-form {
  width: calc(80%);
}

#quill-toolbar {
}
.ql-editor ul {
  padding-left: 0em;
}
.ql-indent-1 {
  padding-left: 2.5em !important;
}
.ql-indent-2 {
  padding-left: 3rem !important;
}
.ql-indent-3 {
  padding-left: 4rem !important;
}
.ql-indent-4 {
  padding-left: 5rem !important;
}
.ql-indent-5 {
  padding-left: 6rem !important;
}
.ql-indent-6 {
  padding-left: 7rem !important;
}
.ql-indent-7 {
  padding-left: 8rem !important;
}
.ql-indent-8 {
  padding-left: 9rem !important;
}
.ql-editor.ql-blank::before {
  color: #888;
  padding-left: 10px;
}
</style>
