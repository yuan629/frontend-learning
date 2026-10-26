<template>
  <view class="page">
    <view class="card">
      <text class="title">关于 MiniBlog</text>
      <text class="desc">
        这是第 5 条任务里新增的页面，已在 pages.json 中注册，暂时没有做入口跳转。
      </text>
    </view>

    <view class="card">
      <text class="row">页面路径：/pages/about/index</text>
      <text class="row">导航栏：沿用 globalStyle 的蓝色配色</text>
      <text class="row">版本：{{ version }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const version = '1.0.0'
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
