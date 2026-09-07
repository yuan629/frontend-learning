<template>
  <div class="wrap">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <button @click="like">点赞 {{ likes }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('我的 Vite + Vue3 项目')
const content = ref('这一句是从脚手架的默认页面改出来的')
const likes = ref(0)

function like() {
  likes.value++
}
</script>

<style>
.wrap {
  text-align: center;
  margin-top: 80px;
}
h2 {
  color: #b45309;
}
</style>
