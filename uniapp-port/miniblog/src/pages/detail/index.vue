<template>
  <view class="page">
    <view class="card">
      <text class="title">文章详情</text>
      <text class="desc">
        这个页面用来演示「页面级 style 覆盖 globalStyle」：它的导航栏被我单独改成了橙色。
      </text>
    </view>

    <view class="card">
      <text class="row">页面路径：/pages/detail/index</text>
      <text class="row">navigationBarBackgroundColor：#FA8C16</text>
      <text class="row">navigationBarTextStyle：white</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const articleId = 1
</script>

<style lang="scss">
.page {
  min-height: 100vh;
  padding: 24rpx;
  background-color: #f5f6f8;
}

.card {
  margin-bottom: 20rpx;
  padding: 28rpx;
  background-color: #ffffff;
  border-radius: 16rpx;

  .title {
    display: block;
    margin-bottom: 12rpx;
    font-size: 34rpx;
    font-weight: 500;
    color: #1f2937;
  }

  .desc {
    display: block;
    font-size: 26rpx;
    line-height: 1.7;
    color: #6b7280;
  }

  .row {
    display: block;
    font-size: 26rpx;
    line-height: 1.9;
    color: #6b7280;
  }
}
</style>
