<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')

  // #ifdef APP-PLUS
  const appid = plus.runtime.appid || ''
  plus.runtime.getProperty(appid, (info) => {
    console.log('当前版本', info.version)
  })
  // #endif
})
</script>

<style lang="scss">
/* 全局样式，这里不能加 scoped */

/* 小程序端不支持 * 选择器，只能显式列出标签 */
view,
text,
image {
  box-sizing: border-box;
}

page {
  background: $mb-bg;
  color: $mb-text-strong;
  font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
</style>
