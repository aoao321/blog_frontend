import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      // 自动导入的API
      imports: [
        "vue",
        "vue-router",
        "pinia",
        {
          "@vueuse/core": [
            "useMouse",
            "useFetch",
            ["useStorage", "useLocalStorage"],
          ],
          axios: [["default", "axios"]],
        },
      ],
      // Element Plus自动导入解析
      resolvers: [
        ElementPlusResolver(),
        // 图标自动导入
        IconsResolver({
          prefix: "Icon",
        }),
      ],
      // 生成自动导入的TS声明文件
      dts: "src/auto-imports.d.ts",
      // ESLint配置
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
      },
    }),
    Components({
      // 组件自动导入配置
      dirs: ["src/components"], // 自动导入自定义组件的目录
      extensions: ["vue"], // 文件扩展名
      deep: true, // 深度扫描子目录
      // 解析器配置
      resolvers: [
        ElementPlusResolver(),
        // 图标组件解析器
        IconsResolver({
          enabledCollections: ["ep"], // Element Plus图标集
        }),
      ],
      // 生成组件类型声明文件
      dts: "src/components.d.ts",
    }),
    // 图标插件
    Icons({
      autoInstall: true,
      compiler: "vue3",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // 优化配置
  optimizeDeps: {
    include: ["vue", "vue-router", "pinia", "@vueuse/core"],
  },
  // CSS配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
});
