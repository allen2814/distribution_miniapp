<template>
    <up-popup :show="modelValue" mode="center" :closeable="true" bgColor="inherit" round="20rpx" @close="closePop">
        <view class="real-name-dialog">
            <text class="long-name">实名认证</text>
            <text class="title">
                根据国家相关政策要求，需要完成实名认证方可进行提现操作，未满18岁用户将受到系统限制。你的信息将进行严格的隐私保护，请放心认证。
            </text>
            <view class="close" @click="jumpRealName">去认证</view>
        </view>
    </up-popup>
</template>

<script lang="ts" setup>

const props = defineProps({
    modelValue: { type: Boolean, default: false },
});

const emits = defineEmits(['update:modelValue']);

//关闭弹窗
const closePop = () => {
    emits('update:modelValue', false);
};

//实名认证
const jumpRealName = async () => {
    closePop();
    uni.navigateTo({
        url: '/pages/home/real-name',
    });
};
</script>

<style lang="scss" scoped></style>