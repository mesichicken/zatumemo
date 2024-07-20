import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PopupMenu from '@renderer/components/PopupMenu.vue'

describe('PopupMenu', () => {
  it('Vueのオブジェクトを返すこと', () => {
    const wrapper = mount(PopupMenu)
    expect(wrapper.vm).toBeTruthy()
  })

  it('visibleプロパティがtrueの場合、ポップアップが表示されること', async () => {
    const wrapper = mount(PopupMenu, {
      props: {
        visible: true,
        position: { x: 100, y: 100 }
      }
    })
    expect(wrapper.isVisible()).toBe(true)
  })

  it('visibleプロパティがfalseの場合、ポップアップが非表示であること', async () => {
    const wrapper = mount(PopupMenu, {
      props: {
        visible: false,
        position: { x: 100, y: 100 }
      }
    })
    expect(wrapper.isVisible()).toBe(false)
  })

  it('positionプロパティに基づいて正しい位置に配置されること', async () => {
    const wrapper = mount(PopupMenu, {
      props: {
        visible: true,
        position: { x: 150, y: 200 }
      }
    })
    const popupElement = wrapper.element as HTMLElement
    expect(popupElement.style.left).toBe('150px')
    expect(popupElement.style.top).toBe('200px')
  })

  it('削除ボタンをクリックするとonSelectActionが呼ばれること', async () => {
    const onSelectAction = vi.fn()
    const wrapper = mount(PopupMenu, {
      props: {
        visible: true,
        position: { x: 100, y: 100 },
        onSelectAction
      }
    })
    await wrapper.find('.text-red-500').trigger('click')
    expect(onSelectAction).toHaveBeenCalledTimes(1)
  })

  it('ドキュメントをクリックするとポップアップが閉じること', async () => {
    const wrapper = mount(PopupMenu, {
      props: {
        visible: true,
        position: { x: 100, y: 100 }
      }
    })
    await wrapper.vm.$nextTick()
    document.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
  })
})
