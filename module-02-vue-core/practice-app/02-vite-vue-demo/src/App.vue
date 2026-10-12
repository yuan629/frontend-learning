<template>
  <div class="todo">
    <h2 :title="title">{{ title }}</h2>

    <input v-model.trim="draft" placeholder="想学什么?敲这里" @keyup.enter="add" />
    <button @click="add">添加</button>
    <p v-if="draftError" class="err">{{ draftError }}</p>

    <p v-if="items.length === 0">清单是空的,添加第一条吧</p>
    <ul v-else>
      <li v-for="(item, index) in items" :key="item.id">
        {{ index + 1 }}. {{ item.name }}
        <button @click="remove(item.id)">删</button>
      </li>
    </ul>

    <p>共 {{ count }} 条</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const title = ref('Vue 学习愿望清单')
const draft = ref('')
const items = ref([])
const draftError = ref('')
let nextId = 1

const count = computed(() => items.value.length)

function add() {
  if (draft.value === '') {
    draftError.value = '不能添加空内容哦'
    return
  }
  items.value.push({ id: nextId++, name: draft.value })
  draft.value = ''
  draftError.value = ''
}

function remove(id) {
  items.value = items.value.filter(function (i) {
    return i.id !== id
  })
}

watch(count, function (newVal, oldVal) {
  console.log('清单从 ' + oldVal + ' 条变成 ' + newVal + ' 条')
})
</script>

<style>
.todo {
  max-width: 400px;
  margin: 40px auto;
  font-family: sans-serif;
}
.todo input {
  padding: 4px 8px;
}
.todo li {
  margin: 6px 0;
}
.err {
  color: red;
  font-size: 13px;
}
</style>
