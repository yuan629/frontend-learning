<template>
  <view class="page">
    <view class="hero">
      <text class="hero__title">MiniBlog</text>
      <text class="hero__desc">数据来自 jsonplaceholder，共 100 篇文章</text>
      <text class="hero__link" @tap="goFavorite">已收藏 {{ favoriteStore.count }} 篇</text>
    </view>

    <!-- 首屏还没有数据时显示骨架屏，避免白屏 -->
    <view v-if="loading && !list.length" class="list">
      <skeleton-card v-for="n in 4" :key="n" />
    </view>

    <view v-else-if="errorMessage && !list.length" class="state">
      <text class="state__text">{{ errorMessage }}</text>
      <button class="state__btn" size="mini" @tap="retry">重新加载</button>
    </view>

    <view v-else-if="isEmpty" class="state">
      <text class="state__text">还没有内容</text>
    </view>

    <view v-else class="list">
      <post-card
        v-for="(post, index) in list"
        :key="post.id"
        :post="post"
        :index="index"
        :favorite="favoriteStore.isFavorite(post.id)"
        @open="openDetail"
        @toggle-favorite="onToggleFavorite"
      />
    </view>

    <view class="footer">
      <text v-if="loading" class="footer__text">加载中…</text>
      <text v-else-if="finished" class="footer__text">已经到底了</text>
      <text v-else class="footer__text" @tap="loadNext">点击加载更多</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePostList } from '@/composables/usePostList'
import { useFavoriteStore } from '@/store/favorite'
import type { Post } from '@/types/blog'

const { list, loading, finished, errorMessage, isEmpty, loadNext, refresh } = usePostList(10)
const favoriteStore = useFavoriteStore()

function openDetail(id: number): void {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function onToggleFavorite(post: Post): void {
  const added = favoriteStore.toggle(post)
  uni.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' })
}

function goFavorite(): void {
  uni.navigateTo({ url: '/pages/favorite/favorite' })
}

function retry(): void {
  refresh()
}

onLoad(() => {
  loadNext()
})

onReachBottom(() => {
  loadNext()
})

onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: $mb-page $mb-page 40rpx;
  background: $mb-bg;
}

.hero {
  padding: 24rpx 8rpx 32rpx;

  &__title {
    display: block;
    font-size: 44rpx;
    font-weight: 700;
    color: $mb-text;
  }

  &__desc {
    display: block;
    margin-top: 10rpx;
    font-size: 24rpx;
    color: $mb-text-mute;
  }

  &__link {
    display: inline-block;
    margin-top: 20rpx;
    padding: 8rpx 20rpx;
    font-size: 24rpx;
    color: $mb-primary;
    background: $mb-primary-soft;
    border-radius: 999rpx;
  }
}

.list {
  margin-top: 8rpx;
}

.state {
  padding: 160rpx 0;
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

.footer {
  padding: 32rpx 0 16rpx;
  text-align: center;

  &__text {
    font-size: 24rpx;
    color: $mb-text-hint;
  }
}
</style>
