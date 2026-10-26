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
import { fetchPostComments, fetchPostDetail, fetchRandomCover } from '@/api/blog'
import { useFavoriteStore } from '@/store/favorite'
import type { Comment, Post } from '@/types/blog'

const postId = ref(0)
const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const coverUrl = ref('')
const loading = ref(true)
const errorMessage = ref('')
const favoriteStore = useFavoriteStore()

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
