<script setup>
import { ref } from 'vue'

// 两个活动（各自的标题、状态、封面）
const activity1 = ref({
  title: '2026 春季校园歌手大赛',
  status: 'draft', // draft / signing / closed / finished
  cover: 'https://89fade5bdf93428f83a2e06ba181c570.app.workbuddy.host/poster-1.png'
})

const activity2 = ref({
  title: '2026 春季校园歌手大赛',
  status: 'signing',
  cover: 'https://89fade5bdf93428f83a2e06ba181c570.app.workbuddy.host/poster-2.png'
})

// 当前显示哪一张：true = 第一张，false = 第二张
const showFirst = ref(true)

// 状态 → 文字
const statusText = {
  draft: '草稿',
  signing: '报名中',
  closed: '报名截止',
  finished: '已结束'
}

// 状态 → 类名（颜色）
const statusClass = {
  draft: 'tag--draft',
  signing: 'tag--signing',
  closed: 'tag--closed',
  finished: 'tag--finished'
}

// 下架按钮：草稿状态不能点
function offShelf() {
  if (activity1.value.status === 'draft') {
    return
  }
  alert('已下架')
}

// 上一张 / 下一张
function prev() {
  showFirst.value = true
}

function next() {
  showFirst.value = false
}
</script>

<template>
  <article class="card">
    <!-- ===== 第一张 ===== -->
    <div v-if="showFirst">
      <img class="poster" :src="activity1.cover" :alt="activity1.title" />
      <h3 class="title">{{ activity1.title }}</h3>
      <span class="tag" :class="statusClass[activity1.status]">
        {{ statusText[activity1.status] }}
      </span>
      <button
        class="off-btn"
        :disabled="activity1.status === 'draft'"
        @click="offShelf"
      >
        下架
      </button>
    </div>

    <!-- ===== 第二张 ===== -->
    <div v-else>
      <img class="poster" :src="activity2.cover" :alt="activity2.title" />
      <h3 class="title">{{ activity2.title }}</h3>
      <span class="tag" :class="statusClass[activity2.status]">
        {{ statusText[activity2.status] }}
      </span>
      <button
        class="off-btn"
        :disabled="activity2.status === 'draft'"
        @click="offShelf"
      >
        下架
      </button>
    </div>

    <!-- ===== 上一张 / 下一张 ===== -->
    <div class="switcher">
      <button class="nav-btn" @click="prev">上一张</button>
      <button class="nav-btn" @click="next">下一张</button>
    </div>
  </article>
</template>

<style>
body {
  margin: 0;
  padding: 30px;
  background: #f5f6fa;
  font-family: "Microsoft YaHei", sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card {
  width: 220px;
  padding: 12px;
  background: #fff;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 封面图 */
.poster {
  height: 240px;
  width: auto;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 8px;
  display: block;
}

/* 活动标题 */
.title {
  font-size: 16px;
  color: #333;
  margin: 12px 0 8px;
}

/* 状态标签 */
.tag {
  display: inline-block;
  padding: 3px 12px;
  font-size: 13px;
  border-radius: 10px;
}

/* 四种状态四种颜色 */
.tag--draft {
  background: #f1f3f5;
  color: #868e96;
}
.tag--signing {
  background: #e6fcf5;
  color: #0ca678;
}
.tag--closed {
  background: #fff4e6;
  color: #e8590c;
}
.tag--finished {
  background: #f3f0ff;
  color: #7048e8;
}

/* 下架按钮 */
.off-btn {
  display: block;
  width: 100%;
  height: 32px;
  margin-top: 14px;
  border: none;
  border-radius: 6px;
  background: #fa5252;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.off-btn:hover {
  background: #e03131;
}

/* 草稿状态：置灰 + 不能点 */
.off-btn:disabled {
  background: #dee2e6;
  color: #adb5bd;
  cursor: not-allowed;
}

/* 上一张 / 下一张 */
.switcher {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.nav-btn {
  flex: 1;
  height: 30px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #fff;
  color: #495057;
  font-size: 13px;
  cursor: pointer;
}

.nav-btn:hover {
  background: #f1f3f5;
}
</style>

