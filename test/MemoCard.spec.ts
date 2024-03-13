import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MemoCard from '@renderer/components/MemoCard.vue'

describe('MemoCard', () => {
  it('メモの詳細が正しく表示されるか確認', () => {
    // テスト用のメモオブジェクトを作成
    const memo = {
      id: '1',
      title: 'Test Memo Title',
      content: 'This is a test content.',
      created_at: new Date(2022, 0, 1, 14, 30).toISOString() // ISO 8601 形式の日付文字列
    };

    // MemoCard コンポーネントをマウントし、props にメモオブジェクトを渡す
    const wrapper = mount(MemoCard, {
      props: { memo }
    })

    // 日付が正しくフォーマットされているか確認
    expect(wrapper.find('.created-at').text()).toContain('2022/1/1 14:30')

    // メモの内容が表示されているか確認
    expect(wrapper.find('.memo-content').html()).toContain('This is a test content.')
  })
})
