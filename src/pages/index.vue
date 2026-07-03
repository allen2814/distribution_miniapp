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
						confirmType="search" v-model="searchText" @confirm="search">
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
			<Albums v-if="tabs_index === 0" :search-query="queryText" />
			<Storys v-if="tabs_index === 1" :search-query="queryText" />
			<BookList v-if="tabs_index === 2" :search-query="queryText" />
			<Animes v-if="tabs_index === 3" :search-query="queryText" />
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores';
import { apiSensitive } from '@/api/user';

import CapsuleButton from '@/components/capsule-button.vue';
import Albums from '@/pages/albums/list.vue';
import Storys from '@/pages/storys/list.vue';
import BookList from '@/pages/bookList/list.vue';
import Animes from '@/pages/animes/list.vue';

const { userInfo } = toRefs(useUserStore());
const searchText = ref<string>('');
const queryText = ref<string>('');
const tabs_index = ref<number>(0);
const tabs = ref([
	{ name: '广播剧' },
]);

//搜索
const search = () => {
	queryText.value = searchText.value.trim();
};

//点击栏目事件
const handelTabs = (index: number) => {
	tabs_index.value = index;
};

const initTabs = () => {
	const list = [{ name: '广播剧' }];
	if (userInfo.value?.is_story == 1) {
		list.push({ name: '小说' });
	}
	if (userInfo.value?.is_book_list == 1) {
		list.push({ name: '书单' });
	}
	if (userInfo.value?.is_anime == 1) {
		list.push({ name: '漫剧' });
	}
	tabs.value = list;
	if (tabs_index.value >= list.length) {
		tabs_index.value = 0;
	}
};

const refreshUserInfo = async () => {
	try {
		userInfo.value = await apiSensitive();
	} catch {
		// 请求失败时沿用本地缓存
	}
	initTabs();
};

onShow(() => {
	refreshUserInfo();
});
</script>

<style lang="scss" scoped>
.container {
	background-color: #F7F9FC;
	background-image: url('@/static/images/banner-small.png');
	background-size: 100% auto;
	background-repeat: no-repeat;
}
</style>