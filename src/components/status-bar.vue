<template>
    <view class="status-bar" :style="{ backgroundColor: bgColor, height: appStatusBarHeight + 'px' }"></view>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import { useUserStore } from '@/stores';

withDefaults(
    defineProps<{
        bgColor?: string;
    }>(),
    {
        bgColor: 'transparent',
    }
);

const { appStatusBarHeight } = toRefs(useUserStore());
</script>

<style lang="scss" scoped></style>