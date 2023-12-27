<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { Memo } from './types'
import MemoCard from './MemoCard.vue'
import MemoForm from './MemoForm.vue'

const memo_content = ref<string>('')
const memoList = ref<Memo[]>([])
const memoListContainer = ref<HTMLElement | null>(null)
const memoFormHeight = ref(0) // 高さを保存するためのリアクティブな変数を定義

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

onMounted(() => {
  updateMemoFormHeight() // コンポーネントがマウントされたら高さを更新
  window.addEventListener('resize', updateMemoFormHeight) // ウィンドウのリサイズに対応
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMemoFormHeight) // クリーンアップ
})

const onAdd = (newMemo: Memo): void => {
  memoList.value.push(newMemo)
  nextTick(updateMemoFormHeight) // メモが追加された後に高さを更新
  scrollToBottom() // メモが追加された後に一番下までスクロール
}
</script>

<template>
  <div
    ref="memoListContainer"
    class="memo-lists scrollable-content"
    :style="{ height: `calc(100vh - 60px - ${memoFormHeight}px)` }"
  >
    <ul v-for="(memo, index) in memoList" :key="index">
      <MemoCard :memo="memo" />
    </ul>
  </div>
  <MemoForm class="memo-form" :memo-content="memo_content" @add="onAdd" />
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
  background-color: #f5f5f5; /* スクロールバーの背景色 */
}

/* スクロールバーのつまみ部分をスタイリング */
.scrollable-content::-webkit-scrollbar-thumb {
  background-color: #bdbdbd; /* つまみの色 */
  border-radius: 6px; /* つまみの角を丸くする */
  border: 3px solid #f5f5f5; /* つまみの外側の余白（背景色と同じ色にすると良い） */
}

/* スクロールバーのつまみがホバーされたときのスタイル */
.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0; /* ホバー時のつまみの色 */
}
</style>
