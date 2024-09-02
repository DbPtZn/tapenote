<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
const themeVars = useThemeVars()
const state = {
  msg: import.meta.env.VITE_FOOTER_MSG,
  icp: import.meta.env.VITE_ICP_RECORD,
  icpUrl: import.meta.env.VITE_ICP_URL,
  police: import.meta.env.VITE_POLICE_RECORD,
  policeUrl: import.meta.env.VITE_POLICE_URL
}
</script>
<template>
  <div class="footer" :style="{ display: 'flex', alignItems: 'center', flexDirection: 'column', paddingBottom: '20px', color: themeVars.textColor1 }">
    <div class="message">{{ state.msg }}</div>
    <div>
      <a style="text-decoration: none" :href="state.policeUrl" rel="noreferrer" target="_blank">
        <img
          style="display: inline; height: 16px; width: 16px; margin-right: 3px; margin-bottom: 2px; vertical-align: middle"
          src="/备案图标.png"
          alt="police"
        />
        {{ state.police }}
      </a>
      <span>&nbsp;&nbsp;</span>
      <a :href="state.icpUrl" style="text-decoration: none">{{ state.icp }}</a>
    </div>
  </div>
</template>

