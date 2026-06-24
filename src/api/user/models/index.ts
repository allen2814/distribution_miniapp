//用户模型
export interface UserModel {
    user_id: number,
    nickname?: string,
    real_name: string,
    mobile: string,
    avatar?: string,
    id_card_number?: string,
    verification_status: number,
    type?: number,
    is_course: number,
    is_story: number,
    is_book_list: number,
    is_anime: number,
}

//用户登录模型
export interface UserLoginModel {
    token: UserTokenModel,
    is_new: number
}

//用户敏感信息模型
export interface SensitiveModel {
    userInfo: UserModel
}

//用户令牌模型
export interface UserTokenModel {
    AccessToken: string,
    RefreshToken: string
}

//收款账户列表模型
export interface UserAccountListModel {
    list: UserAccountModel[],
}

//收款账户模型
export interface UserAccountModel {
    account_id: number,
    account_type: number,
    real_name: string,
    mobile: string,
    account_number: string,
    bank_name?: string,
    sub_bank_name?: string,
    is_default: boolean,
}


