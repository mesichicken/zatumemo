<script setup lang="ts"></script>

<template>
  <div class="memo-channel">
    <h2>メモチャンネル</h2>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/scss/main.scss';

h2 {
  font-size: 1rem;
  font-weight: normal;
  margin: 0;
  padding: 0;
  text-align: center;
  padding: 0.5rem 0;
}
.memo-channel {
  width: 20%;
  height: calc(100vh - #{$header-height});
  background-color: #e4da8b;
}
</style>
