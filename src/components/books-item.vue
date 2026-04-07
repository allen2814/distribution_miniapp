<template>
  <view class="item myp-flex-column" @click.stop="jumpInfo(item?.id)">
    <view class="myp-flex-column">
      <view class="booklist-info">
        <view class="defult-title l1">
          {{ item?.title }}
          <text class="defult-description">| {{ item?.user_info.nickname }}</text>
        </view>
        <view class="defult-description mt10 l1">{{ item?.desc }}</view>
      </view>
      <view class="bookList-story-list">
        <view class="story-item" v-for="story in item?.story_brief_info.slice(0, 4)" :key="story.user_story_id">
          <image class="cover_image" :src="story.cover_image" mode="aspectFill" />
          <text class="defult-title l1">{{ story.title }}</text>
          <image class="mianqian" src="@/static/images/mianqian.png" mode="widthFix" v-if="story.is_contract == 1" />
        </view>
      </view>
    </view>
    <view class="bookList-controller" @click.stop="jumpStoryList(item?.id)">
      <text>{{ item?.story_total }}本 · {{ item?.collect_total }}收藏</text>
      <view class="more">
        查看全部
        <text class="iconfont">&#xe61c;</text>
      </view>
    </view>
    <view class="commission-box" style="padding-top: 0;">
      <view class="commission-item">
        <view class="name">
          {{ item?.first_recharge }}
          <text class="tip">%</text>
        </view>
        <text class="val">首充分佣</text>
      </view>
      <view class="commission-item">
        <view class="name">
          {{ item?.recharge }}
          <text class="tip">%</text>
        </view>
        <text class="val">复充分佣</text>
      </view>
      <view class="commission-item">
        <view class="name price-color">
          <text class="tip price-color">￥</text>
          {{ safeToFixedW(item?.revenue) }}
          <text class="tip price-color">万</text>
        </view>
        <text class="val">瓜分佣金</text>
      </view>
      <view class="commission-item">
        <view class="name">
          {{ displayUserCount(item?.participate_count ?? 0) }}
          <text class="tip">人</text>
        </view>
        <text class="val">正在推广</text>
      </view>
    </view>
    <view class="recordBtn mt20" @click.stop="handlePromotion()">
      <image class="icon-image" src="@/static/images/i9.png" mode="widthFix" />
      申请别名推广
    </view>
  </view>
</template>
<script lang="ts" setup>
import { safeToFixedW, displayUserCount } from '@/utils';
import type { BookListModel } from '@/api/models/index';

const props = withDefaults(
  defineProps<{
    item?: BookListModel;
  }>(),
  {}
);

//跳转详情
const jumpInfo = (id?: number) => {
  if (id) {
    uni.navigateTo({
      url: `/pages/bookList/info?id=${id}&user_id=${props.item?.user_info.user_id}`,
    });
  }
};

//跳转故事列表
const jumpStoryList = (id?: number) => {
  if (id) {
    uni.navigateTo({
      url: `/pages/bookList/story-list?story_list_id=${id}`,
    });
  }
};

//申请别名推广
const handlePromotion = () => {
  uni.navigateTo({
    url: `/pages/bookList/promotion?book_list_id=${props.item?.id}&book_list_name=${props.item?.title}`,
  });
};
</script>
<style lang="scss" scoped></style>
