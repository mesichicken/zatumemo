<script setup lang="ts">
import MemoChannel from './components/MemoChannel.vue'
import MemoLists from './components/MemoLists.vue'
import Versions from './components/Versions.vue'
</script>

<template>
  <header>
    <h1>雑メモ</h1>
  </header>
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
