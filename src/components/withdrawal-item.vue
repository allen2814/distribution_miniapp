<template>
    <view class="item" v-for="(item, index) in list" :key="index">
        <view class="name-view">
            <text class="name">{{ formatDateTime(item.apply_time, 'yyyy-MM-dd HH:mm') }}</text>
            <view class="date">
                <text class="btn btn4 ml10" v-if="item.status == 0">待审核</text>
                <text class="btn btn1 ml10" v-else-if="item.status == 1">提现成功</text>
                <view class="btn btn2 ml10" v-else-if="item.status == 2" style="display: flex;"
                    @click="showReview(item.review_remark)">
                    提现失败
                    <up-icon name="question-circle-fill" color="#FF5730" size="14"></up-icon>
                </view>
                <text class="btn btn3 ml10" v-else-if="item.status == 3">已取消</text>
                <text class="btn btn1 ml10" v-else-if="item.status == 4">审核成功</text>
            </view>
        </view>
        <view class="info-view">
            <view class="info-view-item">
                <view class="value">
                    <text class="currency">￥</text>
                    {{ safeToFixed(item.amount, 2) }}
                </view>
                <text class="label">提现金额</text>
            </view>
            <view class="info-view-item">
                <view class="value">
                    <text class="currency">￥</text>
                    {{ safeToFixed(item.tax, 2) }}
                </view>
                <text class="label">税费</text>
            </view>
            <view class="info-view-item">
                <view class="value color1">
                    <text class="currency">￥</text>
                    {{ safeToFixed(item.actual_amount, 2) }}
                </view>
                <text class="label">到账金额</text>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { formatDateTime, safeToFixed } from '@/utils';

const props = withDefaults(
    defineProps<{
        list?: any[];
    }>(),
    {}
);

const showReview = (str: string) => {
    uni.showModal({
        title: '提现失败原因',
        content: str,
        showCancel: false,
    });
};
</script>
<style lang="scss" scoped>
.info-view {
    padding-bottom: 0 !important;
}
</style>
