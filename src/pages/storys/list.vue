<template>
    <z-paging ref="paging" :fixed="false" v-model="list" show-refresher-when-reload :default-page-size="10"
        :auto-show-back-to-top="true" @query="getList">
        <template #backToTop>
            <view class="back-top">
                <i class="iconfont">&#xe703;</i>
            </view>
        </template>
        <template #top>
            <view class="main-wrapper">
                <view class="filter mb10">
                    <view class="filter-item selected" @click="showSubmenu = !showSubmenu">
                        <!-- {{shortTypeList.find(i => i.val === short_type)?.name}} -->
                        排序
                        <text class="iconfont">&#xe79b;</text>
                        <view class="submenu" v-if="showSubmenu" @click.stop>
                            <view class="submenu-box">
                                <view class="submenu-item" :class="{ selected: short_type === item.val }"
                                    v-for="(item, index) in shortTypeList" :key="index"
                                    @click="handleShortType(item.val)">
                                    {{ item.name }}
                                </view>
                            </view>
                        </view>
                    </view>
                    <scroll-view scroll-x scroll-xew class="filter-scroll ml20">
                        <view class="filter-scroll-item" v-for="(item, index) in category_list" :key="index"
                            @click="handleCategory(item.id)">
                            <view class="scroll-item" :class="{ selected: category_id === item.id }"> {{ item.name }}
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </template>
        <view class="main-wrapper">
            <view class="album-list">
                <StoryItem :item="item" v-for="(item, index) in list" :key="index" />
            </view>
        </view>
    </z-paging>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';
import type { AlbumCategoryModel, StoryModel } from '@/api/models/index';
import { apiStoryCategorys, apiStories } from '@/api';

import StoryItem from '@/components/story-item.vue';

const props = defineProps<{ searchQuery?: string }>();

const paging = ref();
const isLoading = ref(true);
const showSubmenu = ref<boolean>(false);
const short_type = ref<number>(1);
const shortTypeList = ref<any[]>([
    { val: 1, name: '综合排序' },
    { val: 2, name: '最新发布' },
]);
const category_list = ref<AlbumCategoryModel[]>([]);
const category_id = ref<number | undefined>();
const list = ref<StoryModel[]>([]);
const searchText = ref<string>('');

//选择排序
const handleShortType = (val: number) => {
    showSubmenu.value = false;
    short_type.value = val;
    paging.value.reload();
};

//选择分类
const handleCategory = (id?: number) => {
    if (category_id.value === id) {
        category_id.value = undefined;
    } else {
        category_id.value = id;
    }

    isLoading.value = true;
    paging.value.reload();
};

//获取分类
const getCategorys = async () => {
    const { items } = await apiStoryCategorys();
    category_list.value = items;
}

//获取列表
const getList = async (pageNo?: number, pageSize?: number) => {
    const params = {
        page: pageNo,
        pageSize: pageSize,
        sort_id: category_id.value,
        sort_type: short_type.value,
        name: searchText.value.trim()
    };
    const { items } = await apiStories(params);
    paging.value.complete(items);
    isLoading.value = false;
};

//监听搜索参数变化
watch(() => props.searchQuery, (val) => {
    if (val === undefined) return;
    searchText.value = val ?? '';
    paging.value.reload();
});

onMounted(async () => {
    getCategorys();
});
</script>

<style lang="scss" scoped></style>
