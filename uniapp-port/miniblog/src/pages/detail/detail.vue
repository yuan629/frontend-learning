<template>
  <view class="page">
    <view v-if="loading" class="state">
      <text class="state__text">加载中…</text>
    </view>

    <view v-else-if="errorMessage" class="state">
      <text class="state__text">{{ errorMessage }}</text>
      <button class="state__btn" size="mini" @tap="loadAll">重新加载</button>
    </view>

    <view v-else-if="post" class="content">
      <view class="cover">
        <image
          v-if="coverUrl"
          class="cover__img"
          :src="coverUrl"
          mode="aspectFill"
          @error="onCoverError"
        />
        <view v-else class="cover__placeholder">
          <text class="cover__tip">封面加载失败</text>
        </view>
        <text class="cover__refresh" @tap="loadCover">换一张</text>
      </view>

      <view class="article">
        <text class="article__title">{{ post.title }}</text>
        <view class="article__meta">
          <text class="article__meta-item">#{{ post.id }}</text>
          <text class="article__meta-item">作者 {{ post.userId }}</text>
        </view>
        <text class="article__body">{{ post.body }}</text>
      </view>

      <view class="comments">
        <view class="comments__head">
          <text class="comments__title">评论</text>
          <text class="comments__count">{{ comments.length }} 条</text>
        </view>

        <view v-for="comment in comments" :key="comment.id" class="comment">
          <text class="comment__name">{{ comment.name }}</text>
          <text class="comment__email">{{ comment.email }}</text>
          <text class="comment__body">{{ comment.body }}</text>
        </view>

        <text v-if="!comments.length" class="comments__empty">暂无评论</text>
      </view>

      <!-- 练习二：发评论。乐观更新，先上屏再发请求 -->
      <view class="compose">
        <textarea
          v-model="draft"
          class="compose__input"
          placeholder="写下你的评论…"
          placeholder-class="compose__placeholder"
          :maxlength="200"
          :disabled="submitting"
          :show-confirm-bar="false"
          auto-height
        />
        <view class="compose__foot">
          <text class="compose__count">{{ draft.length }}/200</text>
          <button
            class="compose__btn"
            size="mini"
            :loading="submitting"
            :disabled="submitting || !draft.trim()"
            @tap="submitComment"
          >
            发布
          </button>
        </view>
      </view>

      <view class="bar">
        <button class="bar__btn" @tap="onToggleFavorite">
          {{ favoriteStore.isFavorite(post.id) ? '取消收藏' : '收藏这篇文章' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import {
  createComment,
  fetchPostComments,
  fetchPostDetail,
  fetchRandomCover
} from '@/api/blog'
import { useFavoriteStore } from '@/store/favorite'
import type { Comment, Post } from '@/types/blog'

const postId = ref(0)
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const coverUrl = ref('')
const loading = ref(true)
const errorMessage = ref('')
const favoriteStore = useFavoriteStore()

/** 评论输入框内容与提交中状态 */
const draft = ref('')
const submitting = ref(false)
/** 乐观更新用的临时 id 计数器，取负数避免和真实 id 撞上 */
let tempCommentId = 0

async function loadAll(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const [detail, commentList] = await Promise.all([
      fetchPostDetail(postId.value),
      fetchPostComments(postId.value)
    ])
    post.value = detail
    comments.value = commentList
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载失败'
  } finally {
    loading.value = false
  }
}

async function loadCover(): Promise<void> {
  try {
    coverUrl.value = await fetchRandomCover()
  } catch {
    coverUrl.value = ''
  }
}

function onCoverError(): void {
  coverUrl.value = ''
}

function onToggleFavorite(): void {
  if (!post.value) return
  const added = favoriteStore.toggle(post.value)
  uni.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' })
}

/**
 * 发评论（练习二）
 * 乐观更新：先在本地 unshift 一条占位评论，请求成功再换成服务端返回的对象；
 * 失败则回滚（移除占位项）并把内容还给输入框，不让用户白打一遍。
 */
async function submitComment(): Promise<void> {
  if (!post.value || submitting.value) return

  const body = draft.value.trim()
  if (!body) {
    uni.showToast({ title: '先写点内容', icon: 'none' })
    return
  }

  // await 之后 post.value 可能已被置空，先把 id 取出来
  const targetId = post.value.id
  submitting.value = true

  // 类型注解不可省：不写的话 id 会被推断成 number 之外的联合类型，后面也拿不到补全
  const pending: Comment = {
    postId: targetId,
    id: --tempCommentId,
    name: '我',
    email: 'me@example.com',
    body
  }
  comments.value.unshift(pending)
  draft.value = ''

  try {
    const saved = await createComment(targetId, {
      name: pending.name,
      email: pending.email,
      body
    })

    // 用服务端结果替换占位项；保持它还在第一位
    const index = comments.value.findIndex((item) => item.id === pending.id)
    if (index > -1) {
      // jsonplaceholder 每次都给同一个 id（501），重复时保留临时 id，避免列表 key 冲突
      const duplicated = comments.value.some((item) => item.id === saved.id)
      comments.value.splice(index, 1, {
        ...saved,
        id: duplicated ? pending.id : saved.id,
        postId: targetId
      })
    }
    uni.showToast({ title: '评论已发布', icon: 'none' })
  } catch {
    // 回滚：撤掉占位项，把内容还给输入框
    comments.value = comments.value.filter((item) => item.id !== pending.id)
    draft.value = body
  } finally {
    submitting.value = false
  }
}

onLoad((options) => {
  postId.value = Number(options?.id ?? 0)

  if (!postId.value) {
    errorMessage.value = '缺少文章 id，请从列表页进入'
    loading.value = false
    return
  }

  uni.setNavigationBarTitle({ title: `文章 ${postId.value}` })
  loadAll()
  loadCover()
})

// #ifdef MP-WEIXIN
onShareAppMessage(() => {
  return {
    title: post.value ? post.value.title.slice(0, 20) : 'MiniBlog',
    path: `/pages/detail/detail?id=${postId.value}`
  }
})
// #endif

// #ifdef H5
function copyShareLink(): void {
  const link = `${window.location.origin}/#/pages/detail/detail?id=${postId.value}`
  uni.setClipboardData({
    data: link,
    success: () => {
      uni.showToast({ title: '链接已复制', icon: 'none' })
    }
  })
}
// #endif
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $mb-bg;
  padding-bottom: 40rpx;
}

.state {
  padding: 200rpx 0;
  text-align: center;

  &__text {
    display: block;
    font-size: 28rpx;
    color: $mb-text-mute;
  }

  &__btn {
    margin-top: 28rpx;
  }
}

.cover {
  position: relative;
  height: 360rpx;
  background: $mb-placeholder;

  &__img {
    width: 100%;
    height: 100%;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &__tip {
    font-size: 26rpx;
    color: $mb-text-hint;
  }

  &__refresh {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    padding: 8rpx 22rpx;
    font-size: 24rpx;
    color: $mb-card;
    background: $mb-mask;
    border-radius: 999rpx;
  }
}

.article {
  padding: 32rpx 32rpx 8rpx;
  background: $mb-card;

  &__title {
    display: block;
    font-size: 38rpx;
    font-weight: 700;
    line-height: 1.45;
    color: $mb-text;
  }

  &__meta {
    display: flex;
    margin: 18rpx 0 24rpx;
  }

  &__meta-item {
    margin-right: 20rpx;
    font-size: 24rpx;
    color: $mb-text-mute;
  }

  &__body {
    display: block;
    font-size: 30rpx;
    line-height: 1.8;
    color: $mb-text-strong;
    white-space: pre-wrap;
  }
}

.comments {
  margin-top: 20rpx;
  padding: 32rpx;
  background: $mb-card;

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: $mb-text;
  }

  &__count {
    font-size: 24rpx;
    color: $mb-text-mute;
  }

  &__empty {
    display: block;
    padding: 40rpx 0;
    text-align: center;
    font-size: 26rpx;
    color: $mb-text-hint;
  }
}

.comment {
  padding: 24rpx 0;
  border-bottom: 1rpx solid $mb-border;

  &:last-child {
    border-bottom: none;
  }

  &__name {
    display: block;
    font-size: 27rpx;
    font-weight: 600;
    color: $mb-text-strong;
  }

  &__email {
    display: block;
    margin: 4rpx 0 10rpx;
    font-size: 23rpx;
    color: $mb-text-hint;
  }

  &__body {
    display: block;
    font-size: 27rpx;
    line-height: 1.7;
    color: $mb-text-sub;
  }
}

.compose {
  margin-top: 20rpx;
  padding: 28rpx 32rpx 20rpx;
  background: $mb-card;

  &__input {
    width: 100%;
    min-height: 130rpx;
    font-size: 28rpx;
    line-height: 1.7;
    color: $mb-text;
    background: $mb-bg;
    border-radius: $mb-radius-btn;
    padding: 18rpx 20rpx;
    box-sizing: border-box;
  }

  &__placeholder {
    font-size: 26rpx;
    color: $mb-text-hint;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16rpx;
  }

  &__count {
    font-size: 22rpx;
    color: $mb-text-hint;
  }

  &__btn {
    margin: 0;
    padding: 0 40rpx;
    font-size: 26rpx;
    line-height: 2.2;
    color: $mb-card;
    background: $mb-primary;
    border-radius: 999rpx;

    &[disabled] {
      color: $mb-text-hint;
      background: $mb-border;
    }
  }
}

.bar {
  padding: 32rpx;

  &__btn {
    font-size: 30rpx;
    color: $mb-card;
    background: $mb-primary;
    border-radius: 12rpx;
  }
}
</style>
