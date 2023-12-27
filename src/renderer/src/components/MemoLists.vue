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
      <label for="chat" class="sr-only">メモを入力</label>
      <div class="flex items-center flex-wrap px-3 py-2 bg-gray-50 dark:bg-gray-700 w-full">
        <textarea
          id="chat"
          rows="1"
          class="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="メモを入力"
          v-model="memo_content"
          @keydown.enter.ctrl="onAdd"
        ></textarea>
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
            class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          >
            <svg
              class="w-5 h-5 rotate-90 rtl:-rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
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
  // height: 130px;
  // padding: 4px 10px;
  // background-color: #a0a0a0;
  // border: 1px solid #000;
}

.memo-form textarea {
  width: 100%;
  height: 80px;
  font-size: 16px;
  font-weight: normal;
}
</style>
