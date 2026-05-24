//生产环境
const PROD_BASE_URL = "http://kol.mixs.cn/api";
//测试环境
//const PROD_BASE_URL = "https://dist.easyipx.zuidie.net";
//const PROD_BASE_URL = "http://dev.kol.mixs.cn/api";

// #ifdef H5
const BASE_URL = import.meta.env.DEV ? "/api" : PROD_BASE_URL;
// #endif
// #ifndef H5
const BASE_URL = PROD_BASE_URL;
// #endif

export { BASE_URL };