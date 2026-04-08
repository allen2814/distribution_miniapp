import { request } from "@/utils";
import type { AnimesModel, CategoryModel } from "./models";
import type { ApiRecordsInfo, PageResult } from "../models/common";


export const animesApi = {
    //获取分类
    apiCategorys: async (params?: any) => {
        const res = await request<PageResult<CategoryModel>>({
            method: 'GET',
            url: '/anime/sort/list',
            data: params
        });
        return res.data
    },
    //获取漫剧列表
    apiAnimes: async (params?: any) => {
        const res = await request<PageResult<AnimesModel>>({
            method: 'GET',
            url: '/anime/list',
            data: params
        });
        return res.data
    },
    //获取漫剧详情
    apiAnimeInfo: async (id: number) => {
        const res = await request<ApiRecordsInfo<AnimesModel>>({
            method: 'GET',
            url: `/anime/detail?anime_id=${id}`
        });
        return res.data
    },
    //获取资源
    apiAnimeMaterial: async (id: number) => {
        const res = await request({
            method: 'GET',
            url: `/anime/material/list?anime_id=${id}&sign=applet`
        });
        return res.data
    }
}