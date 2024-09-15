<script lang="ts" setup>
// import { Fragment } from '@/store'
import { useThemeVars } from 'naive-ui'
import { ref } from 'vue'
// type Fragment = typeof projectStore.data[0]['fragments'][0]
// const props = defineProps<{
//   // 头像
//   roleList: Map<number, { name: string; avatar: string }>
//   // 数据
//   role: number
// }>()
const themeVars = useThemeVars()
// const fragmentRef = ref()
// const handleError = (ev: Event) => {
//   console.log(ev)
//   const target = ev.target as HTMLImageElement
//   target.src = './default.png'
// }
</script>

<template>
  <div class="wrapper'">
    <!-- ------------------------------------------- Left --------------------------------------------- -->
    <div class="audio-fragment left-fragment">
      <!-- 左侧 -->
      <LeftSide>
        <div class="avatar">
          <slot name="avatar" />
          <!-- <img :src="props.roleList.get(role)?.avatar || './default.png'" @error="handleError" /> -->
        </div>
      </LeftSide>
      <!-- 中间 -->
      <MiddleSide :flex="1" class="middle">
        <div class="msg msg-left">
          <slot name="txt" />
        </div>
        <div class="toolbar toolbar-left">
          <span>
            <slot name="play" />
          </span>
          <span>
            <slot name="restore" />
          </span>
          <span>
            <slot name="delete" />
          </span>
        </div>
      </MiddleSide>
      <!-- 右侧 -->
      <RightSide :width="50">
        <!-- Placeholder -->
      </RightSide>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.focus {
  border-color: #aaaaaa30 !important;
}
.wrapper {
  margin: 5px;
  border: 1px dashed #ffffff00;
  box-sizing: border-box;
}
.audio-fragment {
  display: flex;
  flex-direction: row;
  // flex-wrap: wrap;
  height: auto;
  width: 100%;
  margin-top: 10px;
  &:hover {
    .toolbar {
      opacity: 1;
    }
  }
}
.left-fragment {
  .middle {
    display: flex;
    justify-content: flex-start;
  }
}
.right-fragment {
  .middle {
    display: flex;
    justify-content: flex-end;
  }
}
.avatar {
  margin: 0 18px;
  :deep(img) {
    flex: auto;
    height: 38px;
    width: 38px;
    border-radius: 5px;
  }
}
.msg {
  margin: 6px;
  padding: 9px 18px 9px 18px;
  word-wrap: break-word;
  word-break: break-all;
  background-color: v-bind('themeVars.modalColor');
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.1);
}
.msg-left {
  border-radius: 0px 12px 12px 12px;
}
.msg-right {
  border-radius: 12px 0px 12px 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  // width: 100%;
  transition: opacity 0.5s ease;
  opacity: 0;
  cursor: pointer;
  span {
    display: flex;
    align-items: center;
    border-radius: v-bind('themeVars.borderRadius');
    padding: 3px;
    color: v-bind('themeVars.textColor2');
    &:hover {
      // background-color: @--button-hover-bg;
      color: v-bind('themeVars.textColor1');
    }
  }
}
.toolbar-left {
  justify-content: flex-start;
  // margin-left: @--margin-xs;
}
.toolbar-right {
  justify-content: flex-end;
  // margin-right: @--margin-xs;
}
</style>
