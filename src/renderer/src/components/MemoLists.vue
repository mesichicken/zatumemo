<script setup lang="ts">
import { reactive } from 'vue'
import MemoCard from './MemoCard.vue'
</script>

<template>
  <div class="memo-lists scrollable-content">
    <ul>
      <MemoCard />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';
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
  width: 12px; /* スクロールバーの幅 */
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
