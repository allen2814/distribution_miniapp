<template>
    <view class="contentWrapper">
        <up-navbar bgColor="inherit" :fixed="false" :autoBack="true">
            <template #center>
                <text class="up-navbar-title">申请提现</text>
            </template>
            <template #right>
                <CapsuleButton />
            </template>
        </up-navbar>
        <view class="income-form main-wrapper mt20">
            <view class="income-form-card" @click="jumpAddAccount()">
                <view class="title">收款账户：</view>
                <view class="selected-card" v-if="selectedAccount">
                    <view class="selected-card-info">
                        <view class="top">
                            <image class="icon" src="@/static/images/i10.png"
                                v-if="selectedAccount.account_type == 1" />
                            <image class="icon" src="@/static/images/i11.png"
                                v-if="selectedAccount.account_type == 2" />
                            <text class="name">收款人：{{ selectedAccount.real_name }}</text>
                        </view>
                        <text class="account">{{ maskNumber(selectedAccount.account_number) }}</text>
                    </view>
                    <view class="iconfont">&#xe6a3;</view>
                </view>
                <view class="add-card" v-else>
                    选择账户
                    <view class="iconfont">&#xe6a3;</view>
                </view>
            </view>
            <view class="income-form-info">
                <view class="income-form-price">
                    <text class="label">结算金额（元）</text>
                    <view class="label-value">
                        <text class="currency">￥</text>
                        <input type="digit" inputmode="decimal" v-model="formAmount.amount" :focus="true"
                            @input="amountChange" style="font-size: 55rpx;" />
                    </view>
                </view>
                <view class="income-form-make" v-if="isAmountExceed">
                    <text class="mark price-color">输入的金额超出账户余额</text>
                </view>
                <view class="income-form-make" v-else>
                    <view class="mark">账户余额：￥{{ safeToFixed(info?.available_amount!, 2) }}</view>
                    <view class="btn" @click="handleSettleAll">全部结算</view>
                </view>
            </view>
            <view class="defult-btn mt30" @click="onModalConfirm" v-if="!isAmountExceed">确认</view>
        </view>
    </view>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { safeToFixed, maskNumber } from '@/utils';
import type { IncomeModel } from '@/api/income/model';
import type { UserAccountModel } from '@/api/user/models';
import { apiUserAccount, apiWithdrawalApply } from '@/api/user';
import { ApiIncomeDetails } from '@/api/income';

const isLoading = ref(false);
const info = ref<IncomeModel>();
const selectedAccount = ref<UserAccountModel | null>(null);
const isAmountExceed = ref<boolean>(false);

const formAmount = reactive({
    amount: '',
    account_id: 0,
    account_type: 0,
});

//全部结算
const handleSettleAll = () => {
    //如果金额0则不处理
    if (info.value?.available_amount === undefined || info.value?.available_amount === null ||
        Number(info.value?.available_amount) <= 0) {
        return;
    }

    formAmount.amount = (info.value?.available_amount !== undefined && info.value?.available_amount !== null)
        ? Number(info.value.available_amount).toFixed(2)
        : '0.00';
};

//键盘输入变化（限制小数点后两位）
const amountChange = (e: any) => {
    let value = e.detail.value;
    nextTick(() => {
        var price = value.toString().match(/\d+\.\d{2}/)
        nextTick(() => {
            formAmount.amount = price ? price[0] : value;
        });
    })
};

//提交表单
const onModalConfirm = async () => {
    if (isLoading.value) return;

    if (selectedAccount.value == null) {
        uni.showToast({
            title: '请选择收款账户',
            icon: 'error'
        });
        return;
    }

    if (!formAmount.amount || Number(formAmount.amount) <= 0) {
        uni.showToast({
            title: '请输入提现金额',
            icon: 'error'
        });
        return;
    }

    formAmount.account_id = selectedAccount.value?.account_id;
    formAmount.account_type = selectedAccount.value?.account_type;
    isLoading.value = true;
    uni.showLoading({
        title: '提交中...',
        mask: true
    });
    var res = await apiWithdrawalApply(formAmount);
    uni.hideLoading();
    isLoading.value = false;
    if (res.code == 200) {
        uni.showToast({
            title: '提交成功',
            icon: 'success',
        });
        formAmount.amount = '';
        incomeDetails();

    } else {
        uni.showToast({
            title: res.msg,
            icon: 'error'
        });
    }
};


//跳转添加收款账户页面
const jumpAddAccount = () => {
    uni.navigateTo({
        url: '/pages/card/index?type=selectedAccount',
    });
};

//获取收款账户
const getAccount = () => {
    apiUserAccount().then((res) => {
        if (!res) {
            selectedAccount.value = null;
            return;
        }
        selectedAccount.value = res.find(item => item.is_default) || res[0];
    });
};

//获取收入详情
const incomeDetails = async () => {
    const res = await ApiIncomeDetails();
    info.value = res.data;
};

onMounted(() => {
    incomeDetails();
    getAccount();
});

onShow(() => {
    getAccount();
});

//监听提现金额变化
watch(() => formAmount.amount, (newVal) => {
    if (info.value?.available_amount !== undefined && info.value?.available_amount !== null) {
        isAmountExceed.value = Number(newVal) > Number(info.value.available_amount);
    }
});
</script>

<style lang="scss" scoped></style>