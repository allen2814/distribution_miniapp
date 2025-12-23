<template>
    <view class="page">
        <up-navbar bgColor="inherit" :autoBack="true">
            <template #center>
                <text class="up-navbar-title">我的</text>
            </template>
            <template #right>
                <CapsuleButton />
            </template>
        </up-navbar>

        <view class="page-content" v-if="userInfo?.verification_status !== 2">
            <view class="main-wrapper">
                <view class="real-form">
                    <view class="left">
                        <view class="real-form-item">
                            <view class="title">真实姓名</view>
                            <view class="value">
                                {{ maskName(userInfo?.real_name) }}
                            </view>
                        </view>
                        <view class="real-form-item">
                            <view class="title">身份证号</view>
                            <view class="value">
                                {{ maskNumber(userInfo?.id_card_number ?? '') }}
                            </view>
                        </view>
                    </view>
                    <view class="right">
                        <image src="@/static/images/realName.png" mode="aspectFill" />
                        已实名认证
                    </view>
                </view>
            </view>
        </view>
        <view class="page-content" v-else>
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
            {{ any }}
            <view class="defult-add mt30" @click="submit" v-if="!isRealNameLoading">
                立即认证
            </view>
            <view class="defult-add mt30" style="display:flex; flex-direction: row;justify-content: center;" v-else>
                <up-loading-icon size="16" color="#ffffff" style="margin-right: 10rpx;"></up-loading-icon>
                实名认证中...
            </view>
        </view>
    </view>
</template>

<script setup lang='ts'>
import { reactive, ref, toRefs } from 'vue';
import { apiGetRealNameAuthResult, apiGetRealNameAuthUrl, apiSensitive, apiUserRealNameAuth } from '@/api/user';
import { useUserStore } from '@/stores';
import { maskNumber } from '@/utils/index';

import CapsuleButton from '@/components/capsule-button.vue';
import { onShow } from '@dcloudio/uni-app';

const { userInfo } = toRefs(useUserStore());
const isRealNameLoading = ref<boolean>(false);

const from = reactive({
    real_name: '王宝龙',
    id_card_number: '152325191001272519',
});

// 姓名掩码：显示首字及尾字，中间用 * 替代（长度<=2 不掩码）
const maskName = (name?: string | null) => {
    if (!name) return '';
    const len = name.length;
    if (len <= 2) return name;
    return name[0] + '*'.repeat(len - 2) + name[len - 1];
};

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
    } else {
        const idCardRegex = /(^\d{15}$)|(^\d{17}([0-9Xx])$)/;
        if (!idCardRegex.test(from.id_card_number)) {
            uni.showToast({
                title: '请输入有效的身份证号',
                icon: 'none',
            });
            return;
        }
    }

    await apiUserRealNameAuth(from);
    uni.showModal({
        title: '实名认证提示',
        content: '即将使用支付宝进行实名认证，请确保您填写的信息真实有效，提交后信息不可更改。',
        confirmText: '去认证',
        cancelText: '我再想想',
        success: async (res) => {
            if (res.confirm) {
                uni.hideLoading();
                jumpRealName();
            }
        },
    });
};

//跳转实名
const any = ref<any>(null);
const jumpRealName = async () => {
    const url = await apiGetRealNameAuthUrl();
    isRealNameLoading.value = true;

    plus.runtime.openURL("alipay://");
    return;

    plus.runtime.openURL(
        url,
        (error: any) => {
            console.error('唤起支付宝失败：', error);
            if (typeof error === 'string' && error.includes('No Activity found to handle Intent')) {
                isRealNameLoading.value = false;
                uni.showModal({
                    title: '提示',
                    content: '未检测到支付宝App，请先安装支付宝后再操作',
                    showCancel: false,
                    confirmText: '知道了'
                });
            }
            else if (uni.getSystemInfoSync().platform === 'ios') {
                isRealNameLoading.value = false;
                uni.showModal({
                    title: '提示',
                    content: '无法打开支付宝，请检查是否已安装支付宝App',
                    showCancel: false,
                    confirmText: '知道了'
                });
            }
        }
    );
};

//查询实名认证结果
const checkRealNameResult = async () => {
    try {
        const res = await apiGetRealNameAuthResult(userInfo.value!.user_id);
        if (res.code === 200) {
            userInfo.value = await apiSensitive();
            uni.showToast({ title: '实名认证成功', icon: 'none' });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        } else {
            uni.showToast({ title: res.msg, icon: 'none' });
        }
    } catch (error) {
        console.log(error);
    } finally {
        isRealNameLoading.value = false;
    }
};

onShow(() => {
    if (isRealNameLoading.value) {
        checkRealNameResult();
    }
});
</script>

<style lang="scss" scoped>
.real-form {
    width: 100%;
    display: flex;
    flex-flow: row;

    .left {
        display: flex;
        flex-flow: column;
        flex: 1;
    }

    .real-form-item {
        width: 100%;
        margin-bottom: 50rpx;
        display: flex;
        flex-flow: row;

        &:last-child {
            margin-bottom: 0;
        }

        .title {
            font-size: 30rpx;
            color: #2c2c3c;
            font-weight: bold;
            padding-right: 10rpx;
            white-space: nowrap;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                width: 1rpx;
                background-color: #F8F8F8;
            }
        }

        .value {
            margin-left: 20rpx;
            font-size: 28rpx;
            color: #74788A;
        }
    }

    .right {
        margin-left: 40rpx;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        font-size: 24rpx;
        color: #74788a;

        image {
            width: 80rpx;
            height: 80rpx;
            margin-bottom: 10rpx;
        }
    }
}
</style>