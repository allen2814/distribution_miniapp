//预览图片
function previewImages(FilePaths: any, current: number | null = null, currentImgUrl?: string) {
	if (current === undefined || current === null) {
		current = FilePaths.indexOf(currentImgUrl)
	}
	const images: string[] = [];
	FilePaths.map((item: any) => {
		images.push(item);
	});

	uni.previewImage({
		urls: images,
		current: current ?? 0
	});
};

//当前时间
function getToday(): string {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

function formatDateTime(dateTimeStr: string, timeStr: string = 'yyyy-MM-dd HH:mm:ss'): string {
	if (!dateTimeStr) return '';
	const date = new Date(dateTimeStr);
	if (isNaN(date.getTime())) return '';

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return timeStr
		.replace('yyyy', year.toString())
		.replace('MM', month)
		.replace('dd', day)
		.replace('HH', hours)
		.replace('mm', minutes)
		.replace('ss', seconds);
}

//封装toFixed方法 防止报错
function safeToFixed(value: number | undefined | null, decimals: number): string {
	if (value === undefined || value === null || isNaN(value)) return '0.00';
	return value.toFixed(decimals);
}

function safeToFixedW(value: number | undefined | null): string {
	if (value === undefined || value === null || isNaN(value)) return '1.0';
	else if (value < 10000) {
		return '1.0';
	} else {
		//比如12000 显示1.2万
		value = value / 10000;
		return value.toFixed(1);
	}
}

//\n换成小程序的换行符
function ReplaceNewlinesWithBr(text: string): string {
	return text.replace(/\n/g, '<br/>');
}

//数字 前面的4个和后面的3个正常显示，其他的用*号代替
function maskNumber(num: string): string {
	if (num.length <= 7) {
		return num;
	}
	const start = num.slice(0, 4);
	const end = num.slice(-3);
	const masked = '*'.repeat(num.length - 7);
	return `${start}${masked}${end}`;
}

/**
 * 将消息时间格式化：
 * - 若时间距离现在小于 1 分钟 -> 返回 `刚刚`
 * - 小于 1 小时 -> `x分钟前`
 * - 小于 24 小时 -> `x小时前`
 * 1-3 天内 -> `x天前`
 * 超过 3 天或时间无效 -> 返回 `yyyy-MM-dd HH:mm`
 */
function formatMessageTime(dateTimeStr: string): string {
	if (!dateTimeStr) return '';
	const date = new Date(dateTimeStr);
	if (isNaN(date.getTime())) return '';

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();

	// 如果是将来的时间，直接返回格式化的具体日期时间
	if (diffMs < 0) return formatDateTime(dateTimeStr, 'yyyy-MM-dd HH:mm');

	const seconds = Math.floor(diffMs / 1000);
	if (seconds < 60) return '刚刚';

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}分钟前`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}小时前`;

	const days = Math.floor(hours / 24);
	if (days <= 3) return `${days}天前`;

	return formatDateTime(dateTimeStr, 'yyyy-MM-dd HH:mm');
}

//人数低于500人，显示随机显示300-2000人，人数超过500人，显示具体人数
function displayUserCount(count: number): string {
	if (count < 500) {
		const min = 300;
		const max = 2000;
		const randomCount = Math.floor(Math.random() * (max - min + 1)) + min;
		return randomCount.toString();
	} else {
		return count.toString();
	}
}

//过滤html标签 去掉内容前后空格 处理 \n\n
function filterHtmlTag(htmlString?: string): string {
	if (!htmlString) return '';
	return htmlString.replace(/<[^>]+>/g, '').trim().replace(/\n\n/g, '');
}

function wordsCount(val?: number): string {
	if (!val) return "0";
	if (val < 10000) {
		return val.toString();
	} else {
		return Number((val / 10000).toFixed(2)).toString() + '万';
	}
}


export {
	previewImages,
	getToday,
	formatDateTime,
	safeToFixed,
	safeToFixedW,
	ReplaceNewlinesWithBr,
	maskNumber,
	formatMessageTime,
	displayUserCount,
	filterHtmlTag,
	wordsCount
}
