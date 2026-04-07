<template>
    <div class="page myp-flex-column">
        <up-navbar :bgColor="bgColor" :fixed="true" :autoBack="true">
            <template #center>
                <view class="up-navbar-title l1" style="padding: 0 90rpx;">
                    <text class="category">分类</text>
                    {{ info?.title }}
                </view>
            </template>
            <template #right>
                <CapsuleButton />
            </template>
        </up-navbar>
        <view class="page-content main-wrapper">
            <view class="info-box">
                <view class="user-info">
                    <image class="avatar" :src="info?.user_info.avatar" mode="aspectFill" />
                    <view class="info-text">
                        <text class="defult-title">{{ info?.user_info.nickname }}</text>
                        <view class="defult-description pt10">
                            {{ info?.story_total }}本 · {{ info?.collect_total }}收藏
                        </view>
                    </view>
                </view>
            </view>
            <view class="defult-description mt20 l2">
                {{ info?.desc }}
            </view>
            <view class="list">
                <view class="item" v-for="(item, index) in info?.story_brief_info" :key="index"
                    @click="handleChapter(item.user_story_id)">
                    <view class="cover_image_box">
                        <image class="cover_image" :src="item.cover_image" mode="aspectFill" />
                        <image class="mianqian" src="@/static/images/mianqian.png" mode="widthFix"
                            v-if="item.is_contract == 1" />
                    </view>
                    <view class="info-text">
                        <text class="defult-title">{{ item.title }}</text>
                        <view class="defult-description l2 mt10">
                            {{ item.summary }}
                        </view>
                        <view class="defult-description mt10">
                            作者：{{ item.author_name }} · 分类：{{ item.sort_name }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </div>

    <up-popup :show="isChapter" closeable @close="isChapter = false">
        <view class="chapterInfo-box">
            <view class="title">章节列表</view>
            <view class="content-box" scroll-y="true" enable-back-to-top="true">
                <view class="section-item" v-for="(item, index) in chapters" :key="index"
                    @click="handleChapterInfo(item.id, item.is_free!)">
                    <view class="myp-full-flex mr20">
                        <view class="section-title l1">
                            {{ item.title }}
                        </view>
                        <view class="section-info">
                            <text class="defult-description">
                                {{ formatDateTime(item.created_at, 'yyyy-MM-dd HH:mm') }}
                                丨
                                {{ wordsCount(item.words) }} 字
                            </text>
                            <view class="btn free" v-if="item.is_free == 2">付费</view>
                        </view>
                    </view>
                    <u-icon name="arrow-right" color="#9c9c9c" size="16"></u-icon>
                </view>
            </view>
        </view>
    </up-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { wordsCount, formatDateTime } from '@/utils/main';
import { apiBookListStories, apiStoryChapters } from '@/api';
import type { BookListModel, StoryChapterModel } from '@/api/models';

const bgColor = ref<string>('transparent');
const id = ref<number>(0);
const info = ref<BookListModel | null>(null);

const isChapter = ref<boolean>(false);
const chapters = ref<StoryChapterModel[]>([]);

//查看章节
const handleChapter = async (id: number) => {
    uni.showLoading();
    var params = {
        user_story_id: id,
        page: 1,
        pageSize: 10000
    };
    const res = await apiStoryChapters(params);
    uni.hideLoading();
    chapters.value = res.items;
    isChapter.value = true;
};

//查看章节详情
const handleChapterInfo = (id: number, is_free: number) => {
    if (is_free == 2) {
        uni.showToast({
            title: '付费章节，暂无法查看',
            icon: 'none'
        });
        return;
    }

    uni.navigateTo({
        url: `/pages/bookList/chapter-info?chapter_id=${id}`,
    });
};

//监听页面滚动
onPageScroll((e) => {
    if (e.scrollTop > 0) {
        bgColor.value = '#fff';
    } else {
        bgColor.value = 'transparent';
    }
});

//获取详情
const getInfo = async () => {
    const res = await apiBookListStories(id.value);
    info.value = res;
};

//监听页面加载
onLoad((options: any) => {
    id.value = Number(options.story_list_id);
    getInfo();
});
</script>

<style lang="scss" scoped>
.page {
    background-color: #f7f9fc;
    background-image: url("@/static/images/story-list-bg.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    height: 100vh;
}

.category {
    font-size: 24rpx;
    color: #fff;
    background: #FF5730;
    border-radius: 8rpx;
    height: 45rpx;
    display: inline-block;
    line-height: 45rpx;
    padding: 0 15rpx;
}

.info-box {
    margin-right: 20rpx;
    display: flex;
    align-items: center;

    .user-info {
        display: flex;
        align-items: center;
        flex: 1;

        .avatar {
            width: 70rpx;
            height: 70rpx;
            border-radius: 50%;
            background: #f1f1f1;
        }

        .info-text {
            display: flex;
            flex-flow: column;
            margin-left: 20rpx;
        }
    }
}

.list {
    margin-top: 30rpx;

    .item {
        padding: 20rpx;
        margin-bottom: 20rpx;
        background: #fff;
        box-shadow: 0 1rpx 12rpx 0 #EDEDED;
        border-radius: 10rpx;
        display: flex;
        align-items: center;

        .cover_image_box {
            position: relative;
            width: 160rpx;
            height: 200rpx;
            border-radius: 8rpx;
            background: #f1f1f1;

            .cover_image {
                width: 160rpx;
                height: 200rpx;
                border-radius: 8rpx;
                background: #f1f1f1;
            }

            .mianqian {
                position: absolute;
                top: 0;
                left: 0;
                width: 80rpx;
                border-radius: 10rpx 0 15rpx 0;
            }
        }

        .info-text {
            flex: 1;
            display: flex;
            flex-flow: column;
            margin-left: 20rpx;
        }
    }
}


.chapterInfo-box {
    padding: 30rpx;
    background: linear-gradient(180deg, #fdf4f2 0%, #ffffff 100%);
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;

    .title {
        text-align: center;
        font-size: 28rpx;
        color: #000000;
        font-weight: bold;
        display: inline-block;
        padding: 8rpx 16rpx;
    }

    .content-box {
        height: 680rpx;
        margin: 20rpx 0;
        background: #FFFFFF;
        border-radius: 20rpx;
        padding: 20rpx;
        overflow-y: auto;

        .section-item {
            margin-top: 20rpx;
            padding-bottom: 20rpx;
            border-bottom: 1rpx solid #f1f1f1;
            display: flex;
            flex-flow: row;

            &:last-child {
                border-bottom: none;
            }

            .section-title {
                font-size: 28rpx;
                color: #2C2C3C;

                .section-num {
                    font-size: 28rpx;
                    color: #2C2C3C;
                    font-weight: 700;
                    padding-right: 5rpx;
                }

            }

            .section-info {
                margin-top: 20rpx;
                display: flex;
            }

            .btn {
                margin-left: 20rpx;
                height: 42rpx;
                font-size: 24rpx;
                color: #A6A7AF;
                padding: 0 30rpx;
                background: #EDECEC;
                border-radius: 42rpx;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn.free {
                background: #FFF0E8;
                color: #FF7A00;
            }
        }
    }
}
</style>