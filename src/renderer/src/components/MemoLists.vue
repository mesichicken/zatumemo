<script setup lang="ts">
import { ref } from 'vue'
import { Memo } from './types'
import MemoCard from './MemoCard.vue'

const memo_content = ref<string>('')
const memoList = ref<Memo[]>([])

const onAdd = (e: Event): void => {
  const memo_date: Date = new Date()
  const memo: Memo = {
    memo: memo_content.value,
    date: memo_date
  }
  memoList.value.push(memo)
  e.preventDefault()

  memo_content.value = ''
}
</script>

<template>
  <div class="memo-lists scrollable-content">
    <ul v-for="(memo, index) in memoList" :key="index">
      <MemoCard :memo="memo" />
    </ul>
  </div>
  <div class="absolute bottom-0 left-1/5 memo-form">
    <form class="flex justify-center flex-wrap" @submit.prevent="onAdd">
      <div class="container py-1">
        <!-- コントロールキーを押しながらEnterでも送信できる -->
        <textarea
          id=""
          v-model="memo_content"
          name=""
          cols="30"
          rows="10"
          placeholder="メモを入力してください"
          @keydown.enter.ctrl="onAdd"
        >
        </textarea>
      </div>

      <button
        class="submit bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        type="submit"
      >
        送信
      </button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';

$scrollbar-width: 12px;
.memo-lists {
  width: 80%;
  height: calc(100vh - #{$header-height});
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

.memo-form {
  width: calc(80% - $scrollbar-width);
  height: 130px;
  padding: 4px 10px;
  background-color: #a0a0a0;
  border: 1px solid #000;
}

.memo-form textarea {
  width: 100%;
  height: 80px;
  padding: 5px;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: normal;
  background-color: #e1e0de;
}

.memo-form .submit {
  margin: 0 0 0 auto;
  line-height: 10px;
  // width: 40px;
  // height: 30px;
  border: none;
  outline: none;
  background-color: #e1e0de;
  cursor: pointer;
}
</style>
