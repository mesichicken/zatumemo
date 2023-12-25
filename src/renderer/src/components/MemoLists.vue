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
      <MemoCard
        :memo="memo"
      />
    </ul>
  </div>
  <div class="memo-form">
    <form @submit.prevent="onAdd">
      <!-- コントロールキーを押しながらEnterでも送信できる -->
      <textarea name="" id="" cols="30" rows="10" v-model="memo_content" placeholder="メモを入力してください" @keydown.enter.ctrl="onAdd">

      </textarea>
      <button class="submit" type="submit">送信</button>
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
  position: absolute;
  bottom: 5px;
  left: 20%;
  width: calc(80% - $scrollbar-width);
  height: 140px;
  padding: 4px 10px;
  background-color: #a0a0a0;
  border: 1px solid #000;
}

.memo-form form {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.memo-form textarea {
  width: 100%;
  height: 100px;
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
  width: 40px;
  height: 30px;
  border: none;
  outline: none;
  background-color: #e1e0de;
  cursor: pointer;
}

</style>
