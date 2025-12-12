<template>
    <view class="wbl-navbar" :style="{ backgroundColor: bgColor }">
        <view class="wbl-status-bar"></view>
        <view class="wbl-navbar-content">
            <view class="content-left" v-if="autoBack" @click="goBack()">
                <up-icon name="arrow-left" size="20px" color="#1F2635"></up-icon>
            </view>
            <view class="content-title">
                <slot name="center"></slot>
            </view>
            <view class="content-right">
                <slot name="right"></slot>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useUserStore } from '@/stores';

withDefaults(
    defineProps<{
        bgColor?: string;
        autoBack?: boolean;
    }>(),
    {
        bgColor: 'transparent',
        autoBack: true,
    }
);

//返回上一页
const goBack = () => {
    uni.navigateBack();
};

</script>

<style lang="scss" scoped>
.wbl-navbar {
    width: 100%;
    display: flex;
    flex-flow: column;
    background: #fff;

    .wbl-navbar-content {
        position: relative;
        height: 44px;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;

        .content-left {
            padding: 0 13px;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: row;
            align-items: center;

        }

        .content-title {
            font-size: 1rem;
            color: var(--primary-color);
            font-weight: bold;
        }

        .content-right {
            padding: 0 13px;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }
}
</style>