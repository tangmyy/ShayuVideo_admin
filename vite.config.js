import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { wrapperEnv } from "./src/utils/getEnv";
import { visualizer } from "rollup-plugin-visualizer";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import viteCompression from "vite-plugin-compression";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// @see: https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);
	return {
		define: {
			__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
		},
		base: "./",
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
				vue: 'vue/dist/vue.esm-bundler.js',
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "@/styles/var.scss";`,
					silenceDeprecations: ['legacy-js-api']
				}
			}
		},
		server: {
			// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
			host: "0.0.0.0",
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true,
			// 跨域代理配置
			proxy: {
				// 用户管理相关接口
				"/userInfo": {
					target: "http://106.54.6.213:8088",
					changeOrigin: true,
					secure: false
				},
				// 视频管理相关接口
				"/vlog": {
					target: "http://106.54.6.213:8088",
					changeOrigin: true,
					secure: false
				}
			}
		},
		plugins: [
			vue(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			// * 使用 svg 图标
			createSvgIconsPlugin({
				iconDirs: [resolve(process.cwd(), "src/assets/icons")],
				symbolId: "icon-[dir]-[name]"
			}),
			// * vite 可以使用 jsx 语法
			vueJsx(),
			// * name 可以写在 script 标签上
			VueSetupExtend(),
			// * 是否生成包预览(分析依赖包大小,方便做优化处理)
			viteEnv.VITE_REPORT && visualizer(),
			// * gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				}),
			// * demand import element
			AutoImport({
				resolvers: [ElementPlusResolver()],
				dts: false
			}),
			Components({
				resolvers: [ElementPlusResolver()],
				dts: false
			})
		],
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		build: {
			outDir: "dist",
			minify: "esbuild",
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});
