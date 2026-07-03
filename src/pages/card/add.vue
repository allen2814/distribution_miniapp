<template>
    <view class="page myp-flex-column">
        <up-navbar bgColor="inherit" :fixed="true" :autoBack="true">
            <template #center>
                <text class="up-navbar-title">{{ from.account_id ? '编辑收款账户' : '添加收款账户' }}</text>
            </template>
            <template #right>
                <CapsuleButton />
            </template>
        </up-navbar>
        <view class="page-content" v-if="!isInofoLoaded">
            <view class="form">
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
                    <view class="form-item">
                        <view class="label">
                            <text class="required">*</text>
                            <text class="title">手机号</text>
                        </view>
                        <view class="input-wrapper">
                            <input v-model="from.mobile" class="input" type="text" placeholder="请输入手机号" />
                        </view>
                    </view>
                    <view class="form-item" style="display: none;">
                        <view class="label">
                            <text class="required">*</text>
                            <text class="title">到账方式</text>
                        </view>
                        <view class="input-wrapper">
                            <view class="select" @click="isReceiveType = !isReceiveType">
                                <view class="selected">
                                    <template v-if="from.account_type">
                                        {{receiveTypes.find(i => i.val === from.account_type)?.text}}
                                    </template>
                                    <template v-else>
                                        <text style="color: #ccc;">选择收款方式</text>
                                    </template>
                                </view>
                                <view class="iconfont">&#xe661;</view>
                                <view v-if="isReceiveType" class="type-list">
                                    <view class="type-item" v-for="(type, index) in receiveTypes" :key="index"
                                        @click.stop="handleReceiveType(type.val)">
                                        {{ type.text }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <template v-if="from.account_type === 1">
                        <view class="form-item">
                            <view class="label">
                                <text class="required">*</text>
                                <text class="title">支付宝账号</text>
                            </view>
                            <view class="input-wrapper">
                                <input v-model="from.account_number" class="input" type="text" placeholder="请输入支付宝账号" />
                            </view>
                        </view>
                    </template>
                    <template v-if="from.account_type === 2">
                        <view class="form-item">
                            <view class="label">
                                <text class="required">*</text>
                                <text class="title">开户行</text>
                            </view>
                            <view class="input-wrapper">
                                <input v-model="from.bank_name" class="input" type="text" placeholder="请输入开户行" />
                            </view>
                        </view>
                        <view class="form-item">
                            <view class="label">
                                <text class="required">*</text>
                                <text class="title">支行信息</text>
                            </view>
                            <view class="input-wrapper">
                                <input v-model="from.sub_bank_name" class="input" type="text" placeholder="请输入支行信息" />
                            </view>
                        </view>
                        <view class="form-item">
                            <view class="label">
                                <text class="required">*</text>
                                <text class="title">银行卡账号</text>
                            </view>
                            <view class="input-wrapper">
                                <input v-model="from.account_number" class="input" type="text" placeholder="请输入银行卡账号" />
                            </view>
                        </view>
                    </template>
                </view>
            </view>
            <view class="defult-add mt30" @click="addAccount">
                {{ from.account_id ? '保存修改' : '添加账户' }}
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { IncomeAccountModel } from '@/api/income/model';
import { apiAddUserAccount, apiGetUserAccountDetail, apiUpdateUserAccount } from '@/api/user';

import CapsuleButton from '@/components/capsule-button.vue';
import { isValidIdDocument, isValidMobile } from '@/utils';
import { onLoad } from '@dcloudio/uni-app';

const isInofoLoaded = ref(false);
const isReceiveType = ref<boolean>(false);
const receiveTypes = reactive([
    { text: '支付宝', val: 1 },
    { text: '银行卡', val: 2 }
]);

const from = ref<IncomeAccountModel>({
    account_id: void null,
    real_name: "",
    id_card_number: "",
    mobile: "",
    account_type: 1,
    bank_name: "",
    sub_bank_name: "",
    account_number: "",
});

//选择到账方式
const handleReceiveType = (type: number) => {
    from.value.account_type = type;
    isReceiveType.value = false;
};

//添加收款账户
const addAccount = async () => {
    //验证姓名
    if (!from.value.real_name) {
        uni.showToast({
            title: '请输入真实姓名',
            icon: 'none'
        });
        return;
    }
    //验证身份证号
    if (!from.value.id_card_number) {
        uni.showToast({
            title: '请输入身份证号',
            icon: 'none'
        });
        return;
    } else if (!isValidIdDocument(from.value.id_card_number)) {
        uni.showToast({
            title: '证件号码格式不对',
            icon: 'none'
        });
        return;
    }
    //验证手机号
    if (!from.value.mobile) {
        uni.showToast({
            title: '请输入手机号',
            icon: 'none'
        });
        return;
    } else if (!isValidMobile(from.value.mobile)) {
        uni.showToast({
            title: '手机号格式不对',
            icon: 'none'
        });
        return;
    }
    //验证收款方式
    if (!from.value.account_type) {
        uni.showToast({
            title: '请选择收款方式',
            icon: 'none'
        });
        return;
    }
    //验证支付宝
    if (from.value.account_type === 1) {
        if (!from.value.account_number) {
            uni.showToast({
                title: '请输入支付宝账号',
                icon: 'none'
            });
            return;
        } else if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/.test(from.value.account_number) && !isValidMobile(from.value.account_number)) {
            uni.showToast({
                title: '支付宝账号格式不对',
                icon: 'none'
            });
            return;
        }
    }

    //验证银行卡
    if (from.value.account_type === 2) {
        if (!from.value.bank_name) {
            uni.showToast({
                title: '请输入开户行',
                icon: 'none'
            });
            return;
        }
        if (!from.value.sub_bank_name) {
            uni.showToast({
                title: '请输入支行信息',
                icon: 'none'
            });
            return;
        }
        if (!from.value.account_number) {
            uni.showToast({
                title: '请输入银行卡账号',
                icon: 'none'
            });
            return;
        } else if (String(from.value.account_number).length < 10) {
            uni.showToast({
                title: '银行卡账号格式不对',
                icon: 'none'
            });
            return;
        }
    }

    const saveOrUpdate = from.value.account_id ? apiUpdateUserAccount : apiAddUserAccount;
    saveOrUpdate(from.value).then(() => {
        uni.showToast({
            title: from.value.account_id ? '修改成功' : '添加成功',
            duration: 2000,
            success: () => {
                setTimeout(() => {
                    uni.navigateBack();
                }, 2000);
            }
        });
    });
};

//获取账户详情
const getInfo = async () => {
    uni.showLoading();
    const accountInfo = await apiGetUserAccountDetail(from.value.account_id!, from.value.account_type!);
    from.value.real_name = accountInfo.real_name;
    from.value.id_card_number = accountInfo.id_card_number;
    from.value.mobile = accountInfo.mobile;
    from.value.bank_name = accountInfo.bank_name;
    from.value.sub_bank_name = accountInfo.sub_bank_name;
    from.value.account_number = accountInfo.account_number;
    isInofoLoaded.value = false;
    uni.hideLoading();
}

onLoad((e: any) => {
    if (e.account_id) {
        isInofoLoaded.value = true;
        from.value.account_id = Number(e.account_id);
        from.value.account_type = Number(e.account_type);
        getInfo();
    }
});
</script>

<style lang="scss" scoped>
.page {
    background: #fff;
}

.page-content {
    padding: 20rpx 30rpx;
}
</style>