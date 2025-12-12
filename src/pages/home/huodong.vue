<template>
    <web-view :src="`http://bl.mixs.cn/index.html?user_id=${userInfo?.user_id}`"></web-view>
</template>

<script setup lang='ts'>
import { toRefs } from 'vue';
import { useUserStore } from '@/stores';

const { userInfo } = toRefs(useUserStore());
</script>

<style lang="scss" scoped></style>