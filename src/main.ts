import { createSSRApp } from "vue";
import App from "./App.vue";
import uviewPlus from 'uview-plus';
import pinia from "@/stores";

import "uview-plus/index.scss";
import '@/static/css/base.scss';
import '@/static/css/index.scss';
import '@/static/css/iconfont.css';
import '@/static/css/myp.scss';

export function createApp() {
	const app = createSSRApp(App);
	app.use(uviewPlus);
	app.use(pinia)
	return {
		app,
	};
}