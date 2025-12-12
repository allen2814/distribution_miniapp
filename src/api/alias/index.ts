import type { PageResult } from "@/api/models/common";
import type { RecordModel, BackfillModel } from "./model";
import { request } from "@/utils";

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

//添加申词记录
export const ApiRecordsAdd = async (params?: any) => {
    const res = await request({
        method: 'POST',
        url: '/api/alias/spread/record',
        data: params
    });
    return res.data;
}

//发文列表
export const ApiBackfills = async (spread_id: number) => {
    const res = await request<PageResult<BackfillModel>>({
        method: 'GET',
        url: `/api/alias/backfill/list?spread_id=${spread_id}&pageSize=1000`,
    });
    return res.data;
}

//新增发文
export const ApiBackfillAdd = async (params?: any) => {
    const res = await request<PageResult<BackfillModel>>({
        method: 'POST',
        url: '/api/alias/backfill/add',
        data: params
    });
    return res.data;
}

//删除发文
export const ApiBackfillDelete = async (id: number) => {
    const res = await request<PageResult<BackfillModel>>({
        method: 'DELETE',
        url: `/api/alias/backfill/delete?id=${id}`,
    });
    return res.data;
}