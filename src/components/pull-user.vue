<template>
    <view class="item" v-for="(item, index) in list" :key="index">
        <view class="name-view">
            <text class="name">别名：{{ item.alias_name }}</text>
            <text class="defult-description">{{ item.created_at }}</text>
        </view>
        <view class="info-view">
            <view class="info-view-item">
                <view class="value">
                    {{ item.user_count ?? 0 }}
                    <text class="unit">人</text>
                </view>
                <text class="label">拉新人数</text>
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
                <text class="cate-tag">【{{ SpreadTypeEnum[item.spread_type] }}】</text>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { formatDateTime } from '@/utils';
import { SpreadTypeEnum } from '@/utils/enums';

const props = withDefaults(
    defineProps<{
        list?: any[];
    }>(),
    {}
);
</script>
<style lang="scss" scoped>
.unit {
    font-size: 21rpx;
}
</style>
