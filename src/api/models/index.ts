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
    nickname?: string,
    cover_image?: string,
    type?: number,
    name?: string,
    content?: string,
    summary?: string,
    words?: number,
    first_recharge?: string,
    recharge?: string,
    revenue?: number,
    participate_count?: number,
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

//小说章节模型
export interface StoryChapterModel {
    id: number,
    type: number,
    storyId: number,
    title: string,
    status: number,
    sort: number,
    isFree: boolean,
    content: string,
    words: number,
    created_at: string,
    is_free?: number,
}

//书单模型
export interface BookListModel {
    id: number,
    title: string,
    desc: string,
    summary: string,
    first_recharge?: string,
    recharge?: string,
    revenue?: number,
    participate_count?: number,
    collect_total?: number,
    story_total?: number,
    story_brief_info: BookListStoryModel[],
    user_info: {
        avatar: string,
        nickname: string,
        user_id: number,
    },
}

//书单中的书
export interface BookListStoryModel {
    cover_image: string,
    is_vip: number,
    title: string,
    summary: string,
    user_story_id: number,
    author_name: string,
    sort_name: string,
    is_contract: number,
}
