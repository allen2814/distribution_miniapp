<template>
    <z-paging ref="paging" :fixed="false" :refresher-enabled="false" :auto-show-back-to-top="true"
        :loading-more-enabled="false">
        <template #backToTop>
            <view class="back-top">
                <i class="iconfont">&#xe703;</i>
            </view>
        </template>
        <view class="guide-list">
            <image class="guide-title" src="@/static/images/guide-title.png" mode="widthFix" />
            <view class="item" @tap="jumpInfo(1)">
                <text class="title">1.入驻达人中心路径</text>
                <text class="iconfont">&#xe6a3;</text>
            </view>
            <view class="item">
                <text class="title">1.入驻达人中心路径</text>
                <text class="iconfont">&#xe6a3;</text>
            </view>
            <view class="item">
                <text class="title">1.入驻达人中心路径</text>
                <text class="iconfont">&#xe6a3;</text>
            </view>
            <view class="item">
                <text class="title">1.入驻达人中心路径</text>
                <text class="iconfont">&#xe6a3;</text>
            </view>
            <view class="item">
                <text class="title">1.入驻达人中心路径</text>
                <text class="iconfont">&#xe6a3;</text>
            </view>
        </view>
    </z-paging>
</template>

<script setup lang='ts'>
//跳转消息详情
const jumpInfo = (id: number) => {
    uni.navigateTo({
        url: `/pages/message/guide/info?id=${id}`,
    });
};
</script>

<style lang="scss" scoped>
.guide-list {
    padding: 30rpx;
    margin: 20rpx 30rpx;
    background: linear-gradient(180deg, #FFF4DB -2.1%, #FFF 18.69%, #FFF 102.66%);
    border-radius: 20rpx;
    border: 1px solid #FFF;

    .guide-title {
        width: 60%;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 0;

        .title {
            font-size: 30rpx;
            color: #9D5C3A;
            font-weight: 500;
        }

        .iconfont {
            font-size: 32rpx;
            color: #A6A7AF;
        }
    }
}
</style>