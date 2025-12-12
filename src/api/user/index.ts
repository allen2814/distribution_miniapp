import { request } from "@/utils";
import type { UserLoginModel, SensitiveModel, UserAccountListModel } from "./models";

//用户登录
export const apiUserLogin = async (params: any) => {
    const res = await request<UserLoginModel>({
        method: 'POST',
        url: '/api/user/login',
        data: params
    });

    return res.data
}

//用户敏感信息
export const apiSensitive = async () => {
    const res = await request<SensitiveModel>({
        method: 'GET',
        url: '/api/user/sensitive/info',
    });

    return res.data.userInfo
}

//收款账户
export const apiUserAccount = async () => {
    const res = await request<UserAccountListModel>({
        method: 'GET',
        url: '/api/withdrawal/account_list'
    });
    return res.data.list;
}

//添加收款账户
export const apiAddUserAccount = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/api/withdrawal/account_add',
        data
    });
    return res.data;
}

//删除收款账户
export const apiDeleteUserAccount = async (account_id: number, account_type: number) => {
    const res = await request<any>({
        method: 'DELETE',
        url: `/api/withdrawal/account_delete`,
        data: { account_id, account_type }
    });
    return res.data;
}

//设置默认收款账户
export const apiSetDefaultUserAccount = async (account_id: number, account_type: number) => {
    const res = await request<any>({
        method: 'PUT',
        url: `/api/withdrawal/account_default`,
        data: { account_id, account_type }
    });
    return res.data;
}

//体现申请
export const apiWithdrawalApply = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/api/withdrawal/submit',
        data
    });
    return res.data;
}

//验证邀请码
export const apiVerifyInvitationCode = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/api/user/invitation_code/login',
        data
    });
    return res.data;
}

//实名认证
export const apiUserRealNameAuth = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/api/user/sign_up',
        data
    });
    return res.data;
}