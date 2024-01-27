<script setup lang="ts">
import NotebookList from './components/NotebookList.vue'
import MemoLists from './components/MemoLists.vue'
</script>

<template>
  <main>
    <div class="flex">
      <NotebookList />
      <MemoLists />
    </div>
  </main>
</template>

<style lang="scss">
@import './assets/scss/main.scss';
</style>
