<template>
  <div class="grid grid-cols-2 h-screen">
    <!-- 左侧展示区 -->
    <div class="col-span-2 order-2 p-10 md:col-span-1 md:order-1 bg-slate-600">
      <div
        class="flex justify-center items-center h-full flex-col animate__animated animate__bounceInRight animate__fast"
      >
        <h2 class="font-bold text-4xl mb-7 text-white">Weblog 博客登录</h2>
        <p class="text-white">
          一款由 Spring Boot + Mybaits Plus + Vue 3.2 + Vite 4
          开发的前后端分离博客。
        </p>
        <img src="@/assets/developer.png" class="w-1/2" />
      </div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="col-span-2 order-1 md:col-span-1 md:order-2 bg-white">
      <div class="flex justify-center items-center h-full flex-col">
        <h1 class="font-bold text-4xl mb-5">欢迎回来</h1>
        <div
          class="flex items-center justify-center mb-7 text-gray-400 space-x-2"
        >
          <span class="h-[1px] w-16 bg-gray-200"></span>
          <span>账号密码登录</span>
          <span class="h-[1px] w-16 bg-gray-200"></span>
        </div>

        <!-- 表单绑定ref和rules -->
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="w-5/6 md:w-2/5"
        >
          <el-form-item prop="username">
            <el-input
              size="large"
              v-model="form.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              size="large"
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              clearable
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              class="w-full mt-2"
              size="large"
              type="primary"
              @click="onSubmit"
              :loading="loading"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入 Element Plus 中的用户、锁图标
import { User, Lock } from "@element-plus/icons-vue";
import { login } from "@/api/admin/user";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { showMessage } from "@/composables/util.js";
import { setToken } from "@/composables/auth";

// 定义响应式的表单对象
const form = reactive({
  username: "",
  password: "",
});

const router = useRouter();
// 登录按钮加载
const loading = ref(false);

// 表单引用
const formRef = ref(null);
// 表单验证规则
const rules = {
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
  ],
};

const onSubmit = () => {
  console.log("登录");
  // 先验证 form 表单字段
  formRef.value.validate((valid) => {
    if (!valid) {
      console.log("表单验证不通过");
      return false;
    }
    // 开始加载
    loading.value = true;

    // 调用登录接口
    login(form.username, form.password)
      .then((res) => {
        console.log(res);
        // 判断是否成功
        if (res.success == true) {
          // 提示登录成功
          showMessage("登录成功");

          // 存储 Token 到 Cookie 中
          let token = res.data.token;
          setToken(token);

          // 跳转到后台首页
          router.push("/admin/index");
        } else {
          // 获取服务端返回的错误消息
          let message = res.message;
          // 提示消息
          showMessage(message, "error");
        }
      })
      .finally(() => {
        // 结束加载
        loading.value = false;
      });
  });
};

// 按回车键后，执行登录事件
function onKeyUp(e) {
  console.log(e);
  if (e.key == "Enter") {
    onSubmit();
  }
}

// 添加键盘监听
onMounted(() => {
  console.log("添加键盘监听");
  document.addEventListener("keyup", onKeyUp);
});

// 移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>
