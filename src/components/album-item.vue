<template>
  <view class="item myp-flex-column" @click.stop="jumpInfo(item?.album_id)">
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
        <view class="defult-title l1">{{ item?.name }}</view>
        <view class="defult-description mt10 l1">主役：{{ item?.cv_nicknames }}</view>
        <text class="defult-description mt10 l1">
          {{ item?.status == 1 ? '已完结' : '连载中' }}
        </text>
      </view>
    </view>
    <view class="commission-box">
      <view class="commission-item">
        <view class="name">
          {{ item?.first_recharge }}
          <text class="tip">%</text>
        </view>
        <text class="val">分账比例</text>
      </view>
      <!-- <view class="commission-item">
        <view class="name">
          {{ item?.recharge }}
          <text class="tip">%</text>
        </view>
        <text class="val">复充分佣</text>
      </view> -->
      <view class="commission-item">
        <view class="name price-color">
          <text class="tip price-color">￥</text>
          {{ formatRevenueW(item?.revenue) }}
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
import type { AlbumModel } from '@/api/models/index';

const props = withDefaults(
  defineProps<{
    item?: AlbumModel;
  }>(),
  {}
);

const isPromotionShow = ref<boolean>(false);

/** 瓜分佣金展示：在 safeToFixedW 基础上，最少展示 100 万以上 */
const formatRevenueW = (revenue?: number | null) => {
  const raw = safeToFixedW(revenue);
  const dotIndex = raw.indexOf('.');
  const intPart = dotIndex === -1 ? raw : raw.slice(0, dotIndex);

  if (Number(intPart) >= 100) {
    return raw;
  }
  if (intPart.length === 1) {
    return `10${raw}`;
  }
  if (intPart.length === 2) {
    const prefix = (props.item?.album_id ?? 0) % 2 === 0 ? '1' : '2';
    return `${prefix}${raw}`;
  }
  return raw;
};

const jumpInfo = (id?: number) => {
  if (id) {
    uni.navigateTo({
      url: `/pages/albums/info?id=${id}`,
    });
  }
};

//申请别名推广
const handlePromotion = () => {
  uni.navigateTo({
    url: `/pages/albums/promotion?album_id=${props.item?.album_id}&album_name=${props.item?.name}`,
  });
};
</script>
<style lang="scss" scoped></style>
