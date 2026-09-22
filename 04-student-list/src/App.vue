<script setup lang="ts">
import { ref, computed } from 'vue'

// ===== 头像图片：用 Vite 的 import.meta.glob 一次性导入 assets/avatars 下全部图片 =====
// 生成的映射：{ '20230101': url, ... }，key 是文件名（= 学号）
const avatarModules = import.meta.glob('./assets/avatars/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const avatarUrl = (id: string) => avatarModules[`./assets/avatars/${id}.png`] ?? ''

// ========== 作业①：学生数组，自行初始化数据 ==========
interface Student {
  id: string
  name: string
  cls: string      // 班级
  track: string    // 方向
  score: number    // 成绩
  status: string   // 状态
  avatar?: string  // 头像图片地址
}

const students = ref<Student[]>([
  { id: '20230101', name: '林一鸣', cls: '软件 2301', track: '前端开发', score: 92, status: '在读' },
  { id: '20230102', name: '周予安', cls: '软件 2301', track: '后端开发', score: 85, status: '在读' },
  { id: '20230103', name: '苏晓晴', cls: '软件 2302', track: '前端开发', score: 78, status: '实习中' },
  { id: '20230104', name: '陈砚舟', cls: '软件 2302', track: '数据开发', score: 64, status: '休学' },
  { id: '20230105', name: '顾星野', cls: '软件 2302', track: '后端开发', score: 88, status: '在读' },
  { id: '20230106', name: '许知微', cls: '软件 2303', track: '测试开发', score: 71, status: '实习中' },
  { id: '20230107', name: '沈墨白', cls: '软件 2303', track: '前端开发', score: 95, status: '在读' },
  { id: '20230108', name: '叶清和', cls: '软件 2303', track: '数据开发', score: 59, status: '休学' },
])

// ========== 作业②：条件渲染的开关 ==========
// mode 只控制"怎么显示"，students 数组始终是同一份 —— 切换视图不影响数据本身
// 延伸练习：新增第 4 种视图 group（按专业方向分组）
const mode = ref<'table' | 'card' | 'list' | 'group'>('table')

const modes = [
  { key: 'table', label: '表格' },
  { key: 'card',  label: '卡片' },
  { key: 'list',  label: '名单' },
  { key: 'group', label: '分组' },
]

// ===== 延伸练习：只显示及格学生 =====
// 关键思路：不动 students 原数组，而是算出一份"当前要显示的数据"
// 四个视图统一读 visible，所以开关一处生效、全页同步
const onlyPass = ref(false)

const visible = computed(() =>
  onlyPass.value ? students.value.filter(s => s.score >= 60) : students.value
)

// 概览统计（跟随 visible，开关切换时数字一起变）
const stats = computed(() => ({
  total: visible.value.length,
  studying: visible.value.filter(s => s.status === '在读').length,
  interning: visible.value.filter(s => s.status === '实习中').length,
  avg: visible.value.length
    ? Math.round(visible.value.reduce((n, s) => n + s.score, 0) / visible.value.length)
    : 0,
}))

// ===== 延伸练习：点"查看详情"弹出对话框 =====
// 核心就两个 ref：selected 存"点的是谁"，detailVisible 管"弹窗开不开"
const selected = ref<Student | null>(null)
const detailVisible = ref(false)

function showDetail(s: Student) {
  selected.value = s        // 记住选中的学生（整个对象存进 ref）
  detailVisible.value = true // 打开对话框
}

// 按分数生成一句评语，让弹窗内容更完整
function remark(s: Student) {
  if (s.score >= 90) return '成绩优秀，基础扎实，可承担小组攻关任务。'
  if (s.score >= 80) return '成绩良好，重点补齐薄弱环节即可更上一层。'
  if (s.score >= 70) return '成绩中等，学习状态稳定，有明确的提升空间。'
  if (s.score >= 60) return '成绩及格，建议制定复习计划，巩固基础知识。'
  return '成绩暂未达标，建议一对一辅导，先把基础补起来。'
}

function statusType(s: string) {
  return s === '在读' ? 'success' : s === '实习中' ? 'warning' : 'info'
}
function trackType(t: string) {
  return t === '前端开发' ? 'primary'
       : t === '后端开发' ? 'success'
       : t === '数据开发' ? 'warning'
       : 'danger'
}
// 每个方向的代表色（分组视图用）
function trackColor(t: string) {
  return t === '前端开发' ? '#6366f1'
       : t === '后端开发' ? '#10b981'
       : t === '数据开发' ? '#f59e0b'
       : '#ef4444'
}

// ===== 延伸练习：按专业方向分组（分组视图的数据来源） =====
// computed 派生数据，不改动 students 本身 —— 和"切换视图不影响数据"同一原则
// 注意：数据源用 visible，这样"只看及格"开关对分组视图也生效
interface Group { track: string; items: Student[] }
const groups = computed<Group[]>(() => {
  const map = new Map<string, Student[]>()
  for (const s of visible.value) {
    if (!map.has(s.track)) map.set(s.track, [])
    map.get(s.track)!.push(s)
  }
  return [...map.entries()].map(([track, items]) => ({ track, items }))
})
// 被过滤掉的人数（用于提示"还有几人没显示"）
const hiddenCount = computed(() => students.value.length - visible.value.length)
function scoreColor(n: number) {
  return n >= 90 ? '#10b981' : n >= 80 ? '#6366f1' : n >= 70 ? '#f59e0b' : n >= 60 ? '#f97316' : '#ef4444'
}
</script>

<template>
  <div class="page">
    <div class="orb orb-1" />
    <div class="orb orb-2" />

    <div class="wrap">
      <!-- 顶部：标题 + 一组切换按钮 -->
      <header class="topbar">
        <div class="brand">
          <div class="logo">名</div>
          <div>
            <h1>学生名单</h1>
            <p>同一批数据 · 三种显示方式 · v-if / v-else-if / v-else 条件渲染</p>
          </div>
        </div>

        <div class="switch-wrap">
          <label class="pass-switch">
            <el-switch v-model="onlyPass" />
            <span>只看及格</span>
          </label>
          <span v-if="onlyPass && hiddenCount" class="hidden-tip">
            已隐藏 {{ hiddenCount }} 人不及格
          </span>
        </div>

        <div class="switcher">
          <button
            v-for="m in modes"
            :key="m.key"
            class="switch-btn"
            :class="{ active: mode === m.key }"
            @click="mode = m.key"
          >
            {{ m.label }}
          </button>
        </div>
      </header>

      <!-- 概览小卡 -->
      <section class="mini-stats">
        <div class="mini" v-for="c in [
          { label: '总人数',   value: stats.total,     unit: '人',      accent: '#6366f1' },
          { label: '在读',     value: stats.studying,  unit: '人',      accent: '#10b981' },
          { label: '实习中',   value: stats.interning, unit: '人',      accent: '#f59e0b' },
          { label: '平均成绩', value: stats.avg,       unit: '分',      accent: '#0ea5e9' },
        ]" :key="c.label">
          <span class="mini-label">{{ c.label }}</span>
          <span class="mini-value" :style="{ color: c.accent }">{{ c.value }}</span>
          <span class="mini-unit">{{ c.unit }}</span>
        </div>
      </section>

      <!-- ========== 作业②：v-if / v-else-if / v-else 三种渲染效果 ========== -->

      <!-- 模式一：表格 —— el-table 逐行显示，成绩可排序 -->
      <main v-if="mode === 'table'" class="panel">
        <el-table
          :data="visible"
          stripe
          :header-cell-style="{ background: '#f7f8fc', color: '#606266', fontWeight: '600' }"
        >
          <el-table-column prop="id" label="学号" width="120" />
          <el-table-column label="姓名" width="150">
            <template #default="{ row }">
              <div class="who-cell">
                <img class="avatar avatar-sm" :src="avatarUrl(row.id)" :alt="row.name" />
                <span class="cell-name">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cls" label="班级" width="120" />
          <el-table-column label="方向" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="trackType(row.track)" effect="light" round>{{ row.track }}</el-tag>
            </template>
          </el-table-column>
          <!-- 成绩列：sortable 开启排序 -->
          <el-table-column prop="score" label="成绩" width="190" sortable>
            <template #default="{ row }">
              <div class="score-cell">
                <el-progress
                  :percentage="row.score"
                  :color="scoreColor(row.score)"
                  :show-text="false"
                  :stroke-width="6"
                  class="score-bar"
                />
                <strong :style="{ color: scoreColor(row.score) }">{{ row.score }}</strong>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)" effect="plain">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="showDetail(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </main>

      <!-- 模式二：卡片 —— el-card 一人一张，窄屏自动换列 -->
      <main v-else-if="mode === 'card'" class="cards">
        <el-card v-for="s in visible" :key="s.id" shadow="hover" class="stu-card">
          <div class="card-head">
            <img class="avatar" :src="avatarUrl(s.id)" :alt="s.name" />
            <div>
              <div class="card-name">{{ s.name }}</div>
              <div class="card-id">{{ s.id }}</div>
            </div>
          </div>

          <div class="card-tags">
            <el-tag :type="trackType(s.track)" size="small" round>{{ s.track }}</el-tag>
            <el-tag :type="statusType(s.status)" size="small" effect="plain">{{ s.status }}</el-tag>
          </div>

          <div class="card-row"><span>班级</span><b>{{ s.cls }}</b></div>
          <div class="card-score">
            <span>成绩</span>
            <b :style="{ color: scoreColor(s.score) }">{{ s.score }}</b>
          </div>
          <el-progress
            :percentage="s.score"
            :color="scoreColor(s.score)"
            :show-text="false"
            :stroke-width="7"
          />
          <el-button link type="primary" class="card-more" @click="showDetail(s)">查看详情 →</el-button>
        </el-card>
      </main>

      <!-- 模式三：名单 —— 一行一人，紧凑排列，方便快速扫读 -->
      <!-- 延伸练习：原来是 v-else 兜底，现在改成 v-else-if，给分组视图腾出兜底位置 -->
      <main v-else-if="mode === 'list'" class="panel list-panel">
        <div v-for="s in visible" :key="s.id" class="list-row">
          <img class="avatar avatar-sm" :src="avatarUrl(s.id)" :alt="s.name" />
          <span class="list-name">{{ s.name }}</span>
          <span class="list-meta">{{ s.id }} · {{ s.cls }} · {{ s.track }}</span>
          <strong class="list-score" :style="{ color: scoreColor(s.score) }">{{ s.score }}</strong>
          <el-tag :type="statusType(s.status)" size="small" effect="plain">{{ s.status }}</el-tag>
          <el-button link type="primary" size="small" @click="showDetail(s)">详情</el-button>
        </div>
      </main>

      <!-- 模式四（延伸练习）：按专业方向分组显示 -->
      <!-- 判断链：v-if(table) → v-else-if(card) → v-else-if(list) → v-else(group) -->
      <main v-else class="groups">
        <section v-for="g in groups" :key="g.track" class="group">
          <header class="group-head">
            <span class="g-dot" :style="{ background: trackColor(g.track) }" />
            <span class="g-name">{{ g.track }}</span>
            <span class="g-count">{{ g.items.length }} 人</span>
            <span class="g-line" />
          </header>
          <div class="g-cards">
            <div v-for="s in g.items" :key="s.id" class="g-card clickable" @click="showDetail(s)">
              <img class="avatar avatar-sm" :src="avatarUrl(s.id)" :alt="s.name" />
              <div class="g-info">
                <span class="g-nm">{{ s.name }}</span>
                <span class="g-meta">{{ s.id }} · {{ s.cls }}</span>
              </div>
              <strong class="g-score" :style="{ color: scoreColor(s.score) }">{{ s.score }}</strong>
              <el-tag :type="statusType(s.status)" size="small" effect="plain">{{ s.status }}</el-tag>
            </div>
          </div>
        </section>
      </main>

      <!-- 延伸练习：学生详情对话框 -->
      <!-- v-model 控制开关；selected 里存着当前点的那名学生，模板里直接取值渲染 -->
      <el-dialog v-model="detailVisible" width="460px" align-center>
        <template #header>
          <div v-if="selected" class="dlg-head">
            <img class="avatar" :src="avatarUrl(selected.id)" :alt="selected.name" />
            <div class="dlg-title">
              <div class="dlg-name">{{ selected.name }}</div>
              <div class="dlg-id">{{ selected.id }}</div>
            </div>
            <el-tag :type="statusType(selected.status)" effect="plain">{{ selected.status }}</el-tag>
          </div>
        </template>

        <div v-if="selected" class="dlg-body">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="学号">{{ selected.id }}</el-descriptions-item>
            <el-descriptions-item label="班级">{{ selected.cls }}</el-descriptions-item>
            <el-descriptions-item label="方向">
              <el-tag :type="trackType(selected.track)" size="small" round>{{ selected.track }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="statusType(selected.status)" size="small" effect="plain">{{ selected.status }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="成绩" :span="2">
              <div class="dlg-score">
                <el-progress
                  :percentage="selected.score"
                  :color="scoreColor(selected.score)"
                  :show-text="false"
                  :stroke-width="8"
                />
                <strong :style="{ color: scoreColor(selected.score) }">{{ selected.score }} 分</strong>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="评语" :span="2">{{ remark(selected) }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面背景 ===== */
.page {
  position: relative;
  min-height: 100vh;
  padding: 36px 16px 60px;
  background: linear-gradient(160deg, #f5f7ff 0%, #f0f4fa 45%, #eef7f6 100%);
  overflow-x: hidden;
}
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .5; pointer-events: none; }
.orb-1 { width: 380px; height: 380px; background: #c7d2fe; top: -120px; left: -80px; }
.orb-2 { width: 320px; height: 320px; background: #a7f3d0; bottom: -100px; right: -60px; }

.wrap { position: relative; z-index: 1; max-width: 1020px; margin: 0 auto; }

/* ===== 顶部 ===== */
.topbar {
  display: flex; justify-content: space-between; align-items: center;
  gap: 20px; flex-wrap: wrap;
  margin-bottom: 20px; padding: 20px 24px;
  border-radius: 18px;
  background: rgba(255, 255, 255, .78);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, .9);
  box-shadow: 0 8px 30px rgba(99, 102, 241, .08);
}
.brand { display: flex; align-items: center; gap: 14px; }
.logo {
  width: 46px; height: 46px; flex: 0 0 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700;
  box-shadow: 0 6px 16px rgba(99, 102, 241, .35);
}
h1 { margin: 0 0 4px; font-size: 21px; font-weight: 700; letter-spacing: -.3px; color: #1f2430; }
.brand p { margin: 0; font-size: 12.5px; color: #8b91a1; }

/* 只看及格开关（延伸练习） */
.switch-wrap { display: flex; align-items: center; gap: 12px; }
.pass-switch {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 14px; border-radius: 11px;
  background: #f4f5fa; cursor: pointer;
  font-size: 13.5px; color: #4b5563; user-select: none;
  transition: background .2s ease;
}
.pass-switch:hover { background: #eef0f8; }
.hidden-tip {
  font-size: 12px; color: #f59e0b;
  background: #fffbeb; border: 1px solid #fde68a;
  padding: 4px 10px; border-radius: 20px;
  animation: fadeIn .25s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; } }

.switcher { display: flex; gap: 4px; padding: 4px; border-radius: 12px; background: #eef0f6; }
.switch-btn {
  border: none; background: transparent;
  padding: 8px 20px; border-radius: 9px;
  font-size: 14px; font-family: inherit; color: #6b7280;
  cursor: pointer; transition: all .22s ease;
}
.switch-btn:hover { color: #4b5563; }
.switch-btn.active {
  background: #fff; color: #4f46e5; font-weight: 600;
  box-shadow: 0 2px 8px rgba(79, 70, 229, .16);
}

/* ===== 概览小卡 ===== */
.mini-stats {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px; margin-bottom: 18px;
}
.mini {
  padding: 14px 16px; border-radius: 14px;
  background: rgba(255, 255, 255, .8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, .9);
  box-shadow: 0 4px 16px rgba(31, 36, 48, .05);
  display: flex; flex-direction: column; gap: 2px;
  transition: transform .2s ease, box-shadow .2s ease;
}
.mini:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(31, 36, 48, .09); }
.mini-label { font-size: 12px; color: #8b91a1; }
.mini-value { font-size: 24px; font-weight: 700; line-height: 1.25; }
.mini-unit { font-size: 12px; color: #b0b5c0; }

/* ===== 主面板 ===== */
.panel {
  padding: 18px 20px; border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 40px rgba(31, 36, 48, .07);
  border: 1px solid #eef0f5;
}

/* 头像（三种视图共用）；图片头像用 object-fit 保证不变形 */
.avatar {
  width: 40px; height: 40px; flex: 0 0 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; font-size: 15px; font-weight: 600;
  display: inline-flex; align-items: center; justify-content: center;
}
img.avatar { object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(31, 36, 48, .12); }
.avatar-sm { width: 30px; height: 30px; flex-basis: 30px; font-size: 13px; }

/* ===== 表格模式 ===== */
.who-cell { display: flex; align-items: center; gap: 10px; }
.cell-name { font-weight: 600; color: #1f2430; }
.score-cell { display: flex; align-items: center; gap: 10px; }
.score-bar { flex: 1; }
.score-cell strong { width: 30px; text-align: right; font-size: 14px; }

/* ===== 卡片模式：auto-fill 网格，窄屏自动换列 =====
   原理：每列最小 300px、最大 1fr。容器宽度凑够几张卡就排几列，
   放不下就自动折到下一行 —— 纯 CSS 实现，不写一行 JS。
   想更容易看出换列效果，把下面的 300px 改大（如 380px）即可。 */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.stu-card {
  border-radius: 16px;
  border: 1px solid #eef0f5;
  transition: transform .2s ease, box-shadow .2s ease;
}
.stu-card:hover { transform: translateY(-3px); box-shadow: 0 12px 26px rgba(31, 36, 48, .1); }
.stu-card :deep(.el-card__body) { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.card-head { display: flex; align-items: center; gap: 12px; }
.card-name { font-weight: 700; font-size: 15.5px; color: #1f2430; }
.card-id { font-size: 12px; color: #a8adb8; margin-top: 2px; }
.card-tags { display: flex; gap: 6px; }
.card-row {
  display: flex; justify-content: space-between; font-size: 13px; color: #6b7280;
  border-bottom: 1px dashed #eef0f5; padding-bottom: 8px;
}
.card-row b { color: #303133; font-weight: 600; }
.card-score {
  display: flex; justify-content: space-between; align-items: baseline;
  font-size: 13px; color: #6b7280;
}
.card-score b { font-size: 22px; font-weight: 700; }

/* ===== 名单模式：一行一人，紧凑 ===== */
.list-panel { padding: 10px 16px; }
.list-row {
  display: flex; align-items: center; gap: 12px;
  padding: 9px 10px;
  border-radius: 10px;
  border-bottom: 1px solid #f2f3f7;
  transition: background .15s ease;
}
.list-row:last-child { border-bottom: none; }
.list-row:hover { background: #f6f7fd; }
.list-name { font-weight: 600; font-size: 14px; color: #1f2430; width: 64px; flex: 0 0 64px; }
.list-meta { flex: 1; font-size: 12.5px; color: #a8adb8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.list-score { width: 34px; text-align: right; font-size: 15px; }

/* ===== 分组模式（延伸练习） ===== */
.groups { display: flex; flex-direction: column; gap: 18px; }
.group {
  padding: 16px 18px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #eef0f5;
  box-shadow: 0 6px 24px rgba(31, 36, 48, .05);
}
.group-head { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
.g-dot { width: 10px; height: 10px; border-radius: 3px; flex: 0 0 10px; }
.g-name { font-weight: 700; font-size: 15px; color: #1f2430; }
.g-count {
  font-size: 12px; color: #6b7280;
  background: #f1f2f7; border-radius: 20px; padding: 2px 9px;
}
.g-line { flex: 1; height: 1px; background: linear-gradient(90deg, #e8eaf2, transparent); }
.g-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 10px;
}
.g-card {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fafbfd;
  border: 1px solid #f0f1f6;
  transition: transform .18s ease, box-shadow .18s ease;
}
.g-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(31, 36, 48, .08); }
.g-card.clickable { cursor: pointer; }

/* ===== 详情对话框（延伸练习） ===== */
.card-more { align-self: flex-start; padding: 0; }
.dlg-head { display: flex; align-items: center; gap: 12px; padding-right: 24px; }
.dlg-head .avatar { width: 44px; height: 44px; flex-basis: 44px; font-size: 17px; }
.dlg-title { flex: 1; }
.dlg-name { font-size: 16px; font-weight: 700; color: #1f2430; }
.dlg-id { font-size: 12px; color: #a8adb8; margin-top: 1px; }
.dlg-body :deep(.el-descriptions__label) { width: 64px; color: #8b91a1; }
.dlg-score { display: flex; align-items: center; gap: 12px; }
.dlg-score .el-progress { flex: 1; }
.dlg-score strong { font-size: 15px; white-space: nowrap; }
.g-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.g-nm { font-size: 13.5px; font-weight: 600; color: #1f2430; }
.g-meta { font-size: 11.5px; color: #a8adb8; margin-top: 1px; }
.g-score { font-size: 15px; width: 30px; text-align: right; flex: 0 0 30px; }

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .topbar { flex-direction: column; align-items: stretch; }
  .switcher { justify-content: center; }
  .list-row { flex-wrap: wrap; }
  .list-meta { flex-basis: 100%; order: 5; padding-left: 42px; }
}
</style>
