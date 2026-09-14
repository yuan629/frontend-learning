<script setup>
import { ref } from 'vue'

// ===== 数据 =====
// 待办列表
const todos = ref([
  { id: 1, text: '整理活动报名名单', done: false },
  { id: 2, text: '联系场地负责人', done: false },
  { id: 3, text: '准备审核说明材料', done: true }
])

// 输入框里的内容
const draft = ref('')

// 已完成的数量
const doneTotal = ref(1)

// ===== 方法 =====
// 计算已完成数量
function countDone() {
  let total = 0
  for (let i = 0; i < todos.value.length; i++) {
    if (todos.value[i].done === true) {
      total = total + 1
    }
  }
  doneTotal.value = total
}

// 添加一条待办
function addTodo() {
  // 输入为空就不添加
  if (draft.value === '') {
    return
  }

  // 新建一条待办数据
  const newTodo = {
    id: Date.now(),
    text: draft.value,
    done: false
  }

  // 放进列表
  todos.value.push(newTodo)

  // 清空输入框
  draft.value = ''

  // 更新数量
  countDone()
}

// 删除一条待办
function removeTodo(id) {
  // 新建一个空列表，把不需要删的放进去
  const newList = []

  for (let i = 0; i < todos.value.length; i++) {
    if (todos.value[i].id !== id) {
      newList.push(todos.value[i])
    }
  }

  // 用新列表替换旧列表
  todos.value = newList

  // 更新数量
  countDone()
}

// 勾选 / 取消勾选后，也要更新数量
function toggleDone() {
  countDone()
}
</script>

<template>
  <div class="todo">
    <h2 class="title">待办清单</h2>

    <!-- ===== 输入区 ===== -->
    <div class="input-row">
      <input
        class="input"
        v-model="draft"
        placeholder="输入待办事项，按回车添加"
        @keyup.enter="addTodo"
      />
      <button class="add-btn" @click="addTodo">添加</button>
    </div>

    <!-- ===== 列表区 ===== -->
    <ul class="list">
      <li class="item" v-for="item in todos" :key="item.id">
        <input
          class="checkbox"
          type="checkbox"
          v-model="item.done"
          @change="toggleDone"
        />
        <span class="text" :class="item.done ? 'text--done' : 'text--todo'">
          {{ item.text }}
        </span>
        <button class="del-btn" @click="removeTodo(item.id)">删除</button>
      </li>
    </ul>

    <!-- ===== 统计 ===== -->
    <p class="count">已完成 {{ doneTotal }} / {{ todos.length }}</p>
  </div>
</template>

<style>
/* ===== 页面 ===== */
body {
  margin: 0;
  padding: 30px;
  background: #f5f6fa;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  display: flex;
  justify-content: center;
}

/* ===== 卡片 ===== */
.todo {
  width: 340px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #212529;
  text-align: center;
}

/* ===== 输入区 ===== */
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.input {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #4c6ef5;
}

.add-btn {
  width: 64px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: #4c6ef5;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.add-btn:hover {
  background: #3b5bdb;
}

/* ===== 列表区 ===== */
.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f3f5;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 未完成：正常颜色 */
.text--todo {
  flex: 1;
  font-size: 14px;
  color: #495057;
}

/* 已完成：灰色 + 删除线 */
.text--done {
  flex: 1;
  font-size: 14px;
  color: #adb5bd;
  text-decoration: line-through;
}

.del-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  background: #fff0f0;
  color: #fa5252;
  font-size: 12px;
  cursor: pointer;
}

.del-btn:hover {
  background: #ffe3e3;
}

/* ===== 统计 ===== */
.count {
  margin: 14px 0 0 0;
  font-size: 13px;
  color: #868e96;
  text-align: right;
}
</style>
