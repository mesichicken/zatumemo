import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MemoLists from '@renderer/components/MemoLists.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useNotebookStore } from '@renderer/store/notebook'
import { Memo } from '@renderer/types'

vi.mock('@vueup/vue-quill', () => ({
  QuillEditor: {
    render: () => {}
  }
}))

describe('MemoLists', () => {
  let wrapper
  let notebookStore: ReturnType<typeof useNotebookStore>

  const mockWindow = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dbOp: {
      selectMemo: vi.fn().mockResolvedValue([]),
      deleteMemo: vi.fn().mockResolvedValue(undefined)
    }
  }
  vi.stubGlobal('window', mockWindow)

  beforeEach(async () => {
    setActivePinia(createPinia())
    notebookStore = useNotebookStore()

    wrapper = mount(MemoLists)
    await flushPromises()
  })

  it('Vueのオブジェクトを返すこと', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('currentNotebookが設定されている場合、メモデータを取得すること', async () => {
    const mockMemos: Memo[] = [
      { id: 1, content: 'Test memo 1', created_at: new Date(), updated_at: new Date() },
      { id: 2, content: 'Test memo 2', created_at: new Date(), updated_at: new Date() }
    ]
    mockWindow.dbOp.selectMemo.mockResolvedValue(mockMemos)

    notebookStore.currentNotebook = { id: 1, name: 'Test Notebook' }
    await flushPromises()

    expect(mockWindow.dbOp.selectMemo).toHaveBeenCalledWith(1)
    expect(wrapper.vm.memoList).toEqual(mockMemos)
  })

  it('メモが追加されたときにリストに追加されること', async () => {
    const newMemo: Memo = {
      id: 3,
      content: 'New memo',
      created_at: new Date(),
      updated_at: new Date()
    }
    await wrapper.vm.onAddMemo(newMemo)

    expect(wrapper.vm.memoList).toContainEqual(newMemo)
  })

  it('メモが削除されたときにリストから削除されること', async () => {
    const mockMemos: Memo[] = [
      { id: 1, content: 'Test memo 1', created_at: new Date(), updated_at: new Date() },
      { id: 2, content: 'Test memo 2', created_at: new Date(), updated_at: new Date() }
    ]
    wrapper.vm.memoList = mockMemos

    wrapper.vm.popupMemoId = 1
    await wrapper.vm.deleteMemoAction()

    expect(mockWindow.dbOp.deleteMemo).toHaveBeenCalledWith(1)
    expect(wrapper.vm.memoList).toHaveLength(1)
    expect(wrapper.vm.memoList[0].id).toBe(2)
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
