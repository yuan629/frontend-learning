import { computed, ref } from 'vue'
import { fetchPosts } from '@/api/blog'
import type { Post } from '@/types/blog'

/**
 * 列表分页逻辑。页面里只留渲染，加载、翻页、搜索、空态判断都在这里。
 * @param size 每页条数
 */
export function usePostList(size = 10) {
  const list = ref<Post[]>([])
  const loadedPage = ref(0)
  const loading = ref(false)
  const finished = ref(false)
  const errorMessage = ref('')
  /** 当前生效的关键词，空串表示不过滤 */
  const keyword = ref('')

  /**
   * 请求序号。防抖后的搜索会连续发多个请求，先发的可能后到，
   * 用它把过期响应丢掉，避免旧结果覆盖新结果。
   */
  let requestSeq = 0

  const isEmpty = computed(
    () => !loading.value && !errorMessage.value && list.value.length === 0
  )

  async function loadNext(): Promise<void> {
    if (loading.value || finished.value) return

    loading.value = true
    errorMessage.value = ''
    const seq = ++requestSeq

    try {
      const next = loadedPage.value + 1
      const result = await fetchPosts(next, size, keyword.value)
      if (seq !== requestSeq) return // 已被更新的请求取代，丢弃

      list.value = next === 1 ? result : list.value.concat(result)
      loadedPage.value = next
      // 返回不满一页就说明到底了（搜索时同样成立：过滤后不足一页即结束）
      finished.value = result.length < size
    } catch (error) {
      if (seq !== requestSeq) return
      errorMessage.value = error instanceof Error ? error.message : '加载失败'
    } finally {
      if (seq === requestSeq) loading.value = false
    }
  }

  /** 回到第一页重新加载。分页状态必须在这里一并重置 */
  async function refresh(): Promise<void> {
    requestSeq++ // 让在途请求立即作废
    loading.value = false
    loadedPage.value = 0
    finished.value = false
    list.value = []
    errorMessage.value = ''

    // loadNext 一开始就同步把 loading 置 true，所以清空后不会闪空白
    await loadNext()
  }

  /**
   * 切换关键词。值没变时直接返回，避免重复请求。
   * 内部调用 refresh，所以分页会自动回到第 1 页。
   */
  async function setKeyword(value: string): Promise<void> {
    const next = value.trim()
    if (next === keyword.value) return
    keyword.value = next
    await refresh()
  }

  return {
    list,
    keyword,
    loading,
    finished,
    errorMessage,
    isEmpty,
    loadNext,
    refresh,
    setKeyword
  }
}
