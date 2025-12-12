export interface Events {
    //刷新收入
    againLoadIncome: (e: boolean) => void;
    //新用户引导
    GUIDE_NEW_USER: (e: boolean) => void;
}