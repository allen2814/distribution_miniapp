import type { PageResult } from "@/api/models/common";
import type { NoticeModel } from "./model";
import { request } from "@/utils";

//消息通知
export const getNotices = async (params?: any) => {
    const res = await request<PageResult<NoticeModel>>({
        method: 'GET',
        url: '/api/system/platform/notice',
        data: params
    });
    return res.data;
}

//消息通知详情页
export const getNoticeDetail = async (id: number) => {
    const res = await request<NoticeModel>({
        method: 'GET',
        url: `/api/system/platform/detial?messageId=${id}`,
    });
    return res.data;
}