<template>
    <view class="page myp-flex-column">
        <up-navbar bgColor="inherit" :fixed="false" :autoBack="true">
            <template #center>
                <text class="up-navbar-title">别名推广</text>
            </template>
        </up-navbar>
        <view class="main-wrapper pb30">
            <view class="bar-title">
                <view class="bar-title-bg">
                    <text class="title">基础信息</text>
                </view>
            </view>
            <view class="default-info-list">
                <view class="item">
                    <view class="name">类型：</view>
                    <view class="value">小说</view>
                </view>
                <view class="item">
                    <view class="name">剧名：</view>
                    <view class="value">{{ story_name }}</view>
                </view>
            </view>
            <view class="bar-title">
                <view class="bar-title-bg">
                    <text class="title">申请别名</text>
                </view>
            </view>
            <view class="default-info-list">
                <view class="item">
                    <input class="input" type="text" v-model="promotionText" :adjust-position="false"
                        placeholder="请输入别名" />
                </view>
            </view>
            <view class="defult-btn mt30" @click="onModalConfirm">
                <text>提交</text>
            </view>
        </view>
    </view>

    <real-name-pop v-model="isRealName" />
    <up-popup :show="isResTyle" mode="center" bgColor="inherit" round="20rpx">
        <view class="resType-dialog">
            <text class="long-name">{{ promotionText }}</text>
            <text class="title">
                {{ isResTyleMsg }}
            </text>
            <view class="close" @click="handleRes()">确定</view>
        </view>
    </up-popup>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { ApiRecordsAdd } from '@/api';
import { onLoad } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores';

const { userInfo } = toRefs(useUserStore());
const isRealName = ref<boolean>(false);

const story_id = ref<number>();
const story_name = ref<string>("");
const promotionText = ref<string>('');
const isResTyle = ref<boolean>(false);
const isResTyleCode = ref<number>(0);
const isResTyleMsg = ref<string>("");

//点击确定按钮
const handleRes = () => {
    if (isResTyleCode.value === 1) {
        uni.navigateBack();
    } else {
        isResTyle.value = false;
        isResTyleCode.value = 0;
        isResTyleMsg.value = '';
        promotionText.value = '';
    }
};

//提交表单
const onModalConfirm = () => {
    //实名认证检查
    if (userInfo.value?.verification_status !== 2) {
        isRealName.value = true;
        return;
    }

    if (!promotionText.value) {
        uni.showToast({
            title: '请输入别名',
            icon: 'none'
        });
        return;
    }

    var params = {
        product_id: story_id.value,
        alias_name: promotionText.value,
        spread_type: 2
    };

    uni.showLoading();
    ApiRecordsAdd(params).then((res: any) => {
        isResTyle.value = true;
        isResTyleCode.value = res.code;
        isResTyleMsg.value = res.msg;

    }).catch((err) => {
        uni.showToast({
            title: err.message || '提交失败',
            icon: 'none'
        });
    }).finally(() => {
        uni.hideLoading();
    });
};

onLoad((e: any) => {
    story_id.value = e.story_id;
    story_name.value = e.story_name;
});
</script>

<style lang="scss" scoped>
.input {
    width: 100%;
    height: 70rpx;
    line-height: 70rpx;
    padding: 0 20rpx;
    border: 1rpx solid #EDEDED;
    border-radius: 10rpx;
    font-size: 28rpx;
    color: var(--primary-color);
    box-sizing: border-box;

    &::placeholder {
        color: #A0A5B6;
    }
}

.resType-dialog {
    background-color: initial;
    background-image: url("@/static/images/resType-dialog.png");
    background-size: 100% 100%;
    width: 520rpx;
    padding: 40rpx;
    display: flex;
    flex-flow: column;

    .long-name {
        text-align: center;
        font-size: 40rpx;
        color: #ff5730;
        font-weight: 700;
    }

    .title {
        text-align: center;
        margin-top: 30rpx;
        font-size: 30rpx;
        color: #2c2c3c;
        font-weight: 400;
        line-height: 38rpx;
    }

    .close {
        margin-top: 20rpx;
        height: 75rpx;
        background: #FF8F2E;
        border-radius: 10rpx;
        color: #fff;
        font-size: 32rpx;
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>