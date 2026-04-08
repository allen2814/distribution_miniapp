<template>
    <z-paging ref="paging" class="page" :use-page-scroll="true" v-model="list" @query="getList">
        <template #top>
            <up-navbar :bgColor="bgColor" :fixed="false" :autoBack="true">
                <template #center>
                    <text class="up-navbar-title">收益中心</text>
                </template>
                <template #right>
                    <CapsuleButton />
                </template>
            </up-navbar>
        </template>
        <view class="defult-container">
            <view class="info" v-if="info">
                <view class="info-count">
                    <view class="info-count-item">
                        <view class="label" @click="isAbout = true">
                            可提现
                            <image src="@/static/images/i12.png" mode="aspectFill"></image>
                        </view>
                        <view class="amount">
                            <CurrencyFormat :value="info?.available_amount" :fontSize="52" color="#fff"
                                fontWeight="bold" />
                        </view>
                    </view>
                    <text class="iconfont add-iconfont">&#xe767;</text>
                    <view class="info-count-item">
                        <view class="amount">
                            <CurrencyFormat :value="info?.pending_deposit" :fontSize="52" color="#fff"
                                fontWeight="bold" />
                            <text class="currency ml10">待入账 </text>
                        </view>
                    </view>
                    <view class="withdraw-button" @click="handleWithdraw">
                        <view class="btn">
                            提现
                            <view class="iconfont">&#xe6a3;</view>
                        </view>
                    </view>
                </view>
                <view class="counts">
                    <view class="count-item">
                        <text class="label">总收益</text>
                        <CurrencyFormat class="mt10" :value="info?.total_income" :fontSize="38" color="#fff" />
                    </view>
                    <view class="count-item">
                        <text class="label">已提现</text>
                        <CurrencyFormat class="mt10" :value="info?.total_withdraw" :fontSize="38" color="#fff" />
                    </view>
                    <view class="count-item">
                        <text class="label">提现中</text>
                        <CurrencyFormat class="mt10" :value="info?.apply_amount" :fontSize="38" color="#fff" />
                    </view>
                </view>
            </view>
            <view class="tabs">
                <view class="tab-item" v-for="(tab, index) in tabs" :key="index" :class="{ active: tabIndex === index }"
                    @click="handleTab(index)">{{ tab.name }}</view>
            </view>
        </view>
        <view class="income-list">
            <template v-if="isLoading">
                <up-loading-icon size="20"></up-loading-icon>
            </template>
            <template v-else>
                <order-item :list="list" v-if="tabIndex === 0" />
                <pull-user :list="list" v-else-if="tabIndex === 1" />
                <withdrawal-item :list="list" v-else />
            </template>
        </view>

        <up-popup :show="isAbout" mode="center" round="20rpx" :closeable="true" @close="isAbout = false">
            <view class="default-dialog-box">
                <view class="title">温馨提示</view>
                <view class="content">
                    <view class="item">
                        <text class="do">待入账(评估)：</text>
                        收益将于1~3个工作日审核通过后进入可提现金额，可在下方收益列表中查看详情。
                    </view>
                    <view class="item">
                        <text class="do">总收益：</text>
                        待入账（预估）+可提现+已提现。
                        预估收益仅供参考，非最终到账金额；若大量订单在审核周期内退订，则该订单达人无佣金，请以实际分佣金额为准。
                    </view>
                    <view class="item">
                        <text class="do">提现到账：</text>
                        工作日（周一至周五）15:00前发起的提现，将于当天进行打款；15:00后发起的，将于下一工作日进行打款。
                    </view>
                </view>
            </view>
        </up-popup>
    </z-paging>
    <real-name-pop v-model="isRealName" />
    <view v-if="refreshToastVisible" class="refresh-toast" :class="{ leaving: refreshToastLeaving }">
        + 数据已刷新
    </view>
</template>

<script setup lang='ts'>
import { ref, toRefs } from 'vue';
import { onHide, onPageScroll, onShow, onUnload } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores';
import type { IncomeModel } from '@/api/income/model';
import { ApiIncomeDetails, ApiOrders, ApiPullUsers, ApiWithdrawals } from '@/api/income';

import OrderItem from '@/components/order-item.vue';
import WithdrawalItem from '@/components/withdrawal-item.vue';
import PullUser from '@/components/pull-user.vue';
import CapsuleButton from '@/components/capsule-button.vue';
import CurrencyFormat from '@/components/currency-format.vue';
import RealNamePop from '@/components/realNamePop.vue';

const { userInfo } = toRefs(useUserStore());
const isRealName = ref<boolean>(false);
const paging = ref();
const isLoading = ref(true);
const isAbout = ref<boolean>(false);
const info = ref<IncomeModel>();
const list = ref<any[]>([]);
const tabIndex = ref<number>(0);
let refreshTimer: ReturnType<typeof setInterval> | null = null;
const isPagingQuerying = ref(false);
const isLoadingMoreQuery = ref(false);
const pauseAutoRefreshForLoadMore = ref(false);
const isAtTopForAutoRefresh = ref(true);
const TOP_REFRESH_THRESHOLD = 20;
let refreshToastHideTimer: ReturnType<typeof setTimeout> | null = null;
let refreshToastRemoveTimer: ReturnType<typeof setTimeout> | null = null;
const refreshToastVisible = ref(false);
const refreshToastLeaving = ref(false);
const tabs = ref<any[]>([
    { name: '充值收入' },
    { name: '拉新收入' },
    { name: '提现' }
]);
const bgColor = ref<string>('transparent');

const stopAutoRefresh = () => {
    if (!refreshTimer) return;
    clearInterval(refreshTimer);
    refreshTimer = null;
};

const clearRefreshToastTimers = () => {
    if (refreshToastHideTimer) {
        clearTimeout(refreshToastHideTimer);
        refreshToastHideTimer = null;
    }
    if (refreshToastRemoveTimer) {
        clearTimeout(refreshToastRemoveTimer);
        refreshToastRemoveTimer = null;
    }
};

const hideRefreshToastImmediately = () => {
    clearRefreshToastTimers();
    refreshToastVisible.value = false;
    refreshToastLeaving.value = false;
};

const showRefreshToast = () => {
    clearRefreshToastTimers();
    refreshToastVisible.value = true;
    refreshToastLeaving.value = false;

    refreshToastHideTimer = setTimeout(() => {
        refreshToastLeaving.value = true;
        refreshToastRemoveTimer = setTimeout(() => {
            refreshToastVisible.value = false;
            refreshToastLeaving.value = false;
            refreshToastRemoveTimer = null;
        }, 280);
        refreshToastHideTimer = null;
    }, 900);
};

const startAutoRefresh = () => {
    stopAutoRefresh();
    refreshTimer = setInterval(() => {
        if (!isAtTopForAutoRefresh.value || pauseAutoRefreshForLoadMore.value || isPagingQuerying.value || isLoadingMoreQuery.value) {
            return;
        }
        paging.value?.reload();
    }, 5000);
};

//跳转提现页面
const handleWithdraw = () => {
    //实名认证检查
    if (userInfo.value?.verification_status !== 2) {
        isRealName.value = true;
        return;
    }

    uni.navigateTo({
        url: '/pages/income/withdraw',
    });
};

//切换tab
const handleTab = (index: number) => {
    tabIndex.value = index;
    pauseAutoRefreshForLoadMore.value = false;
    list.value = [];
    isLoading.value = true;
    paging.value.reload();
};

//获取列表
const getList = async (pageNo?: number, pageSize?: number) => {
    const currentPage = Number(pageNo || 1);
    const isAutoRefresh = currentPage === 1 && !isLoading.value;
    if (currentPage > 1) {
        pauseAutoRefreshForLoadMore.value = true;
    } else if (!isAutoRefresh) {
        pauseAutoRefreshForLoadMore.value = false;
    }
    isPagingQuerying.value = true;
    isLoadingMoreQuery.value = currentPage > 1;
    const params = {
        page: pageNo,
        limit: pageSize,
    };
    try {
        if (tabIndex.value === 0) {
            const { items } = await ApiOrders(params);
            paging.value.complete(items);
        }
        else if (tabIndex.value === 1) {
            const { items } = await ApiPullUsers(params);
            paging.value.complete(items);
        }
        else {
            const { data } = await ApiWithdrawals(params);
            paging.value.complete(data);
        }
        incomeDetails();
    } finally {
        isPagingQuerying.value = false;
        isLoadingMoreQuery.value = false;
        if (isAutoRefresh) {
            showRefreshToast();
        }
        if (!isAutoRefresh) {
            isLoading.value = false;
        }
    }
};

//获取收入详情
const incomeDetails = async () => {
    const res = await ApiIncomeDetails();
    info.value = res.data;
};

onPageScroll((e) => {
    isAtTopForAutoRefresh.value = e.scrollTop <= TOP_REFRESH_THRESHOLD;
    if (e.scrollTop > 0) {
        bgColor.value = '#fff';
    } else {
        bgColor.value = 'transparent';
    }
});

onShow(() => {
    pauseAutoRefreshForLoadMore.value = false;
    isAtTopForAutoRefresh.value = true;
    incomeDetails();
    startAutoRefresh();
});

onHide(() => {
    stopAutoRefresh();
    hideRefreshToastImmediately();
});

onUnload(() => {
    stopAutoRefresh();
    hideRefreshToastImmediately();
});
</script>

<style lang="scss" scoped>
.page {
    background-color: #F7F9FC;
    background-image: url('@/static/images/banner-small.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
}

.defult-container {
    padding: 10rpx 30rpx;
}

.refresh-toast {
    position: fixed;
    left: 24rpx;
    bottom: calc(24rpx + env(safe-area-inset-bottom));
    z-index: 9999;
    padding: 14rpx 22rpx;
    border-radius: 12rpx;
    font-size: 24rpx;
    color: #FFFFFF;
    background: rgba(0, 0, 0, 0.72);
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.18);
    animation: refresh-toast-in 220ms ease-out forwards;
}

.refresh-toast.leaving {
    animation: refresh-toast-out 280ms ease-in forwards;
}

@keyframes refresh-toast-in {
    from {
        opacity: 0;
        transform: translate3d(0, 26rpx, 0);
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes refresh-toast-out {
    from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }

    to {
        opacity: 0;
        transform: translate3d(0, -18rpx, 0);
    }
}

.info {
    width: 100%;
    border-radius: 20rpx;
    background: linear-gradient(270deg, #F8A77D 11%, #F8A77D 14.84%, #FF7066 89%);
    box-shadow: 0 2px 8px 0 #EDEDED;

    .info-count {
        padding: 30rpx;
        position: relative;
        display: flex;
        align-items: flex-end;

        &::after {
            content: '';
            position: absolute;
            left: 30rpx;
            right: 30rpx;
            bottom: 0;
            height: 1rpx;
            background: rgba(255, 255, 255, 0.2);
        }

        .label {
            font-size: 28rpx;
            color: #FFFFFF;
            display: flex;
            align-items: center;

            image {
                width: 30rpx;
                height: 30rpx;
                margin-left: 8rpx;
            }
        }

        .add-iconfont {
            margin: 0 30rpx;
            font-size: 30rpx;
            font-weight: 700;
            color: #FFFFFF;
        }

        .amount {
            display: flex;
            align-items: end;
            margin-top: 15rpx;
            font-size: 52rpx;
            font-weight: bold;
            color: #fff;

            .currency {
                font-size: 28rpx;
                font-weight: normal;
            }
        }

        .withdraw-button {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            align-items: center;

            .btn {
                padding: 0 15rpx 0 30rpx;
                height: 60rpx;
                border-top-left-radius: 0;
                border-bottom-left-radius: 20rpx;
                background: #FFFFFF;
                color: var(--primary-color2);
                font-size: 26rpx;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

    .counts {
        padding: 30rpx;
        display: flex;
        justify-content: space-between;

        .count-item {
            flex: 1;
            text-align: left;

            .label {
                display: block;
                font-size: 26rpx;
                color: #fff;
            }

            .value {
                display: block;
                margin-top: 15rpx;
                font-size: 38rpx;
                color: #fff;
                word-spacing: -15rpx;

                .currency {
                    font-size: 28rpx;
                }
            }
        }
    }
}
</style>