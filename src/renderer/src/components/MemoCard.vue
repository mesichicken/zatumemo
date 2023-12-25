<script setup lang="ts">
interface Props {
  memo: string
}

const props = defineProps<Props>();

</script>

<template>
  <li class="memo-card">
    <h3>2023-12-25 00:00:00</h3>
    <p>{{ props.memo }}</p>
  </li>
</template>

<style lang="scss" scoped>
h3 {
  font-size: 10px;
  font-weight: normal;
}
.memo-card {
  width: 100%;
  padding: 10px 5px;
  border-bottom: 1px solid #000;
}
</style>
