import "./assets/main.css";
import "animate.css";

import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
// 导入全局路由守卫
import "@/permission";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";

// 保存应用实例到变量
const app = createApp(App);

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 最后挂载应用
app.use(router).mount("#app");
