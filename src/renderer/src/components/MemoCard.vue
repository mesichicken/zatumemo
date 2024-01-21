<script setup lang="ts">
import { Memo } from '@renderer/types'

type Props = {
  memo: Memo
}

const props = defineProps<Props>()

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
  <div>
    <h3>{{ formatDate(new Date(props.memo.created_at)) }}</h3>
    <p class="memo-content">{{ props.memo.content }}</p>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  font-size: 10px;
  font-weight: normal;
}

.memo-content {
  white-space: pre-wrap;
}
</style>
