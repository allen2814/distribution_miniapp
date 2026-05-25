//漫剧模型
export interface AnimesModel {
    serial_status: number            // 连载状态
    spread_status: number            // 推广状态
    publish_time: string | null      // 发布时间
    updated_at: string               // 更新时间
    anime_id: number                 // 漫剧id
    anime_name: string               // 漫剧名称
    cover: string                    // 封面
    theme_id: number                 // 主题id
    setting_id: number               // 设定id
    background_id: number            // 背景id
    series_type: number              // 系列类型
    incr_revenue: number             // 增量收益
    revenu: number                   // 最高收益
    participate_count: number        // 已参与
    theme_name: string               // 主题名称
    setting_name: string             // 设定名称
    background_name: string          // 背景名称
    first_recharge: string           // 首充分佣
    recharge: string                 // 复充分佣
    spread_time: string              // 推广时间
    desc: string                     // 漫剧简介
}

//分类模型
export interface CategoryModel {
    id?: number,
    name?: string,
}
