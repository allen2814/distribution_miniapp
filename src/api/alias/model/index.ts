//申词列表模型
export interface RecordModel {
    alias_id: number,
    alias_name?: string,
    alias_status?: number,
    album_name?: string,
    spread_id?: number,
    story_title?: string,
    product_name?: string,
    validity_date?: string,
    validity_period?: string,
    spread_type?: number,
    is_delete?: number
}

//发文模型
export interface BackfillModel {
    id?: number,
    post_date?: string,
    post_link?: string,
    spread_id?: number,
    status?: number,
}

