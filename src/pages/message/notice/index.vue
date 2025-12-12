<template>
    <z-paging ref="paging" :fixed="false" show-refresher-when-reload :auto-show-back-to-top="true" v-model="list"
        @query="getList">
        <template #backToTop>
            <view class="back-top">
                <i class="iconfont">&#xe703;</i>
            </view>
        </template>
        <view class="notice-list">
            <view class="item" v-for="(item, index) in list" :key="index" @click="jumpInfo(item.messageId!)">
                <view class="myp-flex-column">
                    <view class="myp-flex-row myp-align-center">
                        <view class="readStatus" v-if="item.readStatus === 'unread'"></view>
                        <view class="isTop" v-if="item.is_default_top == 1">置顶</view>
                        <text class="defult-title l1">{{ item.title }}</text>
                    </view>
                    <text class="defult-description mt20 l2">
                        {{ filterHtmlTag(item.content) }}
                    </text>
                </view>
                <view class="extra">
                    <text class="defult-description">{{ formatMessageTime(item.sendTime!) }}</text>
                    <view class="notice-action">
                        查看详情
                        <text class="iconfont">&#xe6a3;</text>
                    </view>
                </view>
            </view>
        </view>
    </z-paging>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { formatMessageTime, filterHtmlTag } from '@/utils/main';
import type { NoticeModel } from '@/api/notice/model';
import { getNotices } from '@/api/notice';
import { onShow } from '@dcloudio/uni-app';

const paging = ref();
const list = ref<NoticeModel[]>([]);

//跳转消息详情
const jumpInfo = (id: number) => {
    uni.navigateTo({
        url: `/pages/message/notice/info?messageId=${id}`,
    });
};

//获取列表
const getList = async (pageNo?: number, pageSize?: number) => {
    const params = {
        page: pageNo,
        pageSize: pageSize,
    };
    const { items } = await getNotices(params);
    paging.value.complete(items);
};

onShow(() => {
    if (paging.value) {
        paging.value.reload();
    }
});
</script>

<style lang="scss" scoped></style>