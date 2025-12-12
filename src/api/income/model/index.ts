//收入明细模型
export interface IncomeModel {
    available_amount: number,
    frozen_amount?: number,
    total_income?: number,
    total_withdraw?: number,
    apply_amount?: number,
    pending_deposit?: number,
}

//收款账号
export interface IncomeAccountModel {
    id?: number,
    real_name: string,
    id_card_number: string,
    mobile: string,
    account_type?: number,
    bank_name?: string,
    sub_bank_name?: string,
    account_number?: string,
}