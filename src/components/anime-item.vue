<template>
  <view class="item myp-flex-column" @click.stop="jumpInfo(item?.anime_id)">
    <view class="myp-flex-row">
      <div class="album_cover">
        <up-image class="cover-image" width="160rpx" height="160rpx" :src="item?.cover" :fade="false" shape="circled"
          radius="10rpx" mode="aspectFill">
          <template v-slot:loading>
            <up-loading-icon size="15"></up-loading-icon>
          </template>
        </up-image>
        <view class="msk">
          <image class="" src="@/static/images/album-img-bg.png" />
        </view>
      </div>
      <view class="album-info myp-flex-column">
        <view class="defult-title l1">{{ item?.anime_name }}</view>
        <view class="defult-description mt10 l1">
          {{ item?.theme_name }} ·
          {{ item?.setting_name }} ·
          {{ item?.background_name }}
        </view>
        <text class="defult-description mt10 l1">
          {{ item?.serial_status == 1 ? '已完结' : '连载中' }}
        </text>
      </view>
    </view>
    <view class="commission-box">
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
          {{ safeToFixedW(item?.incr_revenue) }}
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
import { ref } from 'vue';
import { safeToFixedW, displayUserCount } from '@/utils';
import type { AnimesModel } from '@/api/animes/models';

const props = withDefaults(
  defineProps<{
    item?: AnimesModel;
  }>(),
  {}
);

const jumpInfo = (id?: number) => {
  if (id) {
    uni.navigateTo({
      url: `/pages/animes/info?id=${id}`,
    });
  }
};

//申请别名推广
const handlePromotion = () => {
  uni.navigateTo({
    url: `/pages/animes/promotion?anime_id=${props.item?.anime_id}&anime_name=${props.item?.anime_name}`,
  });
};
</script>
<style lang="scss" scoped></style>
