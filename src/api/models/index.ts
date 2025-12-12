//广播剧模型
export interface AlbumModel {
    album_id: number,
    name?: string,
    cover?: string,
    intro?: string,
    album_total?: number,
    cv_nicknames?: string,
    series_name?: string,
    sort_name?: string,
    tags?: string,
    hits?: number,
    is_exclusive?: boolean,
    status?: number,
    revenue?: number,
    participate_count?: number,
    first_recharge?: string,
    recharge?: string,
}

//小说模型
export interface StoryModel {
    user_story_id: number,
    title?: string,
    cover_image?: string,
    name?: string,
    content?: string,
    summary?: string,
}

//广播剧分类模型
export interface AlbumCategoryModel {
    id?: number,
    name?: string,
}

//小说分类模型
export interface StoryCategoryModel {
    id?: number,
    name?: string,
}