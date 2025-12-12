<template>
    <view v-if="modelValue" class="modal-root">
        <view class="modal-mask" @click="onMaskClick"></view>
        <view class="modal-box">
            <view class="top-bar">
                <text class="title">
                    <slot name="title">
                        {{ title }}
                    </slot>
                </text>
                <view v-if="showClose" class="close-button" @click="close">
                    <text class="iconfont">&#xe646;</text>
                </view>
            </view>

            <view class="content">
                <slot></slot>
            </view>

            <view class="actions">
                <slot name="actions">
                    <view class="cancel-button" @click="cancel">
                        <text class="label">{{ cancelText }}</text>
                    </view>
                    <view class="confirm-button" @click="confirm">
                        <text class="label">{{ confirmText }}</text>
                    </view>
                </slot>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">


const props = defineProps({
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    cancelText: { type: String, default: '取消' },
    confirmText: { type: String, default: '确认' },
    showClose: { type: Boolean, default: true },
    maskClosable: { type: Boolean, default: true } // 点击遮罩是否关闭
});

const emits = defineEmits(['update:modelValue', 'cancel', 'confirm', 'close']);

// 关闭弹窗
function close() {
    emits('update:modelValue', false);
    emits('close');
}

// 点击取消
function cancel() {
    emits('cancel');
    emits('update:modelValue', false);
}

// 点击确认
function confirm() {
    emits('confirm');
}

// 点击遮罩
function onMaskClick() {
    if (props.maskClosable) close();
}
</script>

<style scoped lang="scss">
.modal-root {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.modal-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}

.modal-box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 86%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;
}

/* top */
.top-bar {
    position: relative;
    padding: 0 30rpx;
    height: 90rpx;
    line-height: 90rpx;
    text-align: left;
    font-size: 32rpx;
    font-weight: bold;
    color: var(--primary-color);
    border-bottom: 1rpx solid #f1f1f1;
}

.close-button {
    position: absolute;
    right: 30rpx;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;

    .iconfont {
        font-size: 32rpx;
        color: #A0A5B6;
    }
}

.content {
    padding: 30rpx;
    max-height: 60vh;
    overflow: auto;
}

.actions {
    display: flex;
    border-top: 1rpx solid #f1f1f1;
    padding: 20rpx 30rpx;
    justify-content: flex-end;

    .cancel-button,
    .confirm-button {
        height: 60rpx;
        line-height: 60rpx;
        padding: 0 40rpx;
        border-radius: 4px;
        text-align: center;
        font-size: 28rpx;
        color: var(--primary-color);
        margin-left: 20rpx;
    }

    .cancel-button {
        border: 1px solid #E4E8EB;
        color: var(--primary-color1);
    }

    .confirm-button {
        background: var(--primary-color2);
        border: 1px solid var(--primary-color2);
        color: #fff;
    }
}
</style>