<template>
	<view class="page myp-flex-column">
		<up-navbar :bgColor="bgColor" :fixed="true" :autoBack="true">
			<template #center>
				<text class="up-navbar-title">别名推广</text>
			</template>
			<template #right>
				<CapsuleButton />
			</template>
		</up-navbar>
		<view class="page-content">
			<view class="album-info-page mt30">
				<view class="album-info">
					<div class="story_cover">
						<image class="cover-image" :src="info?.cover_image" mode="aspectFill">
						</image>
						<view class="icon">
							<image class="" src="@/static/images/story-img-bg.png" />
						</view>
					</div>
					<view class="info myp-flex-column">
						<text class="info-title l1">{{ info?.title }}</text>
						<text class="info-subtitle mt20">Id：{{ info?.user_story_id }}</text>
						<text class="info-subtitle mt10 l1">作者：{{ info?.nickname }}</text>
						<text class="info-subtitle mt10 l1">{{ info?.name }} · {{ wordsCount(info?.words) }}字</text>
					</view>
				</view>
				<view class="info-content">
					<view class="info-commission">
						<view class="title-box">
							<image src="@/static/images/i6.png" mode="aspectFill" />
							达人分账
						</view>
						<view class="content-box">
							<view class="item">
								<view class="name">
									{{ info?.first_recharge }}
									<text class="tip">%</text>
								</view>
								<text class="val">新用户</text>
							</view>
							<view class="item">
								<view class="name">
									{{ info?.recharge }}
									<text class="tip">%</text>
								</view>
								<text class="val">老用户</text>
							</view>
							<view class="item">
								<view class="name" style="word-spacing: -10rpx;">
									<text class="tip">￥</text>
									117.60
								</view>
								<text class="val">SV年卡结佣</text>
							</view>
						</view>
						<view class="recordBtn" @click="handlePromotion()">
							<image class="icon-image" src="@/static/images/i9.png" mode="widthFix" />
							申请别名推广
						</view>
					</view>
					<view class="info-intro">
						<view class="title-box"
							style="background:linear-gradient(90deg, #E6FAFF -5.25%, #FFF 104.96%);">
							<image src="@/static/images/i8.png" mode="aspectFill" />
							作品简介
						</view>
						<view class="content-box" v-html="ReplaceNewlinesWithBr(info?.summary ?? '')"></view>
					</view>
					<view class="info-intro">
						<view class="title-box"
							style="background:linear-gradient(90deg, #FFECE6 -5.25%, #FFF 104.96%);">
							<image src="@/static/images/i19.png" mode="aspectFill" />
							章节列表
						</view>
						<view class="section-list">
							<view class="section-item" v-for="(item, index) in chapters" :key="index"
								@click="handleChapter(item)">
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
				</view>
			</view>
		</view>
	</view>

	<up-popup :show="isChapter" closeable @close="isChapter = false">
		<view class="chapterInfo-box">
			<view class="title">{{ chapterInfo?.title }}</view>
			<scroll-view class="content-box" scroll-y="true" enable-back-to-top="true">
				<view v-html="ReplaceNewlinesWithBr(chapterInfo?.content ?? '')"></view>
			</scroll-view>
			<view class="defult-btn" @click="handleDownChapter">
				复制文字
			</view>
		</view>
	</up-popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { ReplaceNewlinesWithBr, wordsCount, formatDateTime } from '@/utils/main';
import type { StoryChapterModel, StoryModel } from '@/api/models';
import { apiStoryInfo, apiStoryChapters, apiStoryChapterDetail } from '@/api';

import CapsuleButton from '@/components/capsule-button.vue';

const bgColor = ref<string>('transparent');
const isLoading = ref<boolean>(true);
const id = ref<number>(0);
const info = ref<StoryModel | null>(null);
const chapters = ref<StoryChapterModel[]>([]);

const isChapter = ref<boolean>(false);
const chapterInfo = ref<StoryChapterModel | null>(null);

//申请别名推广
const handlePromotion = () => {
	uni.navigateTo({
		url: `/pages/storys/promotion?story_id=${info.value?.user_story_id}&story_name=${info.value?.title}`,
	});
};

//查看章节
const handleChapter = async (item: StoryChapterModel) => {
	if (item.is_free === 2 && item.type === 2) {
		uni.showToast({ title: '该章节为收费章节，无法查看', icon: 'none' });
		return;
	}

	uni.showLoading();
	const detail = await apiStoryChapterDetail(item.id);
	uni.hideLoading();
	chapterInfo.value = detail;
	isChapter.value = true;
};

//下载章节
const handleDownChapter = async () => {
	uni.setClipboardData({
		data: chapterInfo.value?.content ?? '',
		success: () => {
			uni.showToast({
				title: '已复制到剪贴板',
				icon: 'none',
			});
		},
	});
};

//获取详情（并发请求，错误处理，loading 状态优化）
const getInfo = async () => {
	isLoading.value = true;
	info.value = null;
	try {
		const list = await apiStoryInfo(id.value);
		info.value = list.items;
		getChapterList();
	} catch (err) {
		uni.showToast({ title: '数据加载失败', icon: 'none' });
	} finally {
		isLoading.value = false;
	}
};

//获取章节列表
const getChapterList = async () => {
	var params = {
		user_story_id: id.value,
		page: 1,
		pageSize: 10000
	};
	const res = await apiStoryChapters(params);
	chapters.value = res.items;
};

//监听页面滚动
onPageScroll((e) => {
	if (e.scrollTop > 0) {
		bgColor.value = '#fff';
	} else {
		bgColor.value = 'transparent';
	}
});

//监听页面加载
onLoad((options: any) => {
	id.value = Number(options.id);
	getInfo();
});
</script>

<style>
page {
	background-color: #f7f9fc;
}
</style>

<style lang="scss" scoped>
.page {
	background-color: #f7f9fc;
	background-image: url("@/static/images/banner-small.png");
	background-size: 100% auto;
	background-repeat: no-repeat;
}

.section-list {
	padding: 30rpx;

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
		font-size: 28rpx;
		color: #A6A7AF;

	}
}
</style>