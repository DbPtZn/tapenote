<script lang="ts" setup>
import { inject, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'
import { useDialog, useMessage, useThemeVars } from 'naive-ui'
import { Layout, textAlignFormatter } from '@textbus/editor'
import { ComponentInstance, Selection, Injector, Renderer, fromEvent, Commander, Keyboard } from '@textbus/core'
import _ from 'lodash'


const injector = inject('injector') as Injector
const themeVars = useThemeVars()
const dialog = useDialog()
const message = useMessage()

const renderer = injector.get(Renderer)
const commander = injector.get(Commander)
const selection = injector.get(Selection)
const keyboard = injector.get(Keyboard)

const menuEl = useTemplateRef<HTMLElement>('menuEl')

keyboard.addZenCodingInterceptor({
  match: function (content: string): boolean {
    return content === '/'
  },
  try: function (key: string): boolean {
    console.log(key)
    return key === '/'
  },
  action: function (content: string): boolean {
    throw new Error('Function not implemented.')
  }
})


</script>

<template>
  <div ref="menuEl" class="shotcut-menu">
  
    
  </div>
</template>

<style lang="scss" scoped>
</style>
