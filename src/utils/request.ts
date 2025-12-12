import type { ApiResult } from "@/api/models/common";
import { BASE_URL } from "@/config";
import { useUserStore } from "@/stores";


export const request = <T>(options: UniApp.RequestOptions) => {
	const { token } = useUserStore();

	const headers = {
		Authorization: token,
		token: token,
		...(options.header || {})
	};

	const url = options.url?.startsWith('http')
		? options.url
		: BASE_URL + options.url;

	return new Promise<ApiResult<T>>((resolve, reject) => {
		uni.request({
			...options,
			url,
			header: headers,
			timeout: options.timeout ?? 10000,
			success(res: any) {
				const data = res.data;
				if (data.code !== 200) {
					uni.showToast({
						title: data.msg || '请求失败',
						icon: 'none'
					});
					return;
				}
				resolve(data);
			},
			fail(err) {
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
				reject(err);
			}
		});
	});
};