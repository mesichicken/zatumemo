<script setup lang="ts">
import MemoChannel from './components/MemoChannel.vue'
import MemoLists from './components/MemoLists.vue'
</script>

<template>
  <main>
    <div class="flex">
      <MemoChannel />
      <MemoLists />
    </div>
  </main>
</template>

<style lang="scss">
@import './assets/scss/main.scss';
</style>
