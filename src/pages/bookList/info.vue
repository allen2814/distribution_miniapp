<template>
	<view class="page myp-flex-column">
		<up-navbar :bgColor="bgColor" :fixed="true" :autoBack="true">
			<template #center>
				<text class="up-navbar-title">书单推广</text>
			</template>
			<template #right>
				<CapsuleButton />
			</template>
		</up-navbar>
		<view class="page-content">
			<view class="album-info-page mt30">
				<view class="booklist-info-box">
					<view class="booklist-info">
						<view class="defult-title l1">
							{{ info?.title }}
							<text class="defult-description">| {{ info?.user_info.nickname }}</text>
						</view>
						<view class="defult-description mt10 l1">{{ info?.desc }}</view>
					</view>
					<view class="bookList-story-list">
						<view class="story-item" v-for="story in info?.story_brief_info.slice(0, 4)"
							:key="story.user_story_id">
							<image class="cover_image" :src="story.cover_image" mode="aspectFill" />
							<text class="defult-title l1">{{ story.title }}</text>
							<image class="mianqian" src="@/static/images/mianqian.png" mode="widthFix"
								v-if="story.is_contract == 1" />
						</view>
					</view>
					<view class="bookList-controller" @click="jumpStoryList(info?.id)">
						<text>{{ info?.story_total }}本 · {{ info?.collect_total }}收藏</text>
						<view class="more">
							查看全部
							<text class="iconfont">&#xe61c;</text>
						</view>
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
						<view class="content-box" v-html="ReplaceNewlinesWithBr(info?.desc ?? '')"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { ReplaceNewlinesWithBr } from '@/utils/main';
import type { BookListModel } from '@/api/models';
import { apiBookListInfo } from '@/api';

import CapsuleButton from '@/components/capsule-button.vue';

const bgColor = ref<string>('transparent');
const isLoading = ref<boolean>(true);
const id = ref<number>(0);
const user_id = ref<number>(0);
const info = ref<BookListModel | null>(null);

//申请别名推广
const handlePromotion = () => {
	uni.navigateTo({
		url: `/pages/bookList/promotion?book_list_id=${info.value?.id}&book_list_name=${info.value?.title}`,
	});
};

//跳转故事列表
const jumpStoryList = (id?: number) => {
	if (id) {
		uni.navigateTo({
			url: `/pages/bookList/story-list?story_list_id=${id}`,
		});
	}
};

//获取详情
const getInfo = async () => {
	isLoading.value = true;
	const res = await apiBookListInfo(id.value, user_id.value);
	info.value = res;
	isLoading.value = false;
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
	user_id.value = Number(options.user_id);
	getInfo();
});
</script>
<style lang="scss" scoped>
.page {
	background-color: #f7f9fc;
	background-image: url("@/static/images/banner-small.png");
	background-size: 100% auto;
	background-repeat: no-repeat;
}

.booklist-info-box {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx 20rpx;
	margin: 0 20rpx;
}
</style>