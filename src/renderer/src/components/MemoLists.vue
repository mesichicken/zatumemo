<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick, watchEffect } from 'vue'
import { Memo, Notebook } from '@renderer/types'
import MemoCard from './MemoCard.vue'
import MemoForm from './MemoForm.vue'
import PopupMenu from './PopupMenu.vue'
import { useNotebookStore } from '@renderer/store/notebook'
const store = useNotebookStore()
const currentNotebook = ref<Notebook | null>(store.currentNotebook)

const memoListContainer = ref<HTMLElement | null>(null)
const memoFormHeight = ref(0) // 高さを保存するためのリアクティブな変数を定義
const memoList = ref<Memo[]>([])

watchEffect(() => {
  currentNotebook.value = store.currentNotebook
  if (currentNotebook.value) {
    fetchData()
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

const scrollToBottom = () => {
  nextTick(() => {
    if (memoListContainer.value) {
      memoListContainer.value.scrollTop = memoListContainer.value.scrollHeight
    }
  })
}

async function fetchData() {
  try {
    if (!currentNotebook.value) {
      return
    }
    /* @ts-ignore dbOpでエラーを出さない */
    const data = await window.dbOp.selectMemo(currentNotebook.value.id)
    memoList.value = data
    console.log('data fetched:', data)
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('メモの取得に失敗しました')
  }
}

onMounted(async () => {
  if (currentNotebook.value) {
    fetchData()
  }
  updateMemoFormHeight() // コンポーネントがマウントされたら高さを更新
  window.addEventListener('resize', updateMemoFormHeight) // ウィンドウのリサイズに対応
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMemoFormHeight) // クリーンアップ
})

const onAdd = (memo: Memo): void => {
  memoList.value.push(memo)
  nextTick(updateMemoFormHeight) // メモが追加された後に高さを更新
  scrollToBottom() // メモが追加された後に一番下までスクロール
}

const showPopup = ref(false)
const popupPosition = ref({ x: 0, y: 0 })
const popupMemoId = ref(0)

const onRightClick = (event: MouseEvent, memoId: number) => {
  event.preventDefault()
  showPopup.value = true
  popupPosition.value = { x: event.clientX, y: event.clientY }
  popupMemoId.value = memoId
  // ポップアップを開いた後、ドキュメント全体のクリックをリッスンする
  document.addEventListener('click', closePopupOnDocumentClick, { once: true })
}

const closePopupOnDocumentClick = () => {
  showPopup.value = false
  // イベントリスナーを削除する必要はない（{ once: true } で自動的に削除される）
}

// コンポーネントがアンマウントされる前にイベントリスナーを確実に削除
onBeforeUnmount(() => {
  document.removeEventListener('click', closePopupOnDocumentClick)
})

const deleteMemoAction = async () => {
  try {
    /* @ts-ignore dbOpでエラーを出さない */
    await window.dbOp.deleteMemo(popupMemoId.value)
    memoList.value = memoList.value.filter((memo) => memo.id !== popupMemoId.value)
    showPopup.value = false
  } catch (error) {
    console.error('Error deleting memo:', error)
    alert('メモの削除に失敗しました')
  }
}
</script>

<template>
  <div
    ref="memoListContainer"
    class="memo-lists scrollable-content bg-gray-700 text-gray-50"
    :style="{ height: `calc(100vh - ${memoFormHeight}px)` }"
  >
    <transition-group name="memo" tag="ul">
      <li
        v-for="(memo, index) in memoList"
        :key="index"
        class="container px-1 py-2 border-b-2 border-gray-500 hover:bg-gray-600"
        @contextmenu="(event) => onRightClick(event, memo.id)"
      >
        <MemoCard :memo="memo" />
      </li>
    </transition-group>
  </div>
  <MemoForm v-if="currentNotebook" class="memo-form" @add="onAdd" />
  <PopupMenu :visible="showPopup" :position="popupPosition" :on-select-action="deleteMemoAction" />
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

/* トランジションのスタイル */
.memo-enter-active,
.memo-leave-active {
  transition: opacity 0.5s;
}

.memo-enter,
.memo-leave-to {
  opacity: 0;
}
</style>
