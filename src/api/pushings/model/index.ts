//在推列表
export interface AlbumPushingModel {
    id?: string;
    //别名
    alias_name?: string;
    //召回
    recall_count?: number;
    //拉新
    new_user_count?: number;
    //拉新奖励
    new_user_reward?: number;
    //搜索
    search_count?: number;
    //充值
    recharge?: number;
    //首充
    first_recharge?: number;
    //复充
    repeat_recharge?: number;
    //预估收益
    estimated_revenue?: number;
    //有效期
    validity_period?: string;
    //是否生效
    is_effective?: number;
    //专辑名称
    album_name?: string;
    story_title?: string;
    spread_type?: number;
}