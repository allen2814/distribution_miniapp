import { request } from "@/utils";
import type { ApiRecordsInfo, PageResult } from "./models/common";
import type { AlbumCategoryModel, AlbumModel, StoryCategoryModel, StoryChapterModel, StoryModel } from "./models";
import type{ RecordModel } from "./alias/model";


//获取广播剧分类
export const apiAlbumCategorys = async (params?: any) => {
    const res = await request<PageResult<AlbumCategoryModel>>({
        method: 'GET',
        url: '/album/sort/list',
        data: params
    });
    return res.data
}

//获取小说分类
export const apiStoryCategorys = async (params?: any) => {
    const res = await request<PageResult<StoryCategoryModel>>({
        method: 'GET',
        url: '/story/sort/list',
        data: params
    });
    return res.data
}

//获取广播剧列表
export const apiAlbums = async (params?: any) => {
    const res = await request<PageResult<AlbumModel[]>>({
        method: 'GET',
        url: '/album/list',
        data: params
    });
    return res.data
}

//获取小说列表
export const apiStories = async (params?: any) => {
    const res = await request<PageResult<StoryModel[]>>({
        method: 'GET',
        url: '/story/list',
        data: params
    });
    return res.data
}

//获取广播剧详情
export const apiAlbumInfo = async (id: number) => {
    const res = await request<ApiRecordsInfo<AlbumModel>>({
        method: 'GET',
        url: `/album/detail?album_id=${id}`
    });
    return res.data;
}

//获取小说详情
export const apiStoryInfo = async (id: number) => {
    const res = await request<ApiRecordsInfo<StoryModel>>({
        method: 'GET',
        url: `/story/detail?user_story_id=${id}`
    });
    return res.data;
}

//获取小说章节列表
export const apiStoryChapters = async (params?: any) => {
    const res = await request<PageResult<StoryChapterModel>>({
        method: 'GET',
        url: '/story/chapter/list',
        data: params
    });
    return res.data
}

//获取小说章节详情
export const apiStoryChapterDetail = async (id: number) => {
    const res = await request<StoryChapterModel>({
        method: 'GET',
        url: `/story/chapter/detail?id=${id}`,
    });
    return res.data
}


//获取申词记录
export const ApiRecords = async (params?: any) => {
    const res = await request<PageResult<RecordModel>>({
        method: 'GET',
        url: '/alias/record/list',
        data: params
    });
    return res.data;
}

//删除申词记录
export const ApiRecordsDelete = async (id: number, alias_id: number) => {
    const res = await request({
        method: 'DELETE',
        url: `/alias/record/delete?spread_id=${id}&alias_id=${alias_id}`
    });
    return res.data;
}

//删除申词记录
export const ApiRecordsAdd = async (params?: any) => {
    const res = await request({
        method: 'POST',
        url: '/alias/spread/record',
        data: params
    });
    return res.data;
}

//素材下载
export const apiAlbumMaterial = async (id: number) => {
    const res = await request<any>({
        method: 'GET',
        url: `/album/material/list?album_id=${id}&sign=applet`
    });
    return res.data;
}