<script lang="ts" setup>
// import { Editor } from '@dbptzn/xnote'
// import '@dbptzn/xnote/bundles/index.css'
// import { onMounted, ref } from 'vue'
// const editorRef = ref()
// onMounted(() => {
//   // console.log('editor ready.', Editor)
//   const editor = new Editor()
//   editor.mount(editorRef.value).then(() => {
//     console.log('编辑器准备完成。')
//   })
// })
</script>

<template>
  <div class="project">
    <div ref="editorRef" class="editor" />
  </div>
</template>

<style lang="scss" scoped>
.project {
  width: 100%;
}
.editor {
  width: 880px;
  height: 500px;
  margin: 0 auto;
  background-color: #bfdaa6;
}
</style>
