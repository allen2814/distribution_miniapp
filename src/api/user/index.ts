import { request } from "@/utils";
import type { UserLoginModel, SensitiveModel, UserAccountListModel } from "./models";

//用户登录
export const apiUserLogin = async (params: any) => {
    const res = await request<UserLoginModel>({
        method: 'POST',
        url: '/user/login',
        data: params
    });

    return res.data
}

//用户敏感信息
export const apiSensitive = async () => {
    const res = await request<SensitiveModel>({
        method: 'GET',
        url: '/user/sensitive/info',
    });

    return res.data.userInfo
}

//收款账户
export const apiUserAccount = async () => {
    const res = await request<UserAccountListModel>({
        method: 'GET',
        url: '/withdrawal/account_list'
    });
    return res.data.list;
}

//添加收款账户
export const apiAddUserAccount = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/withdrawal/account_add',
        data
    });
    return res.data;
}

//修改收款账户
export const apiUpdateUserAccount = async (data: any) => {
    const res = await request<any>({
        method: 'PUT',
        url: '/withdrawal/account_update',
        data
    });
    return res.data;
}

//删除收款账户
export const apiDeleteUserAccount = async (account_id: number, account_type: number) => {
    const res = await request<any>({
        method: 'DELETE',
        url: `/withdrawal/account_delete`,
        data: { account_id, account_type }
    });
    return res.data;
}

//设置默认收款账户
export const apiSetDefaultUserAccount = async (account_id: number, account_type: number) => {
    const res = await request<any>({
        method: 'PUT',
        url: `/withdrawal/account_default`,
        data: { account_id, account_type }
    });
    return res.data;
}

//获取收款账户详情
export const apiGetUserAccountDetail = async (account_id: number, account_type: number) => {
    const res = await request<any>({
        method: 'GET',
        url: `/withdrawal/get_account?account_id=${account_id}&account_type=${account_type}`,
    });
    return res.data;
}

//体现申请
export const apiWithdrawalApply = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/withdrawal/submit',
        data
    });
    return res.data;
}

//验证邀请码
export const apiVerifyInvitationCode = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/user/invitation_code/login',
        data
    });
    return res.data;
}

//实名认证
export const apiUserRealNameAuth = async (data: any) => {
    const res = await request<any>({
        method: 'POST',
        url: '/user/real_name',
        data
    });
    return res.data;
}

//实名认证链接说去
export const apiGetRealNameAuthUrl = async () => {
    const res = await request<any>({
        method: 'GET',
        url: '/alipay/verify',
    });
    return res.data;
}

//实名认证结果
export const apiGetRealNameAuthResult = async (user_id: number) => {
    const res = await request<any>({
        method: 'GET',
        url: '/alipay/register/query?out_register_id=' + user_id,
    });
    console.log('res', res);
    return res.data;
}