<template>
    <z-paging ref="paging" class="page" :loading-more-enabled="false" :hide-empty-view="true" v-model="list"
        @query="getInfo">
        <template #top>
            <up-navbar bgColor="inherit" :fixed="false" leftIcon="" :autoBack="false">
                <template #center>
                    <text class="up-navbar-title">我的</text>
                </template>
                <template #right>
                    <CapsuleButton />
                </template>
            </up-navbar>
        </template>
        <view class="user-page">
            <view class="user-info myp-flex-row myp-align-center">
                <image class="conver" :src="userInfo?.avatar" mode="aspectFill" />
                <view class="info-box myp-flex-column ml20">
                    <view class="defult-title myp-flex-row myp-align-center">
                        <template v-if="userInfo?.verification_status == 2">
                            {{ userInfo?.real_name }}
                            <view class="is-real-name">已实名</view>
                        </template>
                        <template v-else>
                            未实名认证
                        </template>
                    </view>
                    <view class="defult-description mt10">UID: {{ userInfo?.user_id }}</view>
                </view>
            </view>
            <view class="real-name" @click="jumpRealName" v-if="userInfo?.verification_status == 2">
                <text class="type">已实名</text>
                <text class="mark">已完成实名认证，可解锁更多服务</text>
                <text class="iconfont">&#xe6a3;</text>
            </view>
            <view class="real-name" @click="jumpRealName" v-else>
                <text class="type">待实名</text>
                <text class="mark">完善实名认证信息，解锁更多服务</text>
                <text class="iconfont">&#xe6a3;</text>
            </view>
            <view class="income" v-if="income">
                <view class="counts">
                    <view class="count-item">
                        <text class="label">总收入</text>
                        <CurrencyFormat :value="income?.total_income" :fontSize="48" fontWeight="bold" />
                    </view>
                    <view class="count-item">
                        <text class="label">可提现</text>
                        <CurrencyFormat :value="income?.available_amount" :fontSize="48" fontWeight="bold" />
                    </view>
                </view>
                <navigator url="/pages/income/index" class="btn">去提现</navigator>
            </view>
            <view class="user-menu">
                <view class="item" @click="jumpRealName">
                    <image class="icon" src="@/static/images/h1.png" mode="aspectFill" />
                    <text class="title">实名认证</text>
                </view>
                <navigator hover-class="none" :render-link="false" url="/pages/card/index" class="item">
                    <image class="icon" src="@/static/images/h2.png" mode="aspectFill" />
                    <text class="title">收款账户</text>
                </navigator>
                <view class="item" @click="jumpCustomerService()">
                    <image class="icon" src="@/static/images/h4.png" mode="aspectFill" />
                    <text class="title">联系客服</text>
                </view>
                <view class="item" @click="isDescribeShow = true">
                    <image class="icon" src="@/static/images/h5.png" mode="aspectFill" />
                    <text class="title">使用提醒</text>
                </view>
            </view>
            <view class="huodong" @click="hadnleHuodong" v-if="userInfo?.is_course == 2">
                <image src="@/static/images/huodong.png" mode="widthFix" />
            </view>
        </view>
    </z-paging>
    <!-- 电脑端弹窗 -->
    <up-popup :show="isPcShow" mode="center" bgColor="inherit" round="20rpx" @close="isPcShow = false">
        <view class="pc-dialog">
            <text class="title">便于您更方便查看数据，复制下面的连接，可以在电脑上打开达人推广中心。</text>
            <view class="copy" @click="copyUrl()">
                <text class="link">http://kol.mixs.cn/#/application</text>
                <view class="btn">复制</view>
            </view>
            <view class="close" @click="isPcShow = false">我知道了</view>
        </view>
    </up-popup>
    <!-- 使用说明 -->
    <up-popup :show="isDescribeShow" mode="center" :closeable="true" round="20rpx" @close="isDescribeShow = false">
        <view class="default-dialog-box">
            <view class="title">使用提醒</view>
            <scroll-view scroll-y="true" class="content">
                <view class="item">
                    <text>
                        1、尊敬的用户，在您使用本应用含有的 AI 深度合成、生成式人工智能服务或变声器功能时，请务必遵守法律法规与道德规范。严禁利用这些功能进行以下违法活动。
                    </text>
                </view>
                <view class="item">
                    <text>
                        2、制作、传播虚假信息，误导公众、扰乱社会秩序或影响国家安全。
                    </text>
                </view>
                <view class="item">
                    <text>
                        3、实施诈骗、网络暴力、侵犯他人隐私、名誉权等侵权行为。
                    </text>
                </view>
                <view class="item">
                    <text>
                        4、生成、传播淫秽、恐怖、暴力、政治、歧视性等不良内容。
                    </text>
                </view>
                <view class="item">
                    <text>
                        5、若违反相关规定，您将可能承担民事责任、面临行政处罚，甚至被追究刑事责任。请合法合规使用本功能，共同维护健康、安全、和谐的网络环境。
                    </text>
                </view>
                <view class="item">
                    <text>
                        6、兔U推广中心提倡与用户共同营造清朗干净的网络环境，兔U推广中心内置的创作功能，是本平台提供技术服务的中立工具。智能包装等仅帮助用户短视频创作环节的自行学习、观看、若用户滥用该功能，导致侵权行为，用户应自行承担由此产生的法律责任。
                    </text>
                </view>
            </scroll-view>
        </view>
    </up-popup>
</template>

<script setup lang='ts'>
import { ref, toRefs } from 'vue';
import { useUserStore } from '@/stores';
import { ApiIncomeDetails } from '@/api/income';

import CapsuleButton from '@/components/capsule-button.vue';
import CurrencyFormat from '@/components/currency-format.vue';

const { userInfo } = toRefs(useUserStore());
const paging = ref();
const list = ref<any[]>([]);
const income = ref<any>({});
const isPcShow = ref<boolean>(false);
//使用说明弹窗
const isDescribeShow = ref<boolean>(false);

//跳转实名
const jumpRealName = () => {
    uni.navigateTo({
        url: '/pages/home/real-name'
    });
};

//跳转客服
const jumpCustomerService = () => {
    plus.runtime.openURL("https://work.weixin.qq.com/ca/cawcde63b0a48c0f97");
};

//复制链接
const copyUrl = () => {
    uni.setClipboardData({
        data: 'http://kol.mixs.cn/#/application',
        success: () => {
            uni.showToast({
                title: '链接已复制，打开浏览器粘贴访问',
                icon: 'none',
            });
        },
    });
};

const hadnleHuodong = () => {
    uni.navigateTo({
        url: '/pages/home/huodong'
    });
};

//获取信息
const getInfo = async () => {
    const res = await ApiIncomeDetails();
    income.value = res.data;
    paging.value?.complete([]);
};
</script>

<style lang="scss" scoped>
.page {
    background-color: #F7F9FC;
    background-image: url('@/static/images/banner-small.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    z-index: 999;
}

.huodong {
    width: 100%;
    margin-top: 20rpx;
    display: flex;
    justify-content: center;

    image {
        width: 100%;
        border-radius: 20rpx;
    }
}
</style>