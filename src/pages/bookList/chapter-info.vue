<template>
    <z-paging ref="paging" :fixed="true" v-model="list" :refresher-enabled="false" :loading-more-enabled="false">
        <template #top>
            <up-navbar bgColor="inherit" :fixed="false" :autoBack="true">
                <template #center>
                    <text class="up-navbar-title"></text>
                </template>
            </up-navbar>
        </template>
        <view class="notice-info-page">
            <view class="notice-info-content">
                <view class="notice-info-title">{{ chapterInfo?.title }}</view>
                <view class="notice-info-body">
                    <p v-html="ReplaceNewlinesWithBr(chapterInfo?.content ?? '')"></p>
                </view>
            </view>
        </view>
    </z-paging>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { formatDateTime, ReplaceNewlinesWithBr } from '@/utils/main';
import type { StoryChapterModel } from '@/api/models';
import { apiStoryChapterDetail } from '@/api';

const list = ref<Array<any>>([]);
const chapterInfo = ref<StoryChapterModel | null>(null);

//获取详情
//查看章节
const getInfo = async (id: number) => {
    uni.showLoading();
    const detail = await apiStoryChapterDetail(id);
    uni.hideLoading();
    chapterInfo.value = detail;
};

onLoad((e: any) => {
    if (e.chapter_id) {
        getInfo(Number(e.chapter_id));
    }
});
</script>

<style lang="ts" scoped>

</style>