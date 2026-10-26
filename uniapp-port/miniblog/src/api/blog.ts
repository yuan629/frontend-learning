import { http } from '@/utils/request'
import type { Comment, CreateCommentInput, CreatePostInput, Post } from '@/types/blog'

/**
 * 分页取文章。jsonplaceholder 用 _page / _limit
 * @param keyword 可选关键词，走 title_like 做标题模糊匹配（练习一）
 */
export function fetchPosts(page: number, size: number, keyword = ''): Promise<Post[]> {
  return http.get<Post[]>('/posts', {
    _page: page,
    _limit: size,
    // 空关键词必须传 undefined 而不是空串，否则会拼出 title_like= 把结果过滤空
    title_like: keyword.trim() || undefined
  })
}

export function fetchPostDetail(id: number): Promise<Post> {
  return http.get<Post>(`/posts/${id}`)
}

export function fetchPostComments(id: number): Promise<Comment[]> {
  return http.get<Comment[]>(`/posts/${id}/comments`)
}

/** 演示写请求：jsonplaceholder 返回 201 和带 id 的对象，不会真的落库 */
export function createPost(input: CreatePostInput): Promise<Post> {
  return http.post<Post>('/posts', input)
}

/**
 * 发评论（练习二）。jsonplaceholder 返回 201 + 带新 id 的对象，同样不会落库，
 * 所以前端要靠 unshift 把新评论插到列表最前才看得到效果。
 */
export function createComment(postId: number, input: CreateCommentInput): Promise<Comment> {
  return http.post<Comment>(`/posts/${postId}/comments`, input)
}

interface DogImageResponse {
  message: string
  status: string
}

/** 第三方接口，走绝对地址。失败不弹 toast，由调用方兜底 */
export function fetchRandomCover(): Promise<string> {
  return http
    .get<DogImageResponse>('https://dog.ceo/api/breeds/image/random', undefined, { showError: false })
    .then((res) => res.message)
}
