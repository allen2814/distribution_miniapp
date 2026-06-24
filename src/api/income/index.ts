import type { PageResult } from "@/api/models/common";
import { request } from "@/utils";

//收入明细
export const ApiIncomeDetails = async () => {
    const res = await request<any>({
        method: 'GET',
        url: `/income/detail`,
    });
    return res.data;
}

//收入趋势
export const ApiIncomeTrends = async (params: any) => {
    const res = await request<any>({
        method: 'GET',
        url: `/income/trends`,
        data: params
    });
    return res.data;
}

//收入记录
export const ApiOrders = async (params: any) => {
    const res = await request<PageResult<any[]>>({
        method: 'GET',
        url: `/alias/order/list`,
        data: params
    });
    return res.data;
}

//拉新记录
export const ApiPullUsers = async (params: any) => {
    const res = await request<PageResult<any[]>>({
        method: 'GET',
        url: `/alias/new_user_log`,
        data: params
    });
    return res.data;
}

//活动红包记录
export const ApiActivityList = async (params: any) => {
    const res = await request<PageResult<any[]>>({
        method: 'GET',
        url: `/activity/list`,
        data: params
    });
    return res.data;
}

//提现记录
export const ApiWithdrawals = async (params: any) => {
    const res = await request<PageResult<any[]>>({
        method: 'GET',
        url: `/withdrawal/list`,
        data: params
    });
    return res.data;
}

//申请提现
export const ApiApplyWithdrawal = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: `/withdrawal/submit`,
        data
    });
    return res.data;
}