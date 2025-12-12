<template>
    <z-paging ref="paging" :fixed="true" v-model="list" :refresher-enabled="false" :loading-more-enabled="false">
        <template #top>
            <Navbar bgColor="inherit">
                <template #center>
                    <text class="up-navbar-title">公告</text>
                </template>
                <template #right>
                    <CapsuleButton />
                </template>
            </Navbar>
        </template>
        <view class="notice-info-page">
            <view class="notice-info-content">
                <view class="notice-info-title">{{ info?.title }}</view>
                <view class="notice-info-time">{{ formatDateTime(info?.sendTime!, 'yyyy-MM-dd HH:mm') }}</view>
                <view class="notice-info-body">
                    <p v-html="ReplaceNewlinesWithBr(info?.content ?? '')"></p> 
                </view>
            </view>
        </view>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { formatDateTime, ReplaceNewlinesWithBr } from '@/utils/main';
import type { NoticeModel } from '@/api/notice/model';
import { getNoticeDetail } from '@/api/notice';

import Navbar from '@/components/navbar.vue';
import CapsuleButton from '@/components/capsule-button.vue';

const paging = ref();
const messageId = ref<number | null>(null);
const list = ref<Array<any>>([]);
const info = ref<NoticeModel | null>(null);

//获取详情
const getInfo = async () => {
    const res = await getNoticeDetail(messageId.value!);
    info.value = res;
};

onLoad((e: any) => {
    if (e.messageId) {
        messageId.value = Number(e.messageId);
        getInfo();
    }
});
</script>

<style lang="ts" scoped>

</style>