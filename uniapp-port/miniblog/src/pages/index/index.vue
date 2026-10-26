<template>
  <view class="page">
    <view class="hero">
      <text class="hero__title">MiniBlog</text>
      <text class="hero__desc">数据来自 jsonplaceholder，共 100 篇文章</text>
      <text class="hero__link" @tap="goFavorite">已收藏 {{ favoriteStore.count }} 篇</text>
    </view>

    <view class="search">
      <text class="search__icon">🔍</text>
      <input
        v-model="keywordInput"
        class="search__input"
        type="text"
        placeholder="搜索文章标题，输入即过滤"
        placeholder-class="search__placeholder"
        confirm-type="search"
        @confirm="onKeywordConfirm"
      />
      <text v-if="keywordInput" class="search__clear" @tap="clearKeyword">✕</text>
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
      <text class="state__text">
        {{ keyword ? `没有找到包含「${keyword}」的文章` : '还没有内容' }}
      </text>
      <text v-if="keyword" class="state__link" @tap="clearKeyword">清空关键词</text>
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

    <view v-if="list.length" class="footer">
      <text v-if="loading" class="footer__text">加载中…</text>
      <text v-else-if="finished && keyword" class="footer__text">
        共 {{ list.length }} 篇匹配
      </text>
      <text v-else-if="finished" class="footer__text">已经到底了</text>
      <text v-else class="footer__text" @tap="loadNext">点击加载更多</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { usePostList } from '@/composables/usePostList'
import { useFavoriteStore } from '@/store/favorite'
import type { Post } from '@/types/blog'

const { list, keyword, loading, finished, errorMessage, isEmpty, loadNext, refresh, setKeyword } =
  usePostList(10)
const favoriteStore = useFavoriteStore()

/** 输入框里的原始值。和 keyword 分开：输入立刻回显，keyword 只在防抖结束后才变 */
const keywordInput = ref('')
const DEBOUNCE_MS = 400
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function clearTimer(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

/** 输入防抖：每次输入都重置计时器，停手 400ms 才真正发请求 */
watch(keywordInput, (value) => {
  clearTimer()
  debounceTimer = setTimeout(() => {
    debounceTimer = null
    setKeyword(value)
  }, DEBOUNCE_MS)
})

/** 键盘上点「搜索」时不排队，立刻请求。不读事件对象，直接读输入框的值 */
function onKeywordConfirm(): void {
  clearTimer()
  setKeyword(keywordInput.value)
}

function clearKeyword(): void {
  clearTimer()
  keywordInput.value = ''
  setKeyword('')
}

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
  // 搜索结果同样支持继续加载（jsonplaceholder 支持 title_like + _page 组合）
  loadNext()
})

onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})

// 页面上没有其他定时器，离开时清掉挂起的防抖，避免对已销毁页面发请求
onUnmounted(clearTimer)
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: $mb-page $mb-page 40rpx;
  background: $mb-bg;
}

.hero {
  padding: 24rpx 8rpx 24rpx;

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

.search {
  display: flex;
  align-items: center;
  height: 76rpx;
  padding: 0 24rpx;
  background: $mb-card;
  border-radius: 999rpx;
  box-shadow: 0 2rpx 12rpx rgba(17, 24, 39, 0.04);

  &__icon {
    margin-right: 12rpx;
    font-size: 26rpx;
  }

  &__input {
    flex: 1;
    height: 76rpx;
    font-size: 28rpx;
    color: $mb-text;
  }

  &__placeholder {
    font-size: 26rpx;
    color: $mb-text-hint;
  }

  &__clear {
    padding: 0 4rpx 0 16rpx;
    font-size: 26rpx;
    color: $mb-text-hint;
  }
}

.list {
  margin-top: 20rpx;
}

.state {
  padding: 160rpx 0;
  text-align: center;

  &__text {
    display: block;
    font-size: 28rpx;
    color: $mb-text-mute;
  }

  &__link {
    display: inline-block;
    margin-top: 24rpx;
    font-size: 26rpx;
    color: $mb-primary;
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
