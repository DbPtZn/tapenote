<script lang="ts" setup></script>

<template>
  <div class="guide">
    <!-- <iframe
      src="https://www.bilibili.com/video/BV1Cz4y1e7Hn"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
    >
    </iframe> -->
    <iframe
      src="https://player.bilibili.com/player.html?isOutside=true&aid=997303708&bvid=BV1vs4y1y767&cid=1164001990&p=1&autoplay=0&high_quality=1"
      scrolling="no"
      border="0"
      frameborder="no"
      framespacing="0"
      allowfullscreen="true"
      allow="autoplay"
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
