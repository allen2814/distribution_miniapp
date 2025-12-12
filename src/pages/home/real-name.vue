<template>
    <view class="page">
        <Navbar bgColor="inherit">
            <template #center>
                <text class="up-navbar-title">我的</text>
            </template>
            <template #right>
                <CapsuleButton />
            </template>
        </Navbar>
        <template v-if="userInfo?.verification_status == 2">
            <view class="wrappersuccess">
                <text class="iconfont">&#xe656;</text>
                <text class="success-title mt20">实名认证成功</text>
                <text class="success-title mt20">{{ userInfo.real_name }}</text>
                <text class="success-mark mt20">{{ userInfo.id_card_number }}</text>
            </view>
        </template>
        <template v-else>
            <view class="main-wrapper form">
                <view class="content-inner">
                    <view class="form-item">
                        <view class="label">
                            <text class="required">*</text>
                            <text class="title">姓名</text>
                        </view>
                        <view class="input-wrapper">
                            <input v-model="from.real_name" class="input" type="text" placeholder="请输入真实姓名" />
                        </view>
                    </view>
                    <view class="form-item">
                        <view class="label">
                            <text class="required">*</text>
                            <text class="title">身份证号</text>
                        </view>
                        <view class="input-wrapper">
                            <input v-model="from.id_card_number" class="input" type="text" placeholder="请输入身份证号" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="defult-add mt30" @click="submit">
                立即认证
            </view>
        </template>
    </view>
</template>

<script setup lang='ts'>
import { reactive, toRefs } from 'vue';
import { useUserStore } from '@/stores';

import Navbar from '@/components/navbar.vue';
import CapsuleButton from '@/components/capsule-button.vue';
import { apiUserRealNameAuth } from '@/api/user';

const { userInfo } = toRefs(useUserStore());
const from = reactive({
    real_name: '',
    id_card_number: '',
    user_type: 1,
});

//提交
const submit = async () => {
    if (!userInfo.value) return;

    if (!from.real_name) {
        uni.showToast({
            title: '请输入真实姓名',
            icon: 'none',
        });
        return;
    }
    if (!from.id_card_number) {
        uni.showToast({
            title: '请输入身份证号',
            icon: 'none',
        });
        return;
    }

    uni.showLoading();
    const res = await apiUserRealNameAuth(from);
    uni.hideLoading();
    if (res.code === 200) {
        uni.showToast({ title: res.msg, icon: 'none', duration: 2000 });
        userInfo.value.real_name = from.real_name;
        userInfo.value.id_card_number = from.id_card_number;
        userInfo.value.verification_status = 2;
        setTimeout(() => {
            uni.navigateBack();
        }, 2000);
    } else {
        uni.showToast({
            title: res.msg || '认证失败',
            icon: 'none',
        });
    }
};
</script>

<style lang="scss" scoped>
.wrappersuccess {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100rpx;

    .iconfont {
        font-size: 100rpx;
        color: #4CAF50;
    }

    .success-title {
        font-size: 32rpx;
        color: #333;
        font-weight: bold;
    }

    .success-mark {
        font-size: 28rpx;
        color: #666;
    }
}
</style>