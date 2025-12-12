<template>
	<view class="container">
		<up-navbar bgColor="inherit" :fixed="false" leftIcon="" :autoBack="false">
			<template #center>
				<text class="up-navbar-title">任务列表</text>
			</template>
			<template #right>
				<CapsuleButton />
			</template>
		</up-navbar>
		<view class="main-wrapper">
			<view class="search">
				<view class="search-input">
					<up-input class="input" placeholder="请输入内容" border="none" inputAlign="center" fontSize="28rpx"
						confirmType="search" v-model="searchText">
					</up-input>
				</view>
				<view class="search-btn" @click="search">
					<i class="iconfont icon-search"></i>
				</view>
			</view>
			<view class="tabs-analysis" style="margin: 20rpx 0;">
				<view class="tab-item" v-for="(tab, index) in tabs" :key="index"
					:class="{ active: tabs_index === index }" @click="handelTabs(index)">
					{{ tab.name }}
				</view>
			</view>
		</view>
		<view class="myp-full-flex">
			<Albums :search-query="queryText" />
		</view>
	</view>

	<up-popup :show="isRealName" mode="center" bgColor="inherit" round="20rpx">
		<view class="real-name-dialog">
			<text class="long-name">实名认证</text>
			<text class="title">
				根据国家相关政策要求，需要完成实名认证方可进行提现操作，未满18岁用户将受到系统限制。你的信息将进行严格的隐私保护，请放心认证。
			</text>
			<view class="close" @click="jumpRealName">去认证</view>
		</view>
	</up-popup>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import { useUserStore } from '@/stores';

import CapsuleButton from '@/components/capsule-button.vue';
import Albums from '@/pages/albums/list.vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

const { userInfo } = toRefs(useUserStore());
const isRealName = ref<boolean>(false);
const searchText = ref<string>('');
const queryText = ref<string>('');
const tabs_index = ref<number>(0);
const tabs = reactive([
	{ name: '广播剧' },
	// { name: '小说' },
]);

//搜索
const search = () => {
	queryText.value = searchText.value.trim();
};

//点击栏目事件
const handelTabs = (index: number) => {
	tabs_index.value = index;
}

//跳转实名
const jumpRealName = () => {
	uni.navigateTo({
		url: '/pages/home/real-name'
	});
};

onShow(() => {
	// if (userInfo.value?.verification_status === 2) {
	// 	isRealName.value = false;
	// }
});

onLoad(() => {

});
</script>

<style lang="scss" scoped>
.container {
	background-color: #F7F9FC;
	background-image: url('@/static/images/banner-small.png');
	background-size: 100% auto;
	background-repeat: no-repeat;
}

.ceshi {
	position: fixed;
	bottom: 200rpx;
	right: 20rpx;
	background-color: rgba(0, 0, 0, 0.5);
	color: #fff;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>