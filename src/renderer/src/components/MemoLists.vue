<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick, watchEffect } from 'vue'
import MemoCard from './MemoCard.vue'
import MemoForm from './MemoForm.vue'
import PopupMenu from './PopupMenu.vue'
import { useNotebookStore } from '@renderer/store/notebook'
import { useMemoStore } from '@renderer/store/memo'
import { useRightClickPopup } from '@renderer/composables/useRightClickPopup'
const noteBookStore = useNotebookStore()
const memoStore = useMemoStore()

const memoListContainer = ref<HTMLElement | null>(null)
const memoFormHeight = ref(0) // 高さを保存するためのリアクティブな変数を定義
const enableAnimation = ref(true)

const fetchMemoData = async (): Promise<void> => {
  if (!noteBookStore.currentNotebook) {
    return
  }
  await memoStore.prepareMemos(noteBookStore.currentNotebook.id)
}

const scrollToBottom = async () => {
  await nextTick()
  if (memoListContainer.value) {
    const container = memoListContainer.value
    // スクロールが必要かどうか判断(一番下までスクロールされているか)
    const isAtBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1
    if (!isAtBottom) {
      container.scrollTop = container.scrollHeight
    }
  }
}

watchEffect(async () => {
  if (noteBookStore.currentNotebook) {
    enableAnimation.value = false // アニメーションを無効化
    await fetchMemoData()
    scrollToBottom()
    nextTick(() => {
      enableAnimation.value = true // データ更新後にアニメーションを再度有効化
    })
  } else {
    memoStore.memos = []
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

const onAddMemo = async (): Promise<void> => {
  await nextTick()
  updateMemoFormHeight()
  await scrollToBottom()
}

const {
  showPopup,
  popupPosition,
  popupId: popupMemoId,
  onRightClick,
  closePopup
} = useRightClickPopup()

const deleteMemoAction = async () => {
  if (!popupMemoId.value) {
    return
  }
  await memoStore.deleteMemo(popupMemoId.value)
  closePopup()
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
    <TransitionGroup :name="enableAnimation ? 'memo-list' : ''" tag="ul">
      <li
        v-for="memo in memoStore.memos"
        :key="memo.id"
        class="container px-1 py-2 border-b-2 border-gray-500 hover:bg-gray-600"
        @contextmenu="(event) => onRightClick(event, memo.id)"
      >
        <MemoCard :memo="memo" />
      </li>
    </TransitionGroup>
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

// メモのアニメーション
.memo-list-enter-active,
.memo-list-leave-active {
  transition: all 0.5s ease;
}
.memo-list-enter-from,
.memo-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
