<template>
    <view class="echarts">
        <view class="tabs">
            <view class="tab-item" v-for="(tab, index) in echartTabs" :key="index"
                :class="{ active: echartTabIndex === index }" @click="handleTab(index)">{{ tab.name }}</view>
        </view>
        <view class="mt30">
            <template v-if="isLoading">
                <up-loading-icon size="20"></up-loading-icon>
            </template>
            <template v-else>
                <qiun-data-charts type="area" :opts="opts" :chartData="chartData" :ontouch="true" />
            </template>
        </view>
    </view>
</template>
<script setup lang='ts'>
import { ref } from 'vue';
import { ApiIncomeTrends } from '@/api/income';

const isLoading = ref<boolean>(true);
const echartTabIndex = ref<number>(0);
const echartTabs = ref<any[]>([
    { name: '近3个月', val: 3 },
    { name: '近1年', val: 12 }
]);

const chartData = ref<any>({
    categories: [],
    series: [],
});

const opts = ref<any>({
    color: ['#FF5730'],
    background: '#FF5730',
    enableScroll: true,
    padding: [20, 0, 0, 0],
    xAxis: {
        labelCount: 7,
        fontSize: 10,
        itemCount: 6,
    },
    yAxis: {
        gridType: "dash",
        showTitle: true,
        min: 0,
        max: 1,
        interval: 0.2,
        data: [{
            title: '单位：元',
            titleFontSize: 10,
            titleOffsetY: -6,
            titleOffsetX: 0,
            fontSize: 10,
        }]
    },
    extra: {
    },
});

const handleTab = (index: number) => {
    echartTabIndex.value = index;
    incomeTrends();
};

const incomeTrends = async () => {
    var params = {
        day: echartTabs.value[echartTabIndex.value].val
    };
    isLoading.value = true;
    const res = await ApiIncomeTrends(params);
    chartData.value = {
        categories: res.dateArr ?? [],
        series: [
            {
                name: echartTabIndex.value == 0 ? '近3个月的收入趋势' : '近1年的收入趋势',
                textSize: 10,
                textColor: 'var(--primary-color1)',
                textOffset: -3,
                data: res.moneyArr ?? [0],
            }
        ],
    };
    isLoading.value = false;
};

incomeTrends();
</script>

<style lang="scss" scoped>
.echarts {
    padding: 0 30rpx;
}
</style>