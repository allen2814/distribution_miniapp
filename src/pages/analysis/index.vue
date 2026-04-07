<template>
    <view class="container">
        <up-navbar bgColor="inherit" :fixed="false" leftIcon="" :autoBack="true">
            <template #center>
                <text class="up-navbar-title">数据</text>
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
                <AliasRecord v-if="tabs_index === 0" />
                <AlbumPushing v-if="tabs_index === 1" />
            </view>
        </view>
    </view>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue';

import CapsuleButton from '@/components/capsule-button.vue';
import AliasRecord from './alias-record.vue';
import AlbumPushing from './album-pushing.vue';

const tabs_index = ref<number>(0);
const tabs = reactive([
    { name: '申词记录' },
    { name: '在推列表' },
]);

const handelTabs = (index: number) => {
    tabs_index.value = index;
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #F7F9FC;
    background-image: url('@/static/images/banner-small.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
}
</style>