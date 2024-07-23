<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import type { UserListItem } from '~/types'
/** 定义页面元数据 */
// definePageMeta({
//   layout: false
// })
const users = ref<UserListItem[]>([])
useFetch<UserListItem[]>('/api/user/list').then(res => {
  console.log(res)
  console.log(res.data.value)
  if(res.data.value) users.value = res.data.value
})
const themeVars = useThemeVars()
function handleClick(id: number) {
  console.log('click')
  navigateTo(`/articles/${id}`)
}
</script>

<template>
  <div class="home">
    <div class="cards">
      <BloggerCard 
        class="blogger-card" 
        v-for="item in users" 
        :key="item.UID"
        :data="item"
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
.cards {
  padding-top: 36px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap ;
  margin: 0 auto;
  --n: 4;
  --space: calc(100% - var(--n) * 240px);
  --h: calc(var(--space) / var(--n) / 2);
  .blogger-card {
    margin: 10px var(--h);
  }
}
.home {
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  background-color: v-bind('themeVars.bodyColor');
}

@include Desktop {
  .cards {
    max-width: 1024px;
  }
}
@media (min-width: 1024px) {
  .cards {
    max-width: 1024px;
  }
}

@media (max-width: 1024px) {
  .cards {
    --n: 3;
  }
}
@include Mobile {
  .cards {
    --n: 2;
  }
}
</style>

