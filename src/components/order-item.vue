<template>
    <view class="item" v-for="(item, index) in list" :key="index">
        <view class="name-view">
            <text class="name">别名：{{ item.alias_name }}</text>
            <text class="defult-description">{{ formatDateTime(item.pay_time, 'yyyy-MM-dd HH:mm') }}</text>
        </view>
        <view class="info-view">
            <view class="info-view-item">
                <view class="value">
                    <text class="currency">￥</text>
                    {{ safeToFixed(item.money, 2) }}
                </view>
                <text class="label">{{ item.is_first ? '首充' : '复冲' }}金额</text>
            </view>
            <view class="info-view-item">
                <view class="value">
                    {{ item.ratio }}
                </view>
                <text class="label">结算比例</text>
            </view>
            <view class="info-view-item">
                <view class="value color1">
                    <text class="currency">￥</text>
                    {{ item.share_money }}
                </view>
                <text class="label">收益金额</text>
            </view>
        </view>
        <view class="bottom-view">
            <view class="name">
                {{ item.name }}
                <text class="cate-tag display-none">【{{ SpreadTypeEnum[item.spread_type] }}】</text>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { formatDateTime, safeToFixed } from '@/utils';
import { SpreadTypeEnum } from '@/utils/enums';

const props = withDefaults(
    defineProps<{
        list?: any[];
    }>(),
    {}
);
</script>
<style lang="scss" scoped></style>
