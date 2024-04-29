import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MemoLists from '@renderer/components/MemoLists.vue'
import { setActivePinia, createPinia } from 'pinia'

describe('MemoLists', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Vueのオブジェクトを返すこと', async () => {
    const wrapper = mount(MemoLists)
    expect(wrapper.vm).toBeTruthy()
  })

  it('notebookが存在しない場合、memoListに空配列が入ること', async () => {
    const wrapper = mount(MemoLists)
    expect(wrapper.vm.memoList).toEqual([])
  })
})