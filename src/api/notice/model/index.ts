//消息通知
export interface NoticeModel {
    messageId: number,
    title?: string,
    content?: string,
    sendTime?: string,
    readStatus?: string,
    is_default_top?: number
}