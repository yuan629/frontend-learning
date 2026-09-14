<script setup>
import { ref } from 'vue'

// ===================== 状态区：所有会变的数据都在这里 =====================

// 用户信息：先用本地写死的数据，以后接接口时只改这一处
const user = ref({
  name: '陈小舟',
  // 这里用 data URI 画了个占位头像，离线也能显示；
  // 想换成真实照片时，把它改成一个图片地址即可，例如 '/images/me.jpg'
  avatar:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' rx='60' fill='%237c3aed'/><text x='60' y='80' font-size='50' text-anchor='middle' fill='white' font-family='sans-serif'>%E8%88%9F</text></svg>",
  role: 'student', // 可选值：organizer / auditor / student
})

// 在岗状态：true = 在岗，false = 请假
const onDuty = ref(true)

// 主题色：状态里只存一个颜色字符串，通过 CSS 变量传给整张卡片
const accentColor = ref('#7c3aed')
const themes = ref([
  { label: '葡萄紫', value: '#7c3aed' },
  { label: '湖水青', value: '#0d9488' },
  { label: '山楂红', value: '#e11d48' },
])

// 技能标签：字符串数组，模板里用 v-for 渲染
const skills = ref(['海报设计', '现场布置', '摄影剪辑'])

// 角色显示文字：对象形式，key 与 user.role 对应
const ROLE_TEXT = {
  organizer: '活动组织者',
  auditor: '审核员',
  student: '学生',
}

// ===================== 事件处理 =====================

function toggleDuty() {
  onDuty.value = !onDuty.value
}

function pickTheme(color) {
  accentColor.value = color
}
</script>

<template>
  <section class="profile-card" :style="{ '--accent': accentColor }">
    <!-- 头像：地址来自状态，不写死在标签里 -->
    <img class="profile-card__avatar" :src="user.avatar" :alt="user.name" />

    <!-- 姓名：插值表达式 -->
    <h2 class="profile-card__name">{{ user.name }}</h2>

    <!-- 角色标签：对象形式的类名绑定，类名跟着 user.role 走，颜色由 CSS 决定 -->
    <span
      class="role-tag"
      :class="{
        'role-tag--organizer': user.role === 'organizer',
        'role-tag--auditor': user.role === 'auditor',
        'role-tag--student': user.role === 'student',
      }"
    >
      {{ ROLE_TEXT[user.role] ?? '未知角色' }}
    </span>

    <!-- 在岗/请假标签：文字和颜色都由 onDuty 决定 -->
    <span class="duty-tag" :class="{ 'duty-tag--leave': !onDuty }">
      {{ onDuty ? '今日在岗' : '今日请假' }}
    </span>

    <!-- 技能标签列表：v-for 渲染字符串数组 -->
    <ul class="skill-list">
      <li v-for="skill in skills" :key="skill" class="skill-chip">{{ skill }}</li>
    </ul>

    <!-- 操作区：一个按钮切状态，三个按钮换主题色 -->
    <div class="profile-card__actions">
      <button class="btn" @click="toggleDuty">
        {{ onDuty ? '切换为请假' : '切换为在岗' }}
      </button>
      <button
        v-for="theme in themes"
        :key="theme.value"
        class="btn"
        :class="{ 'btn--active': theme.value === accentColor }"
        @click="pickTheme(theme.value)"
      >
        {{ theme.label }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.profile-card {
  width: 320px;
  margin: 40px auto;
  padding: 28px 24px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  text-align: center;
  font-family: system-ui, -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 主题色只在外层定义一次 CSS 变量，下面所有强调色都引用它 */
.profile-card__avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--accent);
}

.profile-card__name {
  margin: 14px 0 10px;
  color: var(--accent);
}

.role-tag,
.duty-tag {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 13px;
  line-height: 20px;
  color: #ffffff;
}

.role-tag--organizer { background: #2563eb; }
.role-tag--auditor   { background: #d97706; }
.role-tag--student   { background: #16a34a; }

.duty-tag {
  margin-left: 8px;
  background: #16a34a;
}
.duty-tag--leave {
  background: #cbd5e1;
  color: #475569;
}

.skill-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
  padding: 0;
}

.skill-chip {
  padding: 4px 12px;
  border: 1px solid var(--accent);
  border-radius: 999px;
  font-size: 13px;
  color: var(--accent);
}

.profile-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 16px;
}

.btn {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  cursor: pointer;
}

.btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn--active {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}
</style>
