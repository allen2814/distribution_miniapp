import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
  plugins: [uni()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://kol.mixs.cn",
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/rewrite/, '')
  //     },
  //   },
  // },
  server: {
    proxy: {
      "/api": {
        target: "http://kol.mixs.cn",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/rewrite/, '')
      },
    },
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://dist.easyipx.zuidie.net",
  //       changeOrigin: true,
  //       rewrite: path => path.replace('/api', '')
  //     },
  //   },
  // },
});
