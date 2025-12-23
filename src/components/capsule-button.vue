<template>
    <view class="capsule-button">
        <view class="item" @click="isMenuBox = true">
            <view class="iconfont">&#xe7f7;</view>
        </view>
        <view class="item" @click="closePage">
            <view class="iconfont">&#xe646;</view>
        </view>
    </view>

    <up-popup :customStyle="{ 'background': '#f1f1f1' }" :show="isMenuBox" mode="bottom" :closeable="false"
        @close="isMenuBox = false">
        <view class="menu-box">
            <view class="menu-box-title">
                <image src="@/static/images/u-logo.png" mode="aspectFit" />
                达人中心
            </view>
            <view class="list">
                <view class="item" @click="jumpAbout()">
                    <view class="top">
                        <view class="iconfont">&#xe6e5;</view>
                    </view>
                    <text class="title">关于</text>
                </view>
                <view class="item" @click="reEnterPage()">
                    <view class="top">
                        <view class="iconfont">&#xe6a4;</view>
                    </view>
                    <text class="title">重新进入</text>
                </view>
            </view>
            <view class="footer" @click="isMenuBox = false">
                <text class="footer-text">取消</text>
            </view>
        </view>
    </up-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isMenuBox = ref<boolean>(false);

//关闭小程序
const closePage = () => {
    if (typeof plus !== 'undefined') {
        plus.runtime.quit()
    }
};

//跳转关于页面
const jumpAbout = () => {
    isMenuBox.value = false;
    uni.navigateTo({
        url: '/pages/about/index',
    });
};

//重新进入页面 app端重新启动小程序
const reEnterPage = () => {
    isMenuBox.value = false;
    uni.reLaunch({
        url: '/pages/index',
    });
};
</script>
<style lang="scss" scoped>
.menu-box {
    padding: 30rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;

    .menu-box-title {
        text-align: center;
        font-size: 30rpx;
        font-weight: bold;
        color: #1F2635;
        display: inline-block;
        padding: 8rpx 16rpx;
        display: flex;
        align-items: center;
        justify-content: start;

        image {
            width: 55rpx;
            height: 55rpx;
            border-radius: 50%;
            margin-right: 12rpx;
        }
    }

    .list {
        margin-top: 20rpx;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 40rpx;

        .item {
            display: flex;
            flex-flow: column;
            align-items: center;

            .top {
                width: 100%;
                aspect-ratio: 1 / 1;
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
                border-radius: 20rpx;
                background: #fff;

                .iconfont {
                    font-size: 45rpx;
                    color: #1F2635;
                }
            }

            .title {
                text-align: center;
                margin-top: 10rpx;
                font-size: 26rpx;
                color: #1F2635;
            }
        }
    }

    .footer {
        border-top: 1rpx solid #e0e0e0;
        margin-top: 30rpx;
        padding-top: 20rpx;
        text-align: center;

        .footer-text {
            font-size: 26rpx;
            color: #1F2635;
        }
    }
}
</style>