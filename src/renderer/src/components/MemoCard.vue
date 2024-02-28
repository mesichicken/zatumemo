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
    <h3 class="created-at">{{ formatDate(new Date(props.memo.created_at)) }}</h3>
    <p class="memo-content" v-html="props.memo.content"></p>
  </div>
</template>

<style lang="scss">
.created-at {
  font-size: 10px;
  font-weight: normal;
}

.memo-content {
  white-space: pre-wrap;
  h1 {
    font-size: 28px;
    font-weight: bold;
    margin: 0;
  }
  h2 {
    font-size: 20px;
    font-weight: bold;
  }
  ul {
    list-style: inside;
  }
  blockquote {
    padding: 0.5em 1em;
    border-left: 2px solid #f2f2f2;
  }
  a {
    color: #1e90ff;
    text-decoration: underline;
  }

  blockquote::before {
    content: '\201C';
  }

  blockquote::after {
    content: '\201D';
  }
  pre {
    white-space: pre-wrap;
    padding: 0.5em 1em;
    color: #111;
    background-color: #888;
  }
}
</style>
