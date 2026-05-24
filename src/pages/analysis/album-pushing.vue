<template>
  <z-paging ref="paging" :show-refresher-when-reload="true" :auto-show-back-to-top="true" :fixed="false" v-model="list"
    @query="getList">
    <template #backToTop>
      <view class="back-top">
        <i class="iconfont">&#xe703;</i>
      </view>
    </template>
    <view class="record-list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="name-view">
          <text class="name">{{ item.alias_name }}</text>
          <text class="btn btn1 ml10" v-if="item.is_effective == 1">生效中</text>
          <text class="btn btn4 ml10" v-else-if="item.is_effective == 2">已失效</text>
        </view>
        <view class="v1-info-view">
          <view class="pushing-item">
            <CurrencyFormat :value="item.new_user_reward" :fontSize="36" fontWeight="bold" />
            <text class="label">拉新</text>
          </view>
          <view class="pushing-item">
            <CurrencyFormat :value="item.recharge" :fontSize="36" fontWeight="bold" />
            <text class="label">充值</text>
          </view>
          <view class="pushing-item">
            <CurrencyFormat :value="item.estimated_revenue" :fontSize="36" color="#ff5730" fontWeight="bold" />
            <text class="label">佣金</text>
          </view>
        </view>
        <view class="info-view">
          <view class="name">
             {{ item.product_name }}
            <text class="cate-tag">【{{ SpreadTypeEnum[item.spread_type!] }}】</text>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import type { AlbumPushingModel } from '@/api/pushings/model';
import { getAlbumPushings } from '@/api/pushings';
import { SpreadTypeEnum } from '@/utils/enums';

import CurrencyFormat from '@/components/currency-format.vue';

const paging = ref();
const list = ref<AlbumPushingModel[]>([]);

//获取列表
const getList = async (pageNo?: number, pageSize?: number) => {
  const params = {
    page: pageNo,
    pageSize: pageSize,
  };
  const { items } = await getAlbumPushings(params);
  paging.value.complete(items);
};
</script>

<style scoped lang="scss">
.v1-info-view {
  padding-top: 20rpx;
  margin-top: 20rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30rpx;

  .pushing-item {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      width: 1rpx;
      height: 30rpx;
      background: #EDEDED;
    }

    &:nth-child(3n)::after {
      display: none;
    }

    .val {
      word-spacing: -10rpx;
      font-size: 36rpx;
      color: #1F2635;
      font-weight: bold;
      text-align: center;
    }

    .label {
      padding-top: 8rpx;
      font-size: 24rpx;
      color: #74788A;
      text-align: center;
    }
  }

}

.info-view {
  border-top: 1rpx solid #E6E6E6;
  padding-top: 20rpx;

  .name {
    padding-right: 20rpx;
    font-size: 28rpx;
    color: var(--primary-color1);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.extra {
  font-size: 26rpx;
  color: #2c2c3c;

  .do {
    color: #ff5730;
    font-size: 32rpx;
    font-weight: 700;
  }
}
</style>