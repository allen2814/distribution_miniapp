<template>
    <view class="currency-format" :style="`font-size: ${fontSize}rpx; color: ${color}; font-weight: ${fontWeight}`">
        <text class="currency-format-tip">￥</text>
        <text>{{ computedValue }}</text>
        <text class="currency-format-tip">{{ computedValueString }}</text>
    </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

/** 截断到指定小数位，不四舍五入 */
const truncateToFixed = (value: number, decimals: number) => {
	if (isNaN(value)) return '0.00';
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

const computedValue = computed(() => {
    let val = Number(props.value);

    if (val < 10000) {
        return truncateToFixed(val, 2);
    }
    return truncateToFixed(val / 10000, 2);
});

const computedValueString = computed(() => {
    let val = Number(props.value);

    if (val < 10000) {
        return '';
    } else {
        return '万';
    }
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