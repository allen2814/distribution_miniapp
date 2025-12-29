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
          <template v-if="item.is_delete !== 1">
            <text class="btn btn1 ml10" v-if="item.alias_status == 0">生效中</text>
            <text class="btn btn4 ml10" v-else-if="item.alias_status == 1">已失效</text>
            <text class="btn btn5 ml10" v-else-if="item.alias_status == 2">审核中</text>
            <text class="btn btn2 ml10" v-else-if="item.alias_status == 3">不通过</text>
          </template>
          <template v-else>
            <text class="btn btn7 ml10">已删除</text>
          </template>
        </view>
        <view class="info-view">
          <view class="name">
            <template v-if="item.spread_type == 1">
              {{ item.album_name }}
            </template>
            <template v-if="item.spread_type == 2">
              {{ item.story_title }}
            </template>
            <text class="cate-tag display-none">【{{ SpreadTypeEnum[item.spread_type!] }}】</text>
          </view>
        </view>
        <view class="info-view">
          <text class="date">{{ item.validity_period }}</text>
          <view class="btns" v-if="item.is_delete !== 1">
            <view url="/pages/backfill/index" class="btns-item btn btn2" @click="jumpBackfill(item)">
              回填发文
            </view>
            <view class="btns-item btn btn3" @click="deleteItem(item.spread_id!, item.alias_id!)">删除</view>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { SpreadTypeEnum } from '@/utils/enums';
import type { RecordModel } from '@/api/alias/model';
import { ApiRecords, ApiRecordsDelete } from '@/api/alias';

const paging = ref();
const list = ref<RecordModel[]>([]);

//删除
const deleteItem = (id: number, alias_id: number) => {
  uni.showModal({
    title: '提示',
    content: '确认删除该申词记录？',
    success: async (res) => {
      if (res.confirm) {
        await ApiRecordsDelete(id, alias_id).then((result: any) => {
          if (result.code == 200) {
            uni.showToast({
              title: '删除成功',
              icon: 'none',
            });
            paging.value?.refresh();
          } else {
            uni.showToast({
              title: result.msg || '删除失败',
              icon: 'none',
            });
          }
        });
      }
    },
  });
};

//跳转回填发文
const jumpBackfill = (item: RecordModel | null | undefined) => {
  if (!item || !item.spread_id) return;
  const params: Record<string, any> = {
    spread_id: item.spread_id,
    spread_type: item.spread_type ?? '',
    alias_name: item.alias_name ?? '',
    album_name: item.album_name ?? '',
    story_title: item.story_title ?? ''
  };
  const query = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k] ?? ''))}`)
    .join('&');
  uni.navigateTo({
    url: `/pages/backfill/index?${query}`
  });
};

//获取列表
const getList = async (pageNo?: number, pageSize?: number) => {
  const params = {
    page: pageNo,
    pageSize: pageSize,
  };
  const { items } = await ApiRecords(params);
  paging.value.complete(items);
};
</script>

<style scoped lang="scss"></style>