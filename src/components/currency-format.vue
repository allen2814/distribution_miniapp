<template>
    <view class="currency-format" :style="`font-size: ${fontSize}rpx; color: ${color}; font-weight: ${fontWeight}`">
        <text class="currency-format-tip">￥</text>
        <text>{{ computedValue }}</text>
        <text v-if="computedValueString" class="currency-format-tip">{{ computedValueString }}</text>
    </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

/** 解析金额，无效值返回 null */
const parseAmount = (value: number | string | null | undefined): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    const str = String(value).trim();
    if (!str) return null;
    const cleaned = str.replace(/,/g, '').replace(/[￥¥]/g, '');
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
};

/** 截断到指定小数位，不四舍五入 */
const truncateToFixed = (value: number, decimals: number) => {
    const factor = 10 ** decimals;
    return (Math.trunc(value * factor) / factor).toFixed(decimals);
};

const props = defineProps({
    value: {
        type: [Number, String, null],
    },
    fontSize: {
        type: [Number, String],
        default: 28,
    },
    color: {
        type: String,
        default: '#1F2635',
    },
    fontWeight: {
        type: [Number, String],
        default: 'normal',
    },
});

const parsedAmount = computed(() => parseAmount(props.value));

const computedValue = computed(() => {
    const val = parsedAmount.value;
    if (val === null) return '--';
    if (val < 10000) {
        return truncateToFixed(val, 2);
    }
    return truncateToFixed(val / 10000, 2);
});

const computedValueString = computed(() => {
    const val = parsedAmount.value;
    if (val === null || val < 10000) return '';
    return '万';
});
</script>

<style lang="scss" scoped>
.currency-format {
    vertical-align: bottom;
    display: inline-block;
}

.currency-format-tip {
    font-size: 26rpx;
}
</style>
