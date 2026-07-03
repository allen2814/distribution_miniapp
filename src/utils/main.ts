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
	if (count < 50) {
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

/**
 * 校验证件号码，支持大陆身份证、港澳台证件及外籍护照等
 */
function isValidIdDocument(value: string): boolean {
	const id = value.trim();
	if (!id || id.length < 6 || id.length > 30) return false;
	if (!/^[A-Za-z0-9()\-]+$/.test(id)) return false;

	// 疑似大陆18位身份证时做严格校验
	if (/^\d{17}[\dXx]$/.test(id)) {
		return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(id);
	}
	// 旧版大陆15位身份证
	if (/^\d{15}$/.test(id)) return true;

	const regionalPatterns = [
		// 香港身份证，如 A123456(7) 或 A1234567
		/^[A-Z]{1,2}\d{6}\(?[0-9A]\)?$/i,
		// 澳门身份证，如 1234567(8)
		/^[157]\d{6}\(?\d\)?$/,
		// 台湾身份证 / 居留证等
		/^[A-Z][1289]\d{8}$/i,
		/^[A-Z]{2}\d{8}$/i,
		// 外籍护照等（须含字母）
		/^(?=.*[A-Za-z])[A-Za-z0-9\-]{6,30}$/,
	];

	return regionalPatterns.some((pattern) => pattern.test(id));
}

/**
 * 校验手机号，支持大陆、港澳台及国际号码
 */
function isValidMobile(value: string): boolean {
	let mobile = value.trim().replace(/[\s\-]/g, '');
	if (!mobile) return false;
	if (mobile.startsWith('00')) {
		mobile = '+' + mobile.slice(2);
	}
	if (!/^\+?\d+$/.test(mobile)) return false;

	const patterns = [
		// 大陆手机号
		/^1[3-9]\d{9}$/,
		/^86[1-9]\d{10}$/,
		/^\+86[1-9]\d{10}$/,
		// 香港（8位 / 带区号）
		/^[569]\d{7}$/,
		/^852[569]\d{7}$/,
		/^\+852[569]\d{7}$/,
		// 澳门
		/^6\d{7}$/,
		/^8536\d{7}$/,
		/^\+8536\d{7}$/,
		// 台湾
		/^09\d{8}$/,
		/^88609\d{8}$/,
		/^\+88609\d{8}$/,
		// 国际号码（带 + 号）
		/^\+[1-9]\d{6,14}$/,
		// 其他地区号码（8-15位数字）
		/^[1-9]\d{7,14}$/,
	];

	return patterns.some((pattern) => pattern.test(mobile));
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
	wordsCount,
	isValidIdDocument,
	isValidMobile
}
