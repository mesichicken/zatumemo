<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick, watchEffect } from 'vue'
import { Memo } from '@renderer/types'
import MemoCard from './MemoCard.vue'
import MemoForm from './MemoForm.vue'
import PopupMenu from './PopupMenu.vue'
import { useNotebookStore } from '@renderer/store/notebook'
import { useRightClickPopup } from '@renderer/composables/useRightClickPopup'
const noteBookStore = useNotebookStore()

const memoListContainer = ref<HTMLElement | null>(null)
const memoFormHeight = ref(0) // 高さを保存するためのリアクティブな変数を定義
const memoList = ref<Memo[]>([])

const fetchMemoData = async (): Promise<void> => {
  try {
    if (!noteBookStore.currentNotebook) {
      return
    }
    /* @ts-ignore dbOpでエラーを出さない */
    const data = await window.dbOp.selectMemo(noteBookStore.currentNotebook.id)
    memoList.value = data
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('メモの取得に失敗しました')
  }
}

const scrollToBottom = () => {
  if (memoListContainer.value) {
    const container = memoListContainer.value
    // スクロールが必要かどうか判断(一番下までスクロールされているか)
    const isAtBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1
    nextTick(() => {
      if (!isAtBottom && memoListContainer.value) {
        memoListContainer.value.scrollTop = memoListContainer.value.scrollHeight
      }
    })
  }
}

watchEffect(async () => {
  if (noteBookStore.currentNotebook) {
    await fetchMemoData()
    scrollToBottom()
  } else {
    memoList.value = []
  }
})

// 高さを更新する関数
const updateMemoFormHeight = () => {
  const memoFormElement = document.querySelector('.memo-form') as HTMLElement
  if (memoFormElement) {
    memoFormHeight.value = memoFormElement.offsetHeight
  }
}

onMounted(async () => {
  if (noteBookStore.currentNotebook) {
    fetchMemoData()
  }
  window.addEventListener('resize', updateMemoFormHeight) // ウィンドウのリサイズに対応
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMemoFormHeight) // クリーンアップ
})

const onAddMemo = (memo: Memo): void => {
  memoList.value = [...memoList.value, memo]
  nextTick(updateMemoFormHeight)
  scrollToBottom()
}

const {
  showPopup,
  popupPosition,
  popupId: popupMemoId,
  onRightClick,
  closePopup
} = useRightClickPopup()

const deleteMemoAction = async () => {
  try {
    if (!popupMemoId.value) {
      throw new Error('Invalid memo id')
    }
    /* @ts-ignore dbOpでエラーを出さない */
    await window.dbOp.deleteMemo(popupMemoId.value)
    memoList.value = memoList.value.filter((memo) => memo.id !== popupMemoId.value)
    closePopup()
  } catch (error) {
    console.error('Error deleting memo:', error)
    alert('メモの削除に失敗しました')
  }
}

const visiblePopup = (visible: boolean) => {
  showPopup.value = visible
}
</script>

<template>
  <div
    ref="memoListContainer"
    class="memo-lists scrollable-content bg-gray-700 text-gray-50"
    :style="{ height: `calc(100vh - ${memoFormHeight}px)` }"
  >
    <ul>
      <li
        v-for="(memo, index) in memoList"
        :key="index"
        class="container px-1 py-2 border-b-2 border-gray-500 hover:bg-gray-600"
        @contextmenu="(event) => onRightClick(event, memo.id)"
      >
        <MemoCard :memo="memo" />
      </li>
    </ul>
  </div>
  <MemoForm
    v-if="noteBookStore.currentNotebook"
    class="memo-form"
    @add="onAddMemo"
    @form-height-changed="updateMemoFormHeight"
    @scroll-to-bottom="scrollToBottom"
  />
  <PopupMenu
    :visible="showPopup"
    :position="popupPosition"
    :on-delete-action="deleteMemoAction"
    @update:visible="visiblePopup"
  />
</template>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';

.memo-lists {
  width: 80%;
}

.scrollable-content {
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* スクロールバー全体のスタイルを設定 */
.scrollable-content::-webkit-scrollbar {
  width: $scrollbar-width; /* 縦スクロールの幅 */
  background-color: #5f5f5f; /* スクロールバーの背景色 */
}

/* スクロールバーのつまみ部分をスタイリング */
.scrollable-content::-webkit-scrollbar-thumb {
  background-color: #bdbdbd; /* つまみの色 */
  border-radius: 6px; /* つまみの角を丸くする */
  border: 3px solid #575757; /* つまみの外側の余白（背景色と同じ色にすると良い） */
}

/* スクロールバーのつまみがホバーされたときのスタイル */
.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0; /* ホバー時のつまみの色 */
}
</style>
