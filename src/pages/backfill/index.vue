<template>
    <up-navbar bgColor="inherit" :fixed="false" :autoBack="true">
        <template #center>
            <text class="up-navbar-title">回填发文</text>
        </template>
        <template #right>
            <CapsuleButton />
        </template>
    </up-navbar>
    <view class="main-wrapper pb30">
        <view class="bar-title">
            <view class="bar-title-bg">
                <text class="title">基础信息</text>
            </view>
        </view>
        <view class="default-info-list">
            <view class="item">
                <view class="name">任务类型：</view>
                <view class="value">{{ SpreadTypeEnum[spread_type] }}</view>
            </view>
            <view class="item">
                <view class="name">标题：</view>
                <view class="value">{{ album_name }}</view>
            </view>
            <view class="item">
                <view class="name">别名：</view>
                <view class="value">{{ alias_name }}</view>
            </view>
        </view>
        <view class="bar-title">
            <view class="bar-title-bg">
                <text class="title">平台发文</text>
            </view>
        </view>
        <up-form ref="formRef" :model="model" :rules="rules">
            <view class="fawen-pingtai">
                <view class="item" v-for="(it, index) in posts" :key="index">
                    <up-form-item :prop="`items.${index}.post_date`" label="">
                        <view class="date-picker"
                            :style="{ 'background-color': it.id !== undefined ? 'rgb(245, 247, 250)' : 'transparent' }">
                            <picker mode="date" :value="it.post_date" :end="getToday()"
                                @change="onPickerChange(index, $event)" :disabled="it.id !== undefined">
                                <view class="time">{{ it.post_date || '请选择日期' }}</view>
                            </picker>
                            <up-icon name="calendar" color="#A0A5B6" size="20"></up-icon>
                        </view>
                    </up-form-item>
                    <up-form-item :prop="`items.${index}.post_link`" label="" style="flex: 1;">
                        <up-input v-model="it.post_link" :disabled="it.id !== undefined"
                            placeholder="请输入发文链接, https:// 开头" style="margin-left: 20rpx; flex: 1; height: 38rpx;"
                            :placeholder-style="'font-size:26rpx;color:#DFE2EA;'" />
                    </up-form-item>
                    <view class="remove" @click="removeItem(index)">
                        <up-icon name="minus-circle" color="var(--primary-color2)" size="20"></up-icon>
                    </view>
                </view>
                <view class="fawen-add" @click="addItem">
                    <up-icon name="plus" color="var(--primary-color1)" size="12"></up-icon>
                    <text>添加</text>
                </view>
                <view class="submit-btn" @click="handleSubmit">
                    <text>提交</text>
                </view>
            </view>
        </up-form>
    </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getToday } from '@/utils/main';
import { SpreadTypeEnum } from '@/utils/enums';
import { ApiBackfillAdd, ApiBackfillDelete, ApiBackfills } from '@/api/alias';

import CapsuleButton from '@/components/capsule-button.vue';

interface PostItem {
    id?: number;
    spread_id?: number;
    post_date: string;
    post_link: string;
}

const formRef = ref<any>(null);
const isSubmitting = ref(false);
const rules = ref<Record<string, any>>({});

const spread_id = ref<number>(0);
const spread_type = ref<number>(1);
const alias_name = ref<string>('');
const album_name = ref<string>('');
const posts = ref<PostItem[]>([

]);
const model = ref({ items: posts.value });

// 动态生成 rules
const genRules = () => {
    const obj: Record<string, any> = {};
    posts.value.forEach((_, idx) => {
        obj[`items.${idx}.post_date`] = [{ required: true, message: '请选择日期', trigger: ['blur', 'change'] }];
        obj[`items.${idx}.post_link`] = [
            { required: true, message: '请输入发文链接', trigger: ['blur', 'change'] },
            {
                pattern: /^https?:\/\/.+/,
                message: '必须以 http:// 或 https:// 开头',
                trigger: ['blur', 'change']
            }
        ];
    });
    rules.value = obj;
};

// 添加一项发文
const addItem = () => {
    posts.value.push({ post_date: '', post_link: '' });
    genRules();
};

// 删除一项发文
const removeItem = (index: number) => {
    if (posts.value[index].id === undefined) {
        posts.value.splice(index, 1);
        genRules();
        return;
    } else {
        ApiBackfillDelete(posts.value[index].id!).then(() => {
            uni.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000,
                success: () => {
                    posts.value.splice(index, 1);
                    genRules();
                }
            });
        });
    }

};

// 选中日期
function onPickerChange(index: number, e: any) {
    const val = e?.detail?.value;
    if (typeof index === 'number' && typeof val === 'string') {
        posts.value[index].post_date = val;
        formRef.value.validate();
    }
}

// 提交
const handleSubmit = async () => {
    if (isSubmitting.value) return;

    if (posts.value.length === 0) {
        uni.showToast({ title: '请添加发文信息', icon: 'none' });
        return;
    }

    const hasIncrementedPosts = posts.value.some(p => p.id === undefined);
    if (!hasIncrementedPosts) {
        uni.showToast({ title: '没有新增的发文信息', icon: 'none' });
        return;
    }

    try {
        // 开始提交
        isSubmitting.value = true;
        await formRef.value.validate();
        const param = {
            posts: posts.value.filter(p => p.id === undefined)
        };
        await ApiBackfillAdd(param);
        uni.showToast({ title: '提交成功', icon: 'success', duration: 2000 });
        backfills();
    } catch (err: any) {
        console.log('handleSubmit error', err);
        uni.showToast({ title: err?.message || '提交失败', icon: 'none' });
    } finally {
        isSubmitting.value = false;
        posts.value = [];
        uni.hideLoading();
    }
};

// 获取已有发文记录
const backfills = async () => {
    if (!spread_id.value) return;
    try {
        const { data } = await ApiBackfills(spread_id.value);
        if (Array.isArray(data)) {
            posts.value = data.map((it: any) => ({
                id: it.id,
                spread_id: spread_id.value,
                post_date: it.post_date || '',
                post_link: it.post_link || ''
            }));
            genRules();
        }

    } catch (err) {
        console.warn('backfills fetch failed', err);
    }
};

watch(posts, (newVal) => {
    model.value.items = newVal;
    newVal.forEach(p => p.spread_id = spread_id.value ?? 0);
}, { deep: true });

onLoad((options: Record<string, any> = {}) => {
    try {
        const {
            spread_id: spreadIdParam,
            spread_type: spreadTypeParam,
            alias_name: aliasParam = '',
            album_name: albumNameParam = '',
            story_title: storyTitleParam = ''
        } = options;

        const toNumber = (v: any, fallback = 0) => {
            const n = Number(v);
            return Number.isNaN(n) ? fallback : n;
        };

        const safeStr = (v: any) => {
            if (v == null) return '';
            const s = String(v);
            try { return decodeURIComponent(s); } catch { return s; }
        };

        spread_id.value = toNumber(spreadIdParam, 0);
        const st = toNumber(spreadTypeParam, 1);
        spread_type.value = st === 1 || st === 2 ? st : 1;
        alias_name.value = safeStr(aliasParam);
        album_name.value = st === 2 ? safeStr(storyTitleParam) : safeStr(albumNameParam);

        // 同步已有 posts 的 spread_id
        posts.value.forEach(p => p.spread_id = spread_id.value ?? 0);

        // 尝试拉取后端已有发文记录
        backfills();
        genRules();
    } catch (err) {
        console.warn('backfill onLoad parse options error', err);
    }
});
</script>
<style>
page {
    background: var(---, #FAFAFA);
}
</style>

<style lang="scss" scoped>
.date-picker {
    display: flex;
    align-items: center;
    border: 1rpx solid #dadbde;
    padding: 6px 9px;
    width: 200rpx;
    height: 38rpx;
    border-radius: 4rpx;
    display: flex;

    .time {
        flex: 1;
        padding-right: 15rpx;
        font-size: 26rpx;
        color: var(--primary-color1);
    }
}
</style>
