<template>
    <view class="item" v-for="(item, index) in list" :key="index">
        <view class="name-view">
            <text class="name">{{ item.biz_type === 1 ? '别名' : '刷一刷' }}：{{ item.alias_name }}</text>
            <text class="defult-description">{{ item.pay_time }}</text>
        </view>
        <view class="info-view">
            <view class="info-view-item">
                <view class="value">
                    <text class="currency">￥</text>
                    {{ safeToFixed(item.money, 2) }}
                </view>
                <!-- <text class="label">{{ item.is_first ? '首充' : '复冲' }}</text> -->
                <text class="label">充值</text>
            </view>
            <view class="info-view-item">
                <view class="value">
                    {{ item.ratio }}
                </view>
                <text class="label">分账比例</text>
            </view>
            <view class="info-view-item">
                <view class="value color1">
                    <text class="currency">￥</text>
                    {{ item.share_money }}
                </view>
                <text class="label">佣金</text>
            </view>
        </view>
        <view class="bottom-view">
            <view class="name">
                {{ item.product_name }}
                <text class="cate-tag">【{{ item.spread_type ? SpreadTypeEnum[item.spread_type] : '短视频' }}】</text>
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
