import { computed, ref } from 'vue'
import { fetchPosts } from '@/api/blog'
import type { Post } from '@/types/blog'

/**
 * 列表分页逻辑。页面里只留渲染，加载、翻页、空态判断都在这里。
 * @param size 每页条数
 */
export function usePostList(size = 10) {
  const list = ref<Post[]>([])
  const loadedPage = ref(0)
  const loading = ref(false)
  const finished = ref(false)
  const errorMessage = ref('')

  const isEmpty = computed(
    () => !loading.value && !errorMessage.value && list.value.length === 0
  )

  async function loadNext(): Promise<void> {
    if (loading.value || finished.value) return

    loading.value = true
    errorMessage.value = ''

    try {
      const next = loadedPage.value + 1
      const result = await fetchPosts(next, size)
      list.value = next === 1 ? result : list.value.concat(result)
      loadedPage.value = next
      // jsonplaceholder 一共 100 条，返回不满一页就说明到底了
      finished.value = result.length < size
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  async function refresh(): Promise<void> {
    loadedPage.value = 0
    finished.value = false
    list.value = []
    await loadNext()
  }

  return { list, loading, finished, errorMessage, isEmpty, loadNext, refresh }
}
