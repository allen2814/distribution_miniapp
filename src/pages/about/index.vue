<template>
    <view class="page myp-flex-column">
        <up-navbar bgColor="inherit" :fixed="true" :autoBack="true">
            <template #center>
                <text class="up-navbar-title">关于</text>
            </template>
            <template #right>
                <CapsuleButton />
            </template>
        </up-navbar>
        <view class="page-content">
            <view class="user_menu">
                <view class="item">
                    <image src="@/static/images/u-logo.png"></image>
                    <text class="title">达人中心</text>
                </view>
                <view class="item" style="flex-flow: column;align-items: self-start;">
                    <text class="title">简介</text>
                    <text class="content">
                        兔 U 达人中心是聚焦广播剧生态的官方推广合作平台，专为达人提供广播剧分发变现的一站式服务，依托兔 U 丰富的正版广播剧资源，让达人轻松实现流量变现。
                    </text>
                </view>
                <!-- <view class="item">
                    <text class="title">版本</text>
                    <text class="right-text">V{{ appVersion }}</text>
                </view> -->
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const appVersion = ref<string>('');

onMounted(() => {
    appVersion.value = uni.getSystemInfoSync().appVersion;
});

</script>
<style lang="scss" scoped>
.user_menu {
    border-radius: 10rpx;
    background: #ffffff;

    .item {
        border-bottom: 1rpx solid #F0F0F0;
        padding: 20rpx;
        display: flex;
        align-items: center;
        flex-flow: row;

        image {
            width: 65rpx;
            height: 65rpx;
            padding-right: 10rpx;
        }

        &:last-child {
            border-bottom: none
        }

        .title {
            flex: 1;
            font-size: 30rpx;
            font-weight: bold;
            padding-left: 10rpx;
        }

        .content {
            margin-top: 10rpx;
            font-size: 28rpx;
            color: #666666;
            padding-left: 10rpx;
            line-height: 44rpx;
        }

        .right-text {
            text-align: right;
            color: #9c9c9c;
            font-size: 26rpx;
        }

        i {
            color: #999999;
        }

        .leftIcom {
            color: #333 !important;
            font-size: 45rpx;
        }
    }
}
</style>