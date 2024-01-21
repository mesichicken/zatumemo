<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { Memo } from '@renderer/types'
import MemoCard from './MemoCard.vue'
import MemoForm from './MemoForm.vue'

const memoListContainer = ref<HTMLElement | null>(null)
const memoFormHeight = ref(0) // 高さを保存するためのリアクティブな変数を定義
const memoList = ref<Memo[]>([])

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
    /* @ts-ignore dbOpでエラーを出さない */
    const data = await window.dbOp.selectAll()
    memoList.value = data
    console.log('data fetched:', data)
  } catch (error) {
    console.error('Error fetching data:', error)
    alert('メモの取得に失敗しました')
  }
}

onMounted(async () => {
  fetchData()
  updateMemoFormHeight() // コンポーネントがマウントされたら高さを更新
  window.addEventListener('resize', updateMemoFormHeight) // ウィンドウのリサイズに対応
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMemoFormHeight) // クリーンアップ
})
const onAdd = (memo: Memo): void => {
  // fetchData()
  memoList.value.push(memo)
  nextTick(updateMemoFormHeight) // メモが追加された後に高さを更新
  scrollToBottom() // メモが追加された後に一番下までスクロール
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
        class="container px-1 py-2 border-b-2 border-gray-500"
      >
        <MemoCard :memo="memo" />
      </li>
    </transition-group>
  </div>
  <MemoForm class="memo-form" @add="onAdd" />
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
