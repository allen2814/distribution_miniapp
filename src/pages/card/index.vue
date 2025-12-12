<template>
    <z-paging ref="paging" :fixed="true" v-model="list" show-refresher-when-reload :hide-empty-view="true"
        :refresher-enabled="false" :loading-more-enabled="false">
        <template #top>
            <up-navbar bgColor="inherit" :fixed="false" :autoBack="true">
                <template #center>
                    <text class="up-navbar-title">收款账户</text>
                </template>
                <template #right>
                    <CapsuleButton />
                </template>
            </up-navbar>
        </template>
        <view class="page">
            <view class="list">
                <view class="item" v-for="(item, index) in list" @longpress="handleLongPress(item)"
                    @click="selectAccount(item)">
                    <view class="top-box">
                        <image class="icon" src="@/static/images/i10.png" v-if="item.account_type == 1" />
                        <image class="icon" src="@/static/images/i11.png" v-if="item.account_type == 2" />
                        <text class="name" v-if="item.account_type == 1">支付宝（{{ item.real_name }}）</text>
                        <text class="name" v-if="item.account_type == 2">{{ item.bank_name }}</text>
                        <text class="default" v-if="item.is_default">默认</text>
                    </view>
                    <view class="mark">
                        {{ item.account_type == 2 ? item.sub_bank_name : '' }}
                    </view>
                    <view class="number">
                        {{ maskNumber(item.account_number) }}
                    </view>
                </view>
            </view>
            <navigator url="/pages/card/add" class="defult-add">
                去添加
            </navigator>
        </view>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { maskNumber } from '@/utils';
import { apiDeleteUserAccount, apiSetDefaultUserAccount, apiUserAccount } from '@/api/user';
import type { UserAccountModel } from '@/api/user/models';

import CapsuleButton from '@/components/capsule-button.vue';

const paging = ref();
const list = ref<UserAccountModel[]>([]);

//选择账户
const selectAccount = (item: UserAccountModel) => {
    apiSetDefaultUserAccount(item.account_id, item.account_type).then(() => {
        uni.navigateBack();
    });
};
//删除
const handleLongPress = (item: UserAccountModel) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除该收款账户吗？',
        confirmText: '删除',
        success: async (res) => {
            if (res.confirm) {
                await apiDeleteUserAccount(item.account_id, item.account_type);
                uni.showToast({
                    title: '删除成功',
                    icon: 'success',
                    success: () => {
                        setTimeout(() => {
                            getList();
                        }, 1500);
                    }
                });
            }
        }
    });
};

//获取列表
const getList = async () => {
    const res = await apiUserAccount();
    paging.value.complete(res);
};

onShow(() => {
    getList();
});

</script>

<style lang="scss" scoped>
.list {
    display: flex;
    flex-flow: column;
    padding: 20rpx;

    .item {
        display: flex;
        flex-flow: column;
        padding: 20rpx;
        border-radius: 6px;
        background: #F6F7F9;
        margin-bottom: 20rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .top-box {
            display: flex;

            .icon {
                width: 40rpx;
                height: 40rpx;
            }

            .name {
                padding-left: 10rpx;
                font-size: 32rpx;
                color: #1f2635;
                font-weight: bold;
            }

            .default {
                margin-left: 20rpx;
                padding: 4rpx 10rpx;
                font-size: 24rpx;
                color: #ff5730;
                border: 1px solid #FFE4DC;
                border-radius: 10rpx;
            }
        }

        .mark {
            margin-top: 20rpx;
            padding-left: 50rpx;
            font-size: 26rpx;
            color: #505763;
        }

        .number {
            margin-top: 20rpx;
            padding-left: 50rpx;
            font-size: 26rpx;
            color: #74788a;
        }
    }
}
</style>