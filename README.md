# qiankun 微前端 Demo 学习笔记

本仓库用于学习 [qiankun](https://qiankun.umijs.org/)（基于 single-spa 的微前端框架）。下面说明一个**最小可运行 demo** 通常需要实现哪些部分，以及如何组织项目。

## 本仓库技术方案（已定稿）

以下为当前约定的架构与实施要点，**暂不生成代码**，后续实现按此执行即可。

**技术栈速查（与下文「技术选型」表一致）**

- **主应用**：Vue2 + Webpack（Vue CLI）。  
- **子应用（3 个，首版必做）**：**1 个** Vue2 + Webpack；**2 个** Vite + Vue3（`vite-plugin-qiankun`）。  
- **扩展（可选）**：Vite + React（`vite-plugin-qiankun`），见 **「扩展：React 子应用」** 与注册示例中的注释。

### UI 组件库（Element）

- **Vue2**（主应用、`sub-vue2`）：使用 **Element UI**（`element-ui`），已在基座顶栏与子应用首页做最小示例（`el-menu` / `el-button` / `el-dialog` 等）。
- **Vue3**（`sub-vue3-a` / `sub-vue3-b`）：使用 **Element Plus**（`element-plus`），与 Vue3 配套；**不要**在 Vue3 里装 `element-ui`。
- 各应用**各自安装、各自打包**即可；若担心全局样式互相影响，可结合 qiankun 的样式隔离选项或按需引入（`babel-plugin-component` / Element Plus  Resolver）减体积。

### 技术选型（硬性约定）

| 角色 | 技术栈 | 构建工具（建议） | 说明 |
|------|--------|------------------|------|
| 主应用 | Vue 2 + Vue Router | **Vue CLI（Webpack）** | 基座：仅顶栏布局、`registerMicroApps` / `start`、`#subapp-viewport`；与 qiankun 官方 Vue2 示例一致 |
| 子应用 ① | Vue 2 + Vue Router | **Vue CLI（Webpack）** | UMD 导出生命周期；与主应用同构，联调最直观 |
| 子应用 ② | Vue 3 + Vue Router | **Vite + `vite-plugin-qiankun`（子应用）** | 与 ③ 同为 Vite + Vue3，便于练习多子应用与共享依赖 |
| 子应用 ③ | Vue 3 + Vue Router | **Vite + `vite-plugin-qiankun`（子应用）** | 同上 |
| **（扩展，非首版必建）** | React + React Router | **Vite + `vite-plugin-qiankun`（子应用）** | 需要时再加目录与注册项，验证与 Vue2 基座共存 |

### 目录结构（单仓：主应用 + 3 个子应用）

```text
qiankuan-demo/
├── main/              # 主应用：Vue2 + Webpack（Vue CLI）
├── sub-vue2/          # 子应用 ①：Vue2 + Webpack
├── sub-vue3-a/        # 子应用 ②：Vue3 + Vite
├── sub-vue3-b/        # 子应用 ③：Vue3 + Vite
├── package.json       # （可选）pnpm workspace 根，统一脚本
└── README.md

# 扩展（可选）
# └── sub-react/       # Vite + React + vite-plugin-qiankun
```

### 路由与激活规则

- 主应用使用 **history 模式**（Webpack：`devServer.historyApiFallback`）。
- 子应用挂载页：在主应用**仅顶栏**的前提下，于**顶栏下方、占满剩余视口**的区域渲染**固定容器** `#subapp-viewport`（名称可改，但与 `container` 一致即可）；与整体栅格的关系见下节 **「布局与职责划分」**。
- **`activeRule` 与浏览器 URL 前缀一致**（推荐子应用独占前缀，避免互相抢激活）：

| 子应用 | `name`（示例） | `activeRule`（示例） | 说明 |
|--------|----------------|----------------------|------|
| ① Vue2 Webpack | `sub-vue2` | `/app/vue2` | 访问 `/app/vue2/**` 时激活 |
| ② Vue3 Vite | `sub-vue3-a` | `/app/vue3-a` | 访问 `/app/vue3-a/**` 时激活 |
| ③ Vue3 Vite | `sub-vue3-b` | `/app/vue3-b` | 访问 `/app/vue3-b/**` 时激活 |
| 扩展 React | `sub-react` | `/app/react` | 扩展阶段再接入 |

子应用内部路由的 **base** 与主应用里该子应用路由前缀对齐（Vue Router 的 `base`，React Router 的 `basename`），避免刷新 404 或资源路径错乱。

### 布局与职责划分（壳层与子应用）

主应用只做**极薄壳**：**仅顶部导航**；**不提供主应用级左侧菜单**。顶栏以下整块区域交给 qiankun，由**子应用**自行实现「左侧菜单 + 右侧主内容区」。

**主应用（基座）**

- **顶部导航**：可放 Logo、用户信息、以及**进入各业务模块 / 各子应用的入口**（链接或 `router.push`）。切换「模块」时，通常对应跳转到不同 **`activeRule` 前缀**（从而加载不同子应用），或进入同一子应用下的不同初始路径——**不在主应用里画左侧菜单**。
- **子应用区域**：紧挨在**顶栏下方**，在水平方向上占满视口宽度，在垂直方向上占满**视口高度减去顶栏高度**。qiankun 的 **`container`（如 `#subapp-viewport`）铺满这一块**；切换子应用时，只替换该挂载节点内的 DOM，顶栏始终保留在主应用。

**子应用（微应用）**

- 在 `#subapp-viewport` 内实现完整「工作台」布局：**左侧菜单** + **右侧主内容区**（列表、表单、详情等子路由页面渲染在内容区）。
- 若产品上需要「不同顶部模块对应不同左侧菜单」：由**各子应用**在自身路由与菜单配置中体现（例如不同子应用各自一套侧栏；或同一子应用内根据路由分支切换侧栏数据）；主应用只负责通过顶栏把 URL 导航到正确前缀。
- 子应用路由与侧栏联动、布局高度（`flex:1`、`min-height:0` 等）均由子应用实现；主应用为 `#subapp-viewport` 提供稳定高度与宽度即可。

**示意（逻辑结构，非像素级）**

```text
┌─────────────────────────────────────────────────────────────┐
│  主应用 · 仅顶部导航（模块入口 / 跳转至各子应用前缀）           │
├─────────────────────────────────────────────────────────────┤
│  #subapp-viewport（顶栏以下全宽、全高，qiankun 挂载节点）       │
│  ┌────────────┬─────────────────────────────────────────┐   │
│  │ 子应用 ·    │ 子应用 · 主内容区                         │   │
│  │ 左侧菜单    │                                          │   │
│  └────────────┴─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**与 qiankun 的衔接要点**

- 主应用布局组件：顶栏 + 其下**唯一**的 `#subapp-viewport`；凡会激活子应用的路由都应渲染该结构，避免子应用已启动却找不到容器。
- 顶栏触发切换子应用时：使用主应用路由 `router.push` 到目标 **`activeRule` 前缀**（如 `/app/vue2/...`），由 qiankun 挂载对应子应用；子应用再在自身侧栏与内容区完成二级导航。
- 需要更强样式隔离时，再考虑 `experimentalStyleIsolation` 等（见进阶章节）。

### 本地端口（约定）

| 应用 | 端口（约定） | `entry`（开发环境） |
|------|--------------|---------------------|
| 主应用（Vue2） | `8080` | — |
| 子应用 ① Vue2 | `8081` | `//localhost:8081` |
| 子应用 ② Vue3 A | `8082` | `//localhost:8082` |
| 子应用 ③ Vue3 B | `8083` | `//localhost:8083` |
| 扩展 React | `8084` | `//localhost:8084`（启用扩展时） |

端口若冲突可在实现时微调，但需同步改主应用注册表与文档。

### 主应用（Vue2 + Webpack）要点

- 依赖：`qiankun`；入口一般为 `main.js`。
- 在 Vue 根实例挂载后（或与路由配合的合适时机）调用 `registerMicroApps` + `start`，保证带 `#subapp-viewport` 的布局已就绪。
- `devServer`：`historyApiFallback`、按需配置代理或 CORS。
- `props` 可传入 `routerBase` 等，便于子应用设置 `base` / `basename`。
- 首版建议开启 `sandbox: true`；若遇兼容问题再针对性关闭或换隔离策略。

### Vue2 子应用（Webpack，子应用 ①）要点

与主应用同属 Vue2 + Webpack，配置思路一致：

- **UMD** 暴露入口，`export`：`bootstrap` / `mount` / `unmount`。
- **publicPath**：`__webpack_public_path__` 等，保证挂在 `/app/vue2` 等前缀下资源可加载。
- **devServer**：对基座 origin 放行跨域（demo 可宽松，生产再收紧）。
- **`window.__POWERED_BY_QIANKUN__`**：区分独立运行与在基座内挂载。

### Vue3 子应用（Vite，子应用 ②③）要点

- **`vite-plugin-qiankun`** 子应用模式，导出生命周期；Vue3 使用 `createApp`。
- **`import.meta.env.BASE_URL`** / 插件配置与主应用 `activeRule` 前缀一致。
- **`server.cors`**：保证基座能拉取子应用入口与静态资源。
- 独立运行与 qiankun 内运行分支与插件官方示例对齐。

### 扩展：React 子应用（Vite）

- 需要时再增加 `sub-react/` 与 `registerMicroApps` 中一项。
- `vite-plugin-qiankun` 子应用模式 + React 18 `createRoot`；`basename` 与 `/app/react` 对齐；端口建议 `8084`。

### 通信与进阶（首版范围）

- **首版**：以跑通加载卸载为主；可选在 `props` 里传一个简单的回调或只读配置，不做复杂全局 store。
- **后续迭代**：`initGlobalState`、样式隔离选项、预加载、生产部署路径与 Nginx 转发规则、**共享依赖策略**（见下节）。

### 共享依赖与包体积（进阶，建议纳入规划）

qiankun 本身**不解决**「多个子应用重复打包同一依赖」的问题；进阶阶段若不考虑，容易出现 **vendor 重复、版本不一致、首屏加载体积膨胀**。结合本仓库选型，需要先分清两类情况：

| 类型 | 在本仓库中的现实 | 常见做法 |
|------|------------------|----------|
| **框架运行时** | 基座与子应用 ① 为 **Vue2**；子应用 ②③ 为 **Vue3**；扩展为 **React**。**Vue2 与 Vue3 不能共用同一份 `vue` 包**；两枚 Vue3 子应用之间**可以**规划共享 Vue3 / Router（同大版本） | Vue2 线、Vue3 线各自打包最省事；进阶优先讨论「两枚 Vue3」+ 工具库 |
| **工具库 / 业务公共包** | 主 + 3 子（扩展再加一条构建线）易重复打包、版本漂移 | `externals`、版本锁、或联邦（多 Webpack 时更顺） |

#### 两个 Vue3 子应用（本仓库已定）

本仓库已包含 **`sub-vue3-a` / `sub-vue3-b`**，进阶可对 **`vue` / `vue-router`（同大版本）** 做共享或严格锁版本；手段见下文 **externals**、**联邦**（若 Vue3 子应用迁 Webpack）、**import map** 等；Vite 侧需查 `external` 与插件说明。**主应用与子应用 ①（Vue2）** 不要与 Vue3 子应用共享 `vue` 运行时。

#### 扩展 React 后

仍为 **混搭运行时**，框架级不追求「一份包打天下」；共享依赖讨论落在 **工具库** 与 **两枚 Vue3 之间**更合适。

可选策略（由易到难，可按学习阶段递进）：

1. **不共享（首版可默认）**  
   每个应用完整打包自己的依赖。实现成本最低，适合先把 qiankun 链路跑通；代价是体积与缓存效率一般。

2. **`externals` + 全局 UMD（经典方案）**  
   在主应用入口 HTML 或主应用逻辑里先加载公共库的 UMD；子应用构建配置 `externals`，从 `window` 上取全局变量。  
   **注意**：要固定版本、约定全局名、保证加载顺序；与 Vite 子应用混用时配置方式与 Webpack 不完全相同，需要分别查文档。

3. **Webpack Module Federation（联邦）**  
   **主应用与子应用 ①** 均为 Webpack 时，若要在二者之间共享 chunk，联邦或 `externals` 比「Webpack 与 Vite Vue3」之间更容易落地；两枚 **Vite Vue3** 子应用若改 Webpack 才更自然进入典型联邦场景。

4. **`import map` / ESM CDN 等**  
   更偏体系化与浏览器能力，与 qiankun 常见入口组合时需单独设计，进阶调研即可。

**结论**：进阶**应当**把「共享依赖」纳入方案；首版可 **各应用独立打包**。进阶时优先为 **两枚 Vue3 子应用** 建 **版本矩阵 + 共享清单**；**Vue2 线（主 + 子①）** 与 **Vue3 线** 分开考虑；**扩展 React** 只做工具库级或独立运行时。

### 实现顺序建议

1. **主应用（Vue2 Webpack）** + **子应用 ①（Vue2 Webpack）** 跑通最小闭环。  
2. 依次接入 **子应用 ②、③（Vite + Vue3）**。  
3. 再补通信、部署脚本（如根目录 `dev:all`）、共享依赖实验（优先两枚 Vue3）。  
4. **扩展**：增加 **Vite + React** 子应用与注册项。

---

## 你需要实现什么

### 1. 主应用（基座 / Main App）

主应用负责**注册、加载、卸载**子应用，并提供公共能力（路由、布局、登录态等）。

| 能力 | 说明 |
|------|------|
| 安装依赖 | `qiankun` |
| 注册子应用 | 使用 `registerMicroApps` 配置子应用入口、路由激活规则、容器 DOM 等 |
| 启动框架 | 调用 `start()`，可选配置 `sandbox`、`prefetch` 等 |
| 路由与容器 | 为子应用预留挂载节点（本仓库约定 `#subapp-viewport`），路由与 `activeRule` 对应 |
| （可选）全局状态 | `initGlobalState` 做主子应用通信 |

### 2. 子应用（微应用 / Micro App）

每个子应用仍是独立仓库或独立目录下的完整前端工程，但需要满足 qiankun 的**接入约定**。

| 能力 | 说明 |
|------|------|
| 打包 / 入口形态 | Webpack 子应用：`output.library` + `output.libraryTarget: 'umd'` 等；Vite Vue3 / React：`vite-plugin-qiankun` 子应用模式导出生命周期 |
| 运行时 publicPath | 使用 `webpack` 的 `__webpack_public_path__` 或 Vite 的 `import.meta.env.BASE_URL`，保证资源在非根路径下能正确加载 |
| 导出生命周期 | 在入口文件中 `export`：`bootstrap`、`mount`、`unmount`；（可选）`update` |
| 独立运行 | 通过 `window.__POWERED_BY_QIANKUN__` 判断是否在基座内；Vue3 用 `createApp().mount()`，Vue2 用 `new Vue({ ... }).$mount()` |

### 3. 本地联调（开发环境）

| 点 | 说明 |
|----|------|
| 端口 | 主应用与各子应用不同端口（如 `8080`～`8083`，扩展 React `8084`） |
| CORS | 子应用 devServer 需允许主应用 origin 跨域（`headers`、`allowedHosts` 等按构建工具配置） |
| entry | 主应用里子应用的 `entry` 在开发环境指向子应用入口 HTML 的完整 URL（如 `//localhost:8081`） |

### 4. （进阶）可再练习的内容

- 子应用间、主子应用间通信（`props`、`initGlobalState`、自定义事件）
- 样式隔离：`experimentalStyleIsolation` 或 `strictStyleIsolation`
- 预加载：`prefetch`
- 与主应用路由库（Vue Router / React Router）的 basename、`activeRule` 对齐
- 生产环境部署路径与 CDN publicPath
- **共享依赖与体积**：默认各应用独立打包；进阶再对工具库/内部包尝试 `externals` + 全局、或 Module Federation（多 Webpack 时更自然）；见上文 **「共享依赖与包体积（进阶，建议纳入规划）」**

## 主应用注册示例（概念代码）

与已定方案对应的注册形态如下（容器选择器与主应用路由页一致即可）：

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'sub-vue2',
    entry: '//localhost:8081',
    container: '#subapp-viewport',
    activeRule: '/app/vue2',
  },
  {
    name: 'sub-vue3-a',
    entry: '//localhost:8082',
    container: '#subapp-viewport',
    activeRule: '/app/vue3-a',
  },
  {
    name: 'sub-vue3-b',
    entry: '//localhost:8083',
    container: '#subapp-viewport',
    activeRule: '/app/vue3-b',
  },
  // 扩展：Vite + React
  // {
  //   name: 'sub-react',
  //   entry: '//localhost:8084',
  //   container: '#subapp-viewport',
  //   activeRule: '/app/react',
  // },
]);

start({ sandbox: true });
```

子应用需在 `activeRule` 匹配时，主应用当前路由页上已存在 `#subapp-viewport`，否则子应用无法挂载。

## 学习顺序建议

1. **Vue2 主应用 + Vue2 子应用 ①** 联调跑通。  
2. 接入 **两枚 Vite + Vue3** 子应用 ②③。  
3. 再补 **通信、样式隔离、部署、共享依赖**（优先两枚 Vue3）。  
4. 按需做 **Vite + React** 扩展项。

## 文档覆盖范围说明

本 README 对 **「在本仓库里把 qiankun demo 按已定栈跑起来」** 写得比较完整：技术选型、目录、路由与 `activeRule`、布局、端口、各栈接入要点、共享依赖思路、注册示例与学习顺序。

**有意未展开或仅点到为止**（真实巨石改造里往往要单独开设计/迁移文档）包括但不限于：

- **鉴权与登录态**：Cookie `Domain` / `SameSite`、Token 刷新、子应用是否信任主应用注入的 `props`、登出广播、路由守卫与无权限页。
- **网关与部署**：Nginx / 网关如何把前缀转发到不同静态资源或服务、**子应用独立域名 vs 同域路径**、`publicPath` 与 CDN、灰度与回滚策略。
- **从巨石拆出**：按业务域划分子应用边界、**URL 与菜单迁移对照表**、存量 deep link、书签与对外链接兼容、并行运行期（巨石与子应用双轨）。
- **老系统迁入**：全局变量与 `window.xxx` 冲突、jQuery 插件、非模块化脚本、**沙箱关闭与否**的取舍、第三方统计/地图/SDK 重复初始化。
- **横切能力**：统一错误上报与 **Source Map** 归属、埋点 PV/UV 口径、性能指标（子应用 FCP/LCP）、**子应用独立发布**后的版本兼容约定。
- **工程与协作**：多仓库 vs 单仓、子应用 **CI/CD**、依赖版本治理、设计规范与组件库在异构栈之间的落地。

若你工作中是 **「一部分老系统迁入 + 一部分新建」**，本仓库对应关系可粗略理解为：**子应用 ① 像老系统迁入路径**（Webpack / Vue2 / UMD 改造），**②③ 像新建模块**（Vite / Vue3）；扩展 React 对应异构新栈。

## 改造进阶：大白话说明 + 自查清单（零基础向）

下面把之前提到、但术语较多的几件事拆开讲：**是什么 → 为什么要管 → 你可以照着勾什么**。不要求一次全懂，可以边做 demo 边回来看。

---

### 1. 「迁入线」：清理、`unmount`、沙箱 — 分别是什么

**背景**：老系统往往写了好几年，习惯「整个页面都是我的」，会在**全局**上挂东西（`window.xxx`、监听 `resize`、定时器、埋点只初始化一次等）。放进 qiankun 后，页面只是一块**容器里的子应用**，切走时还会再进来，所以老代码要特别处理。

| 词 | 大白话 |
|----|--------|
| **清理** | 子应用被切走时，把自己在「浏览器全局」里动过的手脚收回去，避免影响下一家子应用或下次再进来时出现双倍监听、内存涨、奇怪报错。 |
| **`unmount`** | qiankun 规定的「卸载钩子」：用户从子应用 A 切到 B 时，框架会调 A 的 `unmount`。你应该在这里做清理（见下 checklist）。 |
| **沙箱（sandbox）** | qiankun 用 JS 方式尽量**隔离**子应用对 `window` / `document` 的修改，减轻互相污染。有些很老的库不兼容严格沙箱，就要关掉或换方案，这是「取舍」不是失败。 |

**迁入线自查清单（老系统 / 子应用 ① 一类）**

- [ ] 在 **`unmount`** 里：去掉在 **`mount` 里注册的** 全局事件监听（`window.addEventListener` 等）。
- [ ] 在 **`unmount`** 里：清掉 **`mount` 里开的** 定时器（`setInterval` / `setTimeout` 要保存 id 再 clear）。
- [ ] 在 **`unmount`** 里：若曾把组件/实例挂到 `window` 上，这里删除或置空。
- [ ] 检查是否在 **`mount` 被多次调用** 时重复注册监听（应防重或统一在 `unmount` 成对释放）。
- [ ] 若开启 **`sandbox: true`** 后出现白屏、第三方脚本报错：记录报错库名 → 查是否需 **关闭沙箱** 或换 **样式隔离** 策略（官方文档有选项说明）。
- [ ] 全屏弹层、挂到 **`document.body`** 的节点：切子应用时是否会残留遮罩；必要时在 `unmount` 里移除。

---

### 2. 「新建线」：和基座的约定 — `props`、主题、埋点

**背景**：新建子应用（如本仓库 Vue3 子应用）通常更「干净」，但**不能各写各的**：用户眼里是**一个产品**，顶栏在基座，下面进子应用，登录态、皮肤、统计口径要一致。

| 词 | 大白话 |
|----|--------|
| **`props`（qiankun 里）** | 主应用在 `registerMicroApps` 里给某个子应用传的**只读或方法对象**：例如「当前语言」「当前主题名」「主应用提供的登出函数」。子应用在 `mount(props)` 里拿到，用来对齐行为。 |
| **主题** | 深色/浅色、品牌色。可以约定：主应用切主题时通过 **`props` 或全局事件** 告诉子应用，子应用根组件跟着换 class / CSS 变量。 |
| **埋点** | 统计「谁点了哪」。要约定：**只由主应用初始化 SDK**，子应用只调主应用注入的方法；或**各子应用自己上报**但事件名、公共字段（用户 id）格式一致，避免重复计 PV。 |

**新建线自查清单**

- [ ] 和团队写一张**小表**：基座通过 `props` 传哪些字段、子应用允许改哪些（避免子应用改坏基座状态）。
- [ ] **主题 / 语言**：切换后子应用是否**不刷新页**也能更新（靠 `props` 更新或事件）。
- [ ] **埋点**：谁初始化 SDK、路由切换时 PV 算在基座还是子应用、是否会造成**重复上报**。
- [ ] 子应用 **单独打开**（不经过基座）时：没有 `props` 时是否有**默认值**，仍能开发自测。

---

### 3. URL 与网关：为什么要「一次做对」

**背景**：微前端后，浏览器地址往往是 **`/某个前缀/子路由`**。浏览器会向服务器**要 HTML**；若服务器不知道这个前缀，会 **404**。这和纯 SPA 本地 `npm run dev` 不一样，**线上要靠网关 / Nginx 配置**把请求指到正确静态目录或服务。

| 词 | 大白话 |
|----|--------|
| **URL / 路由** | 用户地址栏里的路径；要和 **`activeRule`、子应用 `base`/`basename`** 对齐，否则子应用加载了但路由空白或刷新丢。 |
| **网关 / Nginx** | 请求进公司前的「大门」：例如 `/app/vue3-a/` 开头的请求，转发到 **Vue3 A 子应用的 `index.html` 和资源目录**；否则刷新页面直接 404。 |

**URL / 网关自查清单**

- [ ] 画一张表：**路径前缀**（如 `/app/vue3-a`）→ **哪台机器 / 哪个静态桶** → **子应用 `publicPath`** 是否一致。
- [ ] 在子应用部署路径下 **手动刷新** 深链接（带多级子路径），确认 **不 404**。
- [ ] 主应用与子应用的 **`history` 模式** 与服务器 fallback 是否都配了。
- [ ] 旧系统用过的 **老 URL**：是否需要 **301 重定向** 到新前缀（书签、对外文档）。

---

### 4. （延伸）鉴权：你在改什么（概念层）

**背景**：登录后浏览器里常有 **Cookie** 或 **Token（存在内存/localStorage）**。子应用和主应用**同源**时最简单；若不同源，Cookie 的域、跨域接口会多很多坑。学习阶段只要先建立概念：

- **登录态从哪来**：一般是用户登入后，基座拿到 Token，再通过 **`props` 传给子应用**，或子应用读 **同域 Cookie**。
- **子应用调接口**：是否带 **Authorization**、是否走基座代理避免 CORS，需要和后端、网关一起定。
- **登出**：基座登出时，子应用里内存中的 Token 是否也要清（可用 `props` 里回调或全局事件）。

**鉴权入门自查（先能问对问题即可）**

- [ ] 我们线上是 **同域路径** 还是 **子应用单独域名**？
- [ ] Token 存在哪、**刷新 Token** 谁负责？
- [ ] 子应用 **单独打开** 时用户是否也算「已登录」（如何拿态）？

---

### 5. 和上文「巨石常见问题」怎么配合用

- 本节：**逐个概念 + 清单**，适合「我不知道刚才那句话在说什么」时翻。  
- 下文 **「巨石应用做 qiankun 改造时常见问题」**：偏 **条目速览**，适合已经知道大方向后查漏。

## 巨石应用做 qiankun 改造时常见问题（工作向补充）

以下与 qiankun **机制**有关，但很多问题来自**拆分方式、运维与存量代码**，官方「快速上手」不会全部覆盖。

### 拆分与产品边界

- **域界不清**：哪些页归子应用、哪些仍留在基座；切完后出现「半屏基座半屏子应用」反复拉扯。
- **数据与权限模型**：按子应用切了 UI，后端仍是单体 API，权限注解/数据范围是否与新的前端边界一致。

### 路由与 URL

- **History 与服务器配置**：刷新 404、子路径部署、多环境 base 不一致。
- **主 / 子路由抢优先级**：`activeRule` 写得太宽导致多个子应用同时满足、或太窄导致子路由无法匹配。
- **从根路径迁移到前缀**：存量链接、二维码、邮件里的旧 URL 需要重定向或兼容层。

### 老系统迁入（你关心的「迁入」侧）

- **入口改造**：从单页 bundle 改为导出 `bootstrap` / `mount` / `unmount`，并处理 **二次进入 / 缓存实例**。
- **副作用未收敛**：在 `mount` 里重复注册全局监听、定时器、未在 `unmount` 清理导致泄漏。
- **样式与 DOM 假设**：依赖 `document.body`、全屏弹层挂在 body 上被沙箱或样式隔离影响。
- **构建产物**：老项目 publicPath、chunk 命名、运行时 publicPath 与线上子路径不一致导致白屏。

### 新建子应用侧

- **与基座约定**：`props` 协议、主题、语言、埋点 SDK 由谁初始化。
- **独立可运行**：开发、联调、CI 预览都要求能单独打开子应用，否则排障成本高。

### 运行时与体验

- **沙箱**：老库不兼容 strict sandbox 时需降级或 patch；`experimentalStyleIsolation` 与部分 CSS 选择器。
- **加载速度与白屏**：子应用 chunk 体积、预加载 `prefetch`、首屏骨架由基座还是子应用提供。
- **多实例与单例**：某些 SDK 只能初始化一次，却在主子应用各调一次。

### 发布与治理

- **子应用先发 / 基座先发**：契约破坏时的降级；`registerMicroApps` 的 `entry` 指向固定版本还是 `latest`。
- **跨团队排障**：问题出在路由、网关、子应用资源还是 qiankun 生命周期，需要统一排查清单。

以上议题不要求在本 demo 里一次做完；学习时可按需挑 1～2 项在 README 定稿之外做「专题练习」。

## 官方与参考文档

- [qiankun 官方文档](https://qiankun.umijs.org/zh/guide/getting-started)  
- [single-spa 概念](https://single-spa.js.org/)（有助于理解生命周期与路由）

## 脚手架与本地启动（已生成）

仓库根目录已包含四个子项目，与上文 **技术栈速查** 一致。

### 单仓（本 demo）和多仓（线上常见）——和 qiankun 的关系

- **qiankun 不规定**你必须「一个仓库」还是「多个仓库」。它只关心：基座里配置的 **`entry` 能访问到子应用的 HTML/JS**（开发时是 `//localhost:8081` 这类地址，线上则是各子应用部署后的 URL）。
- **本 demo 用单仓**：`main/`、`sub-vue2/` 等是**不同目录**，各自有自己的 `package.json`，彼此不是 npm 里的 `@main` 那种「作用域包名」；只是文件夹名叫 `main`，路径写成 `main/package.json`。
- **根目录的 `package.json`**：可选。里面只有 **`concurrently` + `dev:all`**，方便一条命令起四个进程；删掉它也不影响各子项目单独 `npm run serve` / `npm run dev`。**微前端不要求根目录一定有 package.json。**
- **多仓独立仓库**也完全合理：每个子应用自己的 Git、CI、发版地址；基座里把 `entry` 改成对应环境的 CDN/网关 URL 即可。学习阶段用单仓只是**克隆一份、改一处就能对照文档**，省事。

### Node 与 Volta（说明）

本仓库 **`package.json` 中不包含 Volta 字段**；本地跑通依赖的是你机器上已安装的 Node/npm（开发与构建曾在 **Node 22** 环境下验证，Vue CLI 4 可能对 Node 版本给出告警，一般仍可运行）。若团队使用 [Volta](https://volta.sh/)，可自行在各 `package.json` 增加 `volta` 块统一版本；拉取 Node 失败时可配置 `VOLTA_NODE_BASE_URL` 指向镜像（如 npmmirror 的 node 镜像）。

```bash
# 在仓库根目录安装并发工具（首次）
npm install

# 一次启动：主应用 + 三个子应用（推荐）
npm run dev:all
```

浏览器打开 **http://localhost:8080** ，用顶栏在三个子应用间切换。

也可分别开四个终端：

| 目录 | 命令 | 端口 |
|------|------|------|
| `main/` | `npm run serve` | 8080 |
| `sub-vue2/` | `npm run serve` | 8081 |
| `sub-vue3-a/` | `npm run dev` | 8082 |
| `sub-vue3-b/` | `npm run dev` | 8083 |

子应用也可单独访问上述端口做独立运行调试。

## 本仓库下一步

可按 **「实现顺序建议」** 阅读源码；需要扩展 **Vite + React** 时再加目录与主应用注册项即可。
