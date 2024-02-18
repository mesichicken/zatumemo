import { ref } from 'vue'

export function useRightClickPopup() {
  const showPopup = ref(false)
  const popupPosition = ref({ x: 0, y: 0 })
  const popupId = ref<number | null>(null)

  const onRightClick = (event: MouseEvent, id: number) => {
    event.preventDefault()
    showPopup.value = true
    popupPosition.value = { x: event.clientX, y: event.clientY }
    popupId.value = id
  }

  const closePopup = () => {
    showPopup.value = false
  }

  return { showPopup, popupPosition, popupId, onRightClick, closePopup }
}
