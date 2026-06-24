<template>
    <view class="item" v-for="(item, index) in list" :key="index">
        <view class="name-view">
            <text class="name">{{ item.name }}</text>
            <text class="defult-description">{{ formatDateTime(item.created_at, 'yyyy-MM-dd HH:mm') }}</text>
        </view>
        <view class="info-view">
            <view class="info-view-item">
                <view class="value">
                    <text class="currency">￥</text>
                    {{ safeToFixed(item.amount, 2) }}
                </view>
                <text class="label">福利</text>
            </view>
            <view class="info-view-item">
                <view class="value">
                    100%
                </view>
                <text class="label">分账比例</text>
            </view>
            <view class="info-view-item">
                <view class="value color1">
                    <text class="currency">￥</text>
                    {{ safeToFixed(item.amount, 2) }}
                </view>
                <text class="label">佣金</text>
            </view>
        </view>
        <view class="bottom-view">
            <view class="name">
                达人福利
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { formatDateTime, safeToFixed } from '@/utils';

withDefaults(
    defineProps<{
        list?: any[];
    }>(),
    {}
);
</script>
<style lang="scss" scoped></style>
