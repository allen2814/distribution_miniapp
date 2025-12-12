export interface PageResult<T> {
	items: T[];
	data: T[];
	page: number;
	pageSize: number;
	total: number;
	totalPage: number;
}

export interface ApiResult<T> {
	code: string,
	msg: string,
	data: T,
}

export interface ApiRecordsInfo<T> {
	items: T,
}
