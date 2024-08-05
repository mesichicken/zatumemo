import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MemoLists from '@renderer/components/MemoLists.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useNotebookStore } from '@renderer/store/notebook'
import { useMemoStore } from '@renderer/store/memo'

vi.mock('@vueup/vue-quill', () => ({
  QuillEditor: {
    render: () => {}
  }
}))

describe('MemoLists', () => {
  let wrapper
  let notebookStore
  let memoStore

  beforeEach(async () => {
    setActivePinia(createPinia())
    notebookStore = useNotebookStore()
    memoStore = useMemoStore()

    // モックの設定
    vi.spyOn(memoStore, 'prepareMemos').mockResolvedValue(undefined)
    vi.spyOn(memoStore, 'deleteMemo').mockImplementation(() => Promise.resolve())

    // window.alert のモック
    vi.spyOn(window, 'alert').mockImplementation(() => {})

    wrapper = mount(MemoLists, {
      global: {
        stubs: ['MemoCard', 'MemoForm', 'PopupMenu']
      }
    })
    await flushPromises()
  })

  it('Vueのオブジェクトを返すこと', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('currentNotebookが設定されている場合、メモデータを取得すること', async () => {
    notebookStore.currentNotebook = { id: 1, name: 'Test Notebook' }
    await flushPromises()
    expect(memoStore.prepareMemos).toHaveBeenCalledWith(1)
  })

  it('メモが削除されたときにリストから削除されること', async () => {
    wrapper.vm.popupMemoId = 1
    await wrapper.vm.deleteMemoAction()
    expect(memoStore.deleteMemo).toHaveBeenCalledWith(1)
  })

  it('右クリックイベントでポップアップメニューが表示されること', async () => {
    const event = new MouseEvent('contextmenu')
    Object.defineProperty(event, 'clientX', { value: 100 })
    Object.defineProperty(event, 'clientY', { value: 100 })

    await wrapper.vm.onRightClick(event, 1)

    expect(wrapper.vm.showPopup).toBe(true)
    expect(wrapper.vm.popupPosition).toEqual({ x: 100, y: 100 })
    expect(wrapper.vm.popupMemoId).toBe(1)
  })
})
