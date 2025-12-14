# 🤠🤠vue-diverse-admin 🤠🤠

![banner](https://toscode.gitee.com/lin_zi_quan/vue-diverse-admin/raw/main/src/assets/md/30747d0cec5ee8bd5687c7cd8ba5c14.png)

### 介绍 📖

- vue-diverse-admin，基于 Vue3、Vite3、JavaScript、Element-Plus 开源的一套后台管理模板。Mock + JSON本地模拟动态路由权限。简洁精美的UI页面。

### 一、Git 仓库地址 (欢迎 Star⭐)

- Gitee：https://gitee.com/lin_zi_quan/vue-diverse-admin
- GitHub：https://github.com/1164095457/vue-diverse-admin（已弃用）

### 二、🔨🔨🔨 项目功能

- 🚀 采用 Vue3 + Vite3 作为项目开发、打包工具（配置了 Gzip 打包，跨域代理，打包预览工具……）
- 🚀 本地json + mock模拟真实的动态路由请求
- 🚀 支持权限按钮
- 🚀 使用 Pinia🍍 状态管理工具支持权限按钮
- 🚀 使用 keep-alive 对个页面进行缓存（缓存路由里可配置、页面切换带动画）
- 🚀 useTable、proTable让你减少el-table代码量，统一的风格代码更低耦合
- 🚀 常用自定义指令开发（复制、水印、拖拽、节流、防抖、鼠标右键）
- 🚀 常用组件开发 （全局消息、数字滚动..）
- 🚀 常用办公工具（打印、Excel导出导入、关系图）
- 🚀 多层菜单嵌套
- 🚀 echarts大屏适配模板
- 🚀 支持4种Layout布局，自定义主题颜色，黑夜模式，可配置面包屑、标签栏、页脚，锁屏，路由搜索
- 🚀 支持 i18n 国际化（目前仅在i18n多语言页面配置，需要增加可自行配置）

### 三、🌐🌐🌐 浏览地址

- [🚀 vue-diverse-admin 演示地址（国内地址）](https://lin_zi_quan.gitee.io/vue3-diverse-admin/#/)

### 四、安装使用步骤 📔

- **克隆：**

```text
# Gitee
git clone https://gitee.com/lin_zi_quan/vue-diverse-admin.git
```

- **安装依赖：**

```text
# 建议使用nodejs 16+
cnpm i
pnpm i
```

- **运行：**

```text
npm run dev
npm run serve
```

- **打包：**

```text
# 开发环境
npm run build:dev

# 测试环境
npm run build:test

# 生产环境
npm run build:pro
```

- **检测：**

```text
# eslint 检测代码
npm run lint:eslint

# prettier 格式化代码
npm run lint:prettier

# stylelint 格式化样式
lint:stylelint
```

### 五、项目截图 📷

![banner](https://gitee.com/lin_zi_quan/vue-diverse-admin/raw/main/src/assets/md/1742284694282.jpg)

![banner](https://gitee.com/lin_zi_quan/vue-diverse-admin/raw/main/src/assets/md/1742283630110.jpg)

### 六、文件资源目录 📚

```text
vue-diverse-admin
├─ .vscode                # vscode推荐配置
├─ public                 # 静态资源文件（忽略打包）
├─ src
│  ├─ api                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  ├─ config              # 全局配置项
│  ├─ directives          # 全局指令文件
│  ├─ hooks               # 常用 Hooks
│  ├─ languages           # 语言国际化
│  ├─ layouts             # 框架布局
│  ├─ mock                # mock数据
│  ├─ routers             # 路由管理
│  ├─ stores              # pinia 状态管理工具
│  ├─ styles              # 全局样式
│  ├─ utils               # 工具库
│  ├─ views               # 项目所有页面
│  ├─ App.vue             # 入口页面
│  └─ main.js             # 入口文件
├─ .editorconfig          # 编辑器配置（格式化）
├─ .env                   # vite 常用配置
├─ .env.development       # 开发环境配置
├─ .env.production        # 生产环境配置
├─ .env.test              # 测试环境配置
├─ .eslintignore          # 忽略 Eslint 校验
├─ .eslintrc.js           # Eslint 校验配置
├─ .gitignore             # git 提交忽略
├─ .prettierignore        # 忽略 prettier 格式化
├─ .prettierrc.js         # prettier 配置
├─ .stylelintignore       # 忽略 stylelint 格式化
├─ .stylelintrc.js        # stylelint 样式格式化配置
├─ CHANGELOG.md           # 项目更新日志
├─ commitlint.config.js   # git 提交规范配置
├─ index.html             # 入口 html
├─ lint-staged.config     # lint-staged 配置文件
├─ package-lock.json      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ postcss.config.js      # postcss 配置
├─ README.md              # README 介绍
├─ tsconfig.json          # typescript 全局配置
└─ vite.config.ts         # vite 配置
```

### 作者

- 感谢第三方开源库的支撑，使用过程中碰到问题也可以找作者！！
  ![banner](https://gitee.com/lin_zi_quan/vue-diverse-admin/raw/main/src/assets/md/1675495963149.png)
-

### 最后

- 如果项目帮助到您，也可以请作者喝杯可乐~
  ![banner](https://gitee.com/lin_zi_quan/vue-diverse-admin/raw/main/src/assets/md/1742984167190.jpg)
