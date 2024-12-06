<script lang="ts" setup></script>

<template>
  <div class="guide">
    <!-- <iframe
      src="//player.bilibili.com/player.html?isOutside=true&aid=113605894805981&bvid=BV1sViBYLEmQ&cid=25723802129&p=1"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
    ></iframe> -->
    <iframe
      src="https://player.bilibili.com/player.html?isOutside=true&aid=113605894805981&bvid=BV1sViBYLEmQ&cid=25723802129&p=1"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
    ></iframe>
  </div>
</template>

<style lang="scss" scoped>
.guide {
  display: flex;
  align-items: center;
  justify-content: center;
}
iframe {
  width: 100%;
  height: 100%;
  // width: 1068px;
  height: 600px;
  border-radius: 12px;
}
</style>
