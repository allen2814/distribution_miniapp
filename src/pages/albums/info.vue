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
					<div class="album_cover">
						<image class="cover-image" :src="info?.cover" mode="aspectFill">
						</image>
						<view class="icon">
							<image class="" src="@/static/images/album-img-bg.png" />
						</view>
						<image v-if="info?.is_exclusive" class="icon1" src="@/static/images/i4.png" mode="widthFix" />
					</div>
					<view class="info">
						<text class="info-title l1">{{ info?.name }} {{ info?.series_name }}</text>
						<text class="info-subtitle">Id：{{ info?.album_id }}</text>
						<text class="info-subtitle l1">主役：{{ info?.cv_nicknames }}</text>
						<text class="info-subtitle">
							{{ info?.status == 1 ? '已完结' : '连载中' }} | {{ info?.album_total }}集
						</text>
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
					<scroll-view class="info-sucai" scroll-x v-if="albumMaterial && albumMaterial.list">
						<view class="item" :class="itemClass" v-for="(item, index) in albumMaterial.list" :key="index">
							<view class="title-box"
								style="background: linear-gradient(90deg, #FFF6E7 -5.25%, #FFF 104.96%);">
								<image src="@/static/images/i15.png" mode="aspectFill" v-if="item.key == 1" />
								<image src="@/static/images/i13.png" mode="aspectFill" v-if="item.key == 2" />
								<image src="@/static/images/i14.png" mode="aspectFill" v-if="item.key == 3" />
								<image src="@/static/images/i17.png" mode="aspectFill" v-if="item.key == 4" />
								<image src="@/static/images/i16.png" mode="aspectFill" v-if="item.key == 5" />
								{{ cloudStorageMap[Number(item.key)] }}
							</view>
							<view class="content-box">
								<view class="url l1">{{ item.url }}</view>
								<text class="code">提取码：{{ item.code }}</text>
								<view class="defult-btn mt20" @click="copyUrl(item.url, item.code)">
									<image src="@/static/images/i20.png"
										style="width: 35rpx;height: 35rpx;padding-right: 5rpx;" />
									复制并打开
								</view>
							</view>
						</view>
					</scroll-view>
					<view class="info-intro">
						<view class="title-box"
							style="background:linear-gradient(90deg, #E6FAFF -5.25%, #FFF 104.96%);">
							<image src="@/static/images/i8.png" mode="aspectFill" />
							作品简介
						</view>
						<view class="content-box" v-html="ReplaceNewlinesWithBr(info?.intro ?? '')"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<up-link :href="albumMaterialURL" @click="handleAlbumMaterial()"></up-link>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { onLoad, onPageScroll } from '@dcloudio/uni-app';
import { ReplaceNewlinesWithBr } from '@/utils/main';
import type { AlbumModel } from '@/api/models';
import { apiAlbumInfo, apiAlbumMaterial } from '@/api';

import CapsuleButton from '@/components/capsule-button.vue';

const bgColor = ref<string>('transparent');
const isLoading = ref<boolean>(true);
const id = ref<number>(0);
const info = ref<AlbumModel | null>(null);
const albumMaterial = ref<any>(null);
const albumMaterialURL = ref<string>('');

const cloudStorageMap: Record<number, string> = {
	1: '百度网盘',
	2: '夸克网盘',
	3: '迅雷网盘',
	4: '移动网盘',
	5: '悟空网盘'
};

//根据素材数量返回对应的样式类，用于控制 item 宽度
const itemClass = computed(() => {
	const len = albumMaterial.value?.list?.length ?? 0;
	if (len === 1) return 'item-with1';
	if (len === 2) return 'item-with2';
	return '';
});

//复制链接不是剪贴板
const copyUrl = (url: string, code: string) => {
	uni.setClipboardData({
		data: url,
		success: () => {
			uni.showToast({
				title: '链接已复制，打开浏览器粘贴访问',
				icon: 'none',
				success: () => {
					setTimeout(() => {
						if (typeof plus !== 'undefined') {
							plus.runtime.openURL(url);
						}
					}, 2000);
				}
			});
		},
	});
};

const handleAlbumMaterial = () => {
	if (albumMaterialURL.value) {
		uni.navigateTo({
			url: albumMaterialURL.value,
		});
	}
};

//申请别名推广
const handlePromotion = () => {
	uni.navigateTo({
		url: `/pages/albums/promotion?album_id=${info.value?.album_id}&album_name=${info.value?.name}`,
	});
};

// 获取详情（并发请求，错误处理，loading 状态优化）
const getInfo = async () => {
	isLoading.value = true;
	info.value = null;
	albumMaterial.value = null;
	try {
		const [albumRes, materialRes] = await Promise.all([
			apiAlbumInfo(id.value),
			apiAlbumMaterial(id.value)
		]);
		info.value = albumRes.items;
		albumMaterial.value = materialRes;
	} catch (err) {
		uni.showToast({ title: '数据加载失败', icon: 'none' });
	} finally {
		isLoading.value = false;
	}
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
<style lang="scss" scoped>
.page {
	background-color: #f7f9fc;
	background-image: url("@/static/images/banner-small.png");
	background-size: 100% auto;
	background-repeat: no-repeat;
}
</style>