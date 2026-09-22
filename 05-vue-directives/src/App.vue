<script setup>
import { ref } from 'vue'

// 13 个练习组件，来自《Vue 常用指令实用练习册》官方源码
import P01VBind from './components/P01VBind.vue'
import P02VOn from './components/P02VOn.vue'
import P03VHtmlText from './components/P03VHtmlText.vue'
import P04VOnce from './components/P04VOnce.vue'
import P05VIf from './components/P05VIf.vue'
import P06VShow from './components/P06VShow.vue'
import P07VFor from './components/P07VFor.vue'
import P08VModel from './components/P08VModel.vue'
import P09ModelModifiers from './components/P09ModelModifiers.vue'
import P10Directives from './components/P10Directives.vue'
import P11VMemo from './components/P11VMemo.vue'
import P12VCloak from './components/P12VCloak.vue'
import P13VPre from './components/P13VPre.vue'

// 练习目录：编号、锚点、指令名、场景名、一句话作用
const catalog = [
  { no: '01', id: 'p01-bind',  directive: 'v-bind / :',        scene: '会员卡片的动态外观',       desc: '绑定属性、类名、样式' },
  { no: '02', id: 'p02-on',    directive: 'v-on / @',          scene: '点赞与快捷键',            desc: '绑定事件、修饰符' },
  { no: '03', id: 'p03-html',  directive: 'v-html / v-text',   scene: '公告栏的富文本',          desc: '插入内容的三种对照' },
  { no: '04', id: 'p04-once',  directive: 'v-once',            scene: '只渲染一次的内容',        desc: '页脚信息与时间戳对照' },
  { no: '05', id: 'p05-if',    directive: 'v-if 系列',         scene: '三种身份的提示条',        desc: '条件渲染，创建和销毁元素' },
  { no: '06', id: 'p06-show',  directive: 'v-show',            scene: '切不丢内容的选项卡',      desc: '只切换 display' },
  { no: '07', id: 'p07-for',   directive: 'v-for',             scene: '购物车清单',              desc: '列表渲染、key 的作用' },
  { no: '08', id: 'p08-model', directive: 'v-model',           scene: '一份报名表',              desc: '表单双向绑定' },
  { no: '09', id: 'p09-mod',   directive: 'v-model 修饰符',    scene: '结算页的价格输入',        desc: '.number / .trim / .lazy' },
  { no: '10', id: 'p10-direc', directive: '自定义指令',        scene: '聚焦、只许数字、高亮',    desc: '复用 DOM 操作' },
  { no: '11', id: 'p11-memo',  directive: 'v-memo',            scene: '跳过没变化的更新',        desc: '长列表性能优化' },
  { no: '12', id: 'p12-cloak', directive: 'v-cloak',           scene: '挂载前隐藏模板',          desc: '加载时的闪烁对比' },
  { no: '13', id: 'p13-pre',   directive: 'v-pre',             scene: '展示模板语法本身',        desc: '跳过编译，原样输出' },
]

// 组件映射：目录里的锚点对应到组件
const parts = [
  { id: 'p01-bind',  comp: P01VBind },
  { id: 'p02-on',    comp: P02VOn },
  { id: 'p03-html',  comp: P03VHtmlText },
  { id: 'p04-once',  comp: P04VOnce },
  { id: 'p05-if',    comp: P05VIf },
  { id: 'p06-show',  comp: P06VShow },
  { id: 'p07-for',   comp: P07VFor },
  { id: 'p08-model', comp: P08VModel },
  { id: 'p09-mod',   comp: P09ModelModifiers },
  { id: 'p10-direc', comp: P10Directives },
  { id: 'p11-memo',  comp: P11VMemo },
  { id: 'p12-cloak', comp: P12VCloak },
  { id: 'p13-pre',   comp: P13VPre },
]

const current = ref('')  // 仅供目录高亮显示当前节（el-anchor 自带联动）
</script>

<template>
  <div class="page">
    <!-- 头部 -->
    <header class="hero">
      <div class="hero__inner">
        <h1>Vue 指令练习册</h1>
        <p>
          13 个指令 · 13 个可以动手操作的小场景。改数据、点按钮、敲键盘，页面立刻给出反应。
          建议把某条指令删掉或换种写法，观察页面的变化。
        </p>
        <div class="hero__tags">
          <el-tag effect="dark" round>v-bind</el-tag>
          <el-tag effect="dark" round>v-on</el-tag>
          <el-tag effect="dark" round>v-html / v-text</el-tag>
          <el-tag effect="dark" round>v-once</el-tag>
          <el-tag effect="dark" round>v-if</el-tag>
          <el-tag effect="dark" round>v-show</el-tag>
          <el-tag effect="dark" round>v-for</el-tag>
          <el-tag effect="dark" round>v-model</el-tag>
          <el-tag effect="dark" round>自定义指令</el-tag>
          <el-tag effect="dark" round>v-memo</el-tag>
          <el-tag effect="dark" round>v-cloak</el-tag>
          <el-tag effect="dark" round>v-pre</el-tag>
        </div>
      </div>
    </header>

    <div class="layout">
      <!-- 左侧目录 -->
      <aside class="nav">
        <el-anchor :scroll-offset="90" direction="vertical">
          <el-anchor-link
            v-for="c in catalog"
            :key="c.id"
            :href="'#' + c.id"
            :title="c.no + ' ' + c.directive"
          />
        </el-anchor>
      </aside>

      <!-- 右侧内容流 -->
      <main class="content">
        <!-- 指令总览表 -->
        <section class="overview">
          <h2>指令总览</h2>
          <el-table :data="catalog" size="small" :border="true">
            <el-table-column prop="no" label="#" width="56" />
            <el-table-column label="指令" width="170">
              <template #default="{ row }">
                <a :href="'#' + row.id" class="jump">{{ row.directive }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="作用" width="220" />
            <el-table-column prop="scene" label="练习场景" />
          </el-table>
        </section>

        <!-- 13 个练习 -->
        <section
          v-for="(p, i) in parts"
          :key="p.id"
          :id="p.id"
          class="practice-block"
        >
          <div class="practice-block__no">{{ String(i + 1).padStart(2, '0') }}</div>
          <component :is="p.comp" />
          <el-divider />
        </section>

        <footer class="foot">
          完成《Vue 常用指令实用练习册》全部 13 个练习 · 源码来自课程教学文档
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f6f8fb;
}

/* 头部 */
.hero {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #0ea5e9 120%);
  color: #fff;
  padding: 44px 24px 40px;
}
.hero__inner { max-width: 1080px; margin: 0 auto; }
.hero h1 {
  margin: 0 0 10px;
  font-size: 30px;
  letter-spacing: -.5px;
}
.hero p {
  margin: 0 0 16px;
  max-width: 640px;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, .88);
}
.hero__tags { display: flex; flex-wrap: wrap; gap: 6px; }
.hero__tags .el-tag {
  background: rgba(255, 255, 255, .16);
  border-color: transparent;
  color: #fff;
}

/* 主体两栏 */
.layout {
  max-width: 1080px;
  margin: 0 auto;
  padding: 28px 24px 60px;
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

/* 左侧目录 */
.nav {
  position: sticky;
  top: 20px;
  width: 168px;
  flex: 0 0 168px;
  max-height: calc(100vh - 40px);
  overflow: auto;
}
@media (max-width: 900px) {
  .nav { display: none; }
}

/* 右侧内容 */
.content { flex: 1; min-width: 0; }

.overview {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 4px 18px rgba(31, 41, 55, .05);
  margin-bottom: 26px;
}
.overview h2 { margin: 0 0 14px; font-size: 18px; color: #1f2430; }
.jump { color: #4f46e5; text-decoration: none; font-weight: 600; }
.jump:hover { text-decoration: underline; }

/* 练习块 */
.practice-block {
  position: relative;
  background: #fff;
  border-radius: 14px;
  padding: 22px 26px;
  box-shadow: 0 4px 18px rgba(31, 41, 55, .05);
  margin-bottom: 24px;
  scroll-margin-top: 20px;
}
.practice-block__no {
  position: absolute;
  top: 18px;
  right: 22px;
  font-size: 30px;
  font-weight: 800;
  color: #eef0f7;
  letter-spacing: -1px;
  user-select: none;
}
.practice-block :deep(.el-divider--horizontal) { margin: 18px 0 0; }
.practice-block:last-of-type :deep(.el-divider--horizontal) { display: none; }

.foot {
  text-align: center;
  color: #a8adb8;
  font-size: 13px;
  padding: 10px 0 30px;
}
</style>
