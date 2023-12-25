<script setup lang="ts">
import { Memo } from './types'

type Props = {
  memo: Memo
}

const props = defineProps<Props>();

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${year}/${month}/${day} ${hour}:${minute}`
}

</script>

<template>
  <li class="memo-card">
    <h3>{{ formatDate(props.memo.date) }}</h3>
    <p>{{ props.memo.memo }}</p>
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
