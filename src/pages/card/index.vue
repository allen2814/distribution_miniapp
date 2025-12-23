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
                <view class="item" v-for="(item, index) in list" @click="selectAccount(item)">
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
                    <view class="controller">
                        <view class="controller-btn edit-btn mr30"
                            @click.stop="editAccount(item.account_id!, item.account_type!)">
                            <text class="iconfont">&#xe649;</text>
                            编辑
                        </view>
                        <view class="controller-btn delete-btn"
                            @click.stop="deleteAccount(item.account_id!, item.account_type!)">
                            <text class="iconfont">&#xe6b4;</text>
                            删除
                        </view>
                    </view>
                </view>
            </view>
            <navigator url="/pages/card/add" class="defult-add mt30">
                去添加
            </navigator>
        </view>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { maskNumber } from '@/utils';
import { apiDeleteUserAccount, apiSetDefaultUserAccount, apiUserAccount } from '@/api/user';
import type { UserAccountModel } from '@/api/user/models';

import CapsuleButton from '@/components/capsule-button.vue';

const paging = ref();
const list = ref<UserAccountModel[]>([]);
const type = ref<string | undefined>();

//选择账户
const selectAccount = (item: UserAccountModel) => {
    if (type.value !== 'selectedAccount') {
        return;
    }

    apiSetDefaultUserAccount(item.account_id, item.account_type).then(() => {
        uni.navigateBack();
    });
};

//删除
const deleteAccount = (id: number, account_type: number) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除该收款账户吗？',
        confirmText: '删除',
        success: async (res) => {
            if (res.confirm) {
                await apiDeleteUserAccount(id, account_type);
                uni.showToast({
                    title: '删除成功',
                    icon: 'success',
                    success: () => {
                        getList();
                    }
                });
            }
        }
    });
};

//编辑
const editAccount = (id: number, account_type: number) => {
    uni.navigateTo({
        url: `/pages/card/add?account_id=${id}&account_type=${account_type}`
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

onLoad((options: any) => {
    type.value = options.type;
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

        .controller {
            margin-top: 20rpx;
            padding-top: 20rpx;
            display: flex;
            flex-flow: row;
            justify-content: flex-end;
            border-top: 1rpx solid #f1f1f1;

            .controller-btn {
                flex: 1;
                font-size: 26rpx;
                height: 58rpx;
                padding: 0 16rpx;
                border-radius: 6rpx;
                display: flex;
                align-items: center;
                justify-content: center;

                .iconfont {
                    font-size: 28rpx;
                    margin-right: 6rpx;
                }
            }

            .edit-btn {
                background: #E6F7FF;
                color: #1890FF;
                border: 1rpx solid #91d5ff;
            }

            .delete-btn {
                background: #FFF1F0;
                color: #FF4D4F;
                border: 1rpx solid #ffa39e;
            }
        }
    }
}
</style>