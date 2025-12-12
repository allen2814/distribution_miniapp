<template>
    <view class="content-wrapper">
        <view class="content-top">
            <slot name="top"></slot>
        </view>
        <view class="content-scroll">
            <slot name="center"></slot>
        </view>
        <view class="content-bottom">
            <slot name="bottom"></slot>
        </view>
    </view>
</template>

<script setup lang="ts">
// 无需额外逻辑
</script>

<style scoped>
.content-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.content-top {
    flex-shrink: 0;
}

.content-scroll {
    flex: 1;
    overflow-y: auto;
}

.content-bottom {
    flex-shrink: 0;
}
</style>