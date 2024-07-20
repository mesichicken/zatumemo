<template>
  <div
    v-if="visible"
    class="bg-gray-600 border border-gray-300 shadow-lg rounded-lg py-4"
    :style="{ position: 'fixed', top: `${position.y}px`, left: `${position.x}px` }"
  >
    <p class="text-red-500 cursor-pointer px-4 hover:bg-gray-500" @click="onSelect">削除</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onBeforeUnmount } from 'vue'

type Position = {
  x: number
  y: number
}

const props = defineProps({
  visible: Boolean,
  position: Object as () => Position,
  onSelectAction: Function
})

const visible = ref(props.visible)
const position = ref<Position>(props.position || { x: 0, y: 0 })

watchEffect(() => {
  visible.value = props.visible
  position.value = props.position || { x: 0, y: 0 }

  if (visible.value) {
    document.addEventListener('click', closePopupOnDocumentClick, { once: true })
  }
})

type Emits = {
  (event: 'update:visible', visible: boolean): void
}

const emit = defineEmits<Emits>()

const closePopupOnDocumentClick = () => {
  visible.value = false
  document.removeEventListener('click', closePopupOnDocumentClick)
  emit('update:visible', false)
}

onBeforeUnmount(() => {
  document.removeEventListener('click', closePopupOnDocumentClick)
})

const onSelect = () => {
  if (typeof props.onSelectAction === 'function') {
    props.onSelectAction()
  } else {
    console.error('onSelectAction is not a function')
  }
}
</script>
