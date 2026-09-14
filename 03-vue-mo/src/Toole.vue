<script setup>
import { ref } from 'vue'

const isSignedUp = ref(false)
const count = ref(0)
const tip = ref('')

// 报名按钮：切换状态 + 计数，加到 10 就清零并提示
function onSignup() {
  if (count.value >= 10) {
    count.value = 0                    // 加到十就清零
    isSignedUp.value = false           // 状态复位为未报名
    tip.value = '已满 10 次，计数清零！'
    setTimeout(() => { tip.value = '' }, 2000)  // 2 秒后提示消失
    return
  }
  count.value++
  isSignedUp.value = !isSignedUp.value
  tip.value = ''
}
</script>

<template>
  <button
    class="btn"
    :class="isSignedUp ? 'btn--signed' : 'btn--idle'"
    @click="onSignup"
  >
    {{ isSignedUp ? '退订' : '报名' }}（{{ count }}/10）
  </button>

  <p class="show" :class="isSignedUp ? 'status--done' : 'status--idle'">
    {{ isSignedUp ? '已报名' : '未报名' }}
  </p>

  <p v-if="tip" class="tip">{{ tip }}</p>
</template>

<style>
/* ---------- 按钮 ---------- */
.btn {
  width: 110px; height: 30px;
  border: none; border-radius: 4px;
  color: #fff; font-size: 14px; cursor: pointer;
  transition: background-color 0.25s, transform 0.08s;
}
.btn:hover { opacity: 0.9; }
.btn:active { transform: scale(0.96); }
.btn--idle   { background-color: #4c6ef5; }  /* 未报名：蓝色 */
.btn--signed { background-color: #fa5252; }  /* 已报名：红色退订 */

/* ---------- 状态文字 ---------- */
/* 布局归 .show，颜色交给状态类 */
.show {
  width: 70px; height: 30px;
  box-sizing: border-box; line-height: 30px;
  text-align: center; border-radius: 4px;
  font-size: 14px; margin: 10px 0 0;
  transition: background-color 0.25s, color 0.25s;
}

/* 状态类必须写在 .show 之后，同权重才能覆盖成功 */
.status--idle {
  background-color: #f1f3f5;  /* 浅灰底 */
  color: #868e96;             /* 灰字 */
}
.status--done {
  background-color: #e6fcf5;  /* 浅绿底 */
  color: #0ca678;             /* 绿字 */
}

/* ---------- 清零提示 ---------- */
.tip {
  width: fit-content;
  margin: 10px 0 0;
  padding: 4px 10px;
  border-radius: 4px;
  background-color: #fff9db;
  color: #e8590c;
  font-size: 13px;
}
</style>