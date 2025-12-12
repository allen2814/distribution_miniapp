import { request } from "@/utils";
import type { ApiRecordsInfo, PageResult } from "./models/common";
import type { AlbumCategoryModel, AlbumModel, StoryCategoryModel, StoryModel } from "./models";
import type{ RecordModel } from "./alias/model";


//获取广播剧分类
export const apiAlbumCategorys = async (params?: any) => {
    const res = await request<PageResult<AlbumCategoryModel>>({
        method: 'GET',
        url: '/api/album/sort/list',
        data: params
    });
    return res.data
}

//获取小说分类
export const apiStoryCategorys = async (params?: any) => {
    const res = await request<PageResult<StoryCategoryModel>>({
        method: 'GET',
        url: '/api/story/sort/list',
        data: params
    });
    return res.data
}

//获取广播剧列表
export const apiAlbums = async (params?: any) => {
    const res = await request<PageResult<AlbumModel[]>>({
        method: 'GET',
        url: '/api/album/list',
        data: params
    });
    return res.data
}

//获取小说列表
export const apiStories = async (params?: any) => {
    const res = await request<PageResult<StoryModel[]>>({
        method: 'GET',
        url: '/api/story/list',
        data: params
    });
    return res.data
}

//获取广播剧详情
export const apiAlbumInfo = async (id: number) => {
    const res = await request<ApiRecordsInfo<AlbumModel>>({
        method: 'GET',
        url: `/api/album/detail?album_id=${id}`
    });
    return res.data;
}

//获取小说详情
export const apiStoryInfo = async (id: number) => {
    const res = await request<ApiRecordsInfo<StoryModel>>({
        method: 'GET',
        url: `/api/story/detail?user_story_id=${id}`
    });
    return res.data;
}

//获取申词记录
export const ApiRecords = async (params?: any) => {
    const res = await request<PageResult<RecordModel>>({
        method: 'GET',
        url: '/api/alias/record/list',
        data: params
    });
    return res.data;
}

//删除申词记录
export const ApiRecordsDelete = async (id: number, alias_id: number) => {
    const res = await request({
        method: 'DELETE',
        url: `/api/alias/record/delete?spread_id=${id}&alias_id=${alias_id}`
    });
    return res.data;
}

//删除申词记录
export const ApiRecordsAdd = async (params?: any) => {
    const res = await request({
        method: 'POST',
        url: '/api/alias/spread/record',
        data: params
    });
    return res.data;
}

//素材下载
export const apiAlbumMaterial = async (id: number) => {
    const res = await request<any>({
        method: 'GET',
        url: `/api/album/material/list?album_id=${id}&sign=applet`
    });
    return res.data;
}