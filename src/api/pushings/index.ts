import type { PageResult } from "@/api/models/common";
import type { AlbumPushingModel } from "./model";
import { request } from "@/utils";

//在推列表
export const getAlbumPushings = async (params?: any) => {
    const res = await request<PageResult<AlbumPushingModel>>({
        method: 'GET',
        url: '/api/album/pushing/list',
        data: params
    });
    return res.data;
};