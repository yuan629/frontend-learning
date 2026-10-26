/** 文章（jsonplaceholder 的 posts 资源） */
export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

/** 评论（posts/{id}/comments） */
export interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

/** 收藏项：存快照而不是只存 id，收藏页不用再请求一次 */
export interface FavoriteItem {
  id: number
  title: string
  savedAt: number
}

/** 新建文章的入参 */
export interface CreatePostInput {
  title: string
  body: string
  userId: number
}

/** 发评论的入参（postId 走路径参数，不放在 body 里） */
export interface CreateCommentInput {
  name: string
  email: string
  body: string
}
