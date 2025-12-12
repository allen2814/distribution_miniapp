<template>
    <view class="container myp-flex-column">
        <up-navbar bgColor="inherit" :fixed="false" leftIcon="">
            <template #center>
                <text class="up-navbar-title">公告</text>
            </template>
            <template #right>
                <CapsuleButton />
            </template>
        </up-navbar>
        <view class="myp-flex-column myp-full-flex">
            <view class="tabs-analysis" style="margin: 20rpx 30rpx">
                <view class="tab-item" v-for="(tab, index) in tabs" :key="index"
                    :class="{ active: tabs_index === index }" @click="handelTabs(index)">
                    {{ tab.name }}
                </view>
            </view>
            <view class="myp-full-flex">
                <!-- <Guide v-if="tabs_index === 0" /> -->
                <Notice />
            </view>
        </view>
    </view>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

import CapsuleButton from '@/components/capsule-button.vue';
import Guide from './guide/index.vue';
import Notice from './notice/index.vue';

const tabs_index = ref<number>(0);
const tabs = reactive([
    // { name: '新手引导' },
    { name: '平台通知' },
]);

const handelTabs = (index: number) => {
    tabs_index.value = index;
};

onShow(() => {
    //tabs_index.value = 0;
});
</script>

<style lang="scss" scoped>
.container {
    background-color: #F7F9FC;
    background-image: url('@/static/images/banner-small.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
}
</style>