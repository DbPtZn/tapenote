<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useThemeVars } from 'naive-ui'
const props = defineProps<{
  onConfirm: (name: string, site: string) => void
}>()
const model = ref({
    name: '',
    site: ''
})
function handleConfirm() {
    props.onConfirm(model.value.name, model.value.site)
}
</script>

<template>
  <div class="add-blog-form">
    <n-form>
        <n-form-item path="name" label="名称">
            <n-input class="form-input" v-model:value="model.name" type="text" placeholder="名称" maxlength="18" show-count />
        </n-form-item>
        <n-form-item path="site" label="博客地址">
            <n-input class="form-input" v-model:value="model.site" type="text" placeholder="博客地址"  />
        </n-form-item>
    </n-form>
    <div class="footer">
        <n-button class="confirm" @click="handleConfirm">确认</n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
    display: flex;
    flex-direction: row;
    justify-content: end;
}
.name {
  color: var(--dpz-textColor1);
}
</style>
