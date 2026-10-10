# egern-modules

Egern 代理软件用的模块文件托管仓库。

## 📦 墨鱼去开屏·Egern 版

去除 App 开屏广告的规则模块，由 [墨鱼去开屏 V2.0](https://ddgksf2013.top/rewrite/StartUpAds.conf)（Quantumult X 版）转换而来。

- **原作者**：@ddgksf2013（[ddgksf2013.top](https://ddgksf2013.top)）
- **转换**：非官方，仅做格式适配，规则内容保持原样
- **模块地址**（在 Egern 里添加模块时填这个）：
  ```
  https://raw.githubusercontent.com/ikznbfin/egern-modules/main/StartUpAds.sgmodule
  ```

### 使用方法

1. 在 Egern 中添加模块，URL 填上面的模块地址，启用该模块
2. 开启 MITM，并安装、信任 Egern 的 CA 证书（模块自带了 400+ 个广告域名，按 `%APPEND%` 追加）
3. 部分 App（如银行类、抖音等）无法 MITM，对这些不生效，这是正常现象

### 文件说明

| 文件 | 说明 |
|------|------|
| `StartUpAds.sgmodule` | 模块主文件：454 条拦截规则（`[Rewrite]`）、25 个 App 专杀脚本引用（`[Script]`，指向原作者地址，保持更新）、6 条域名过滤（`[Rule]`）、MITM 主机名（`[MITM]`） |
| `scripts/moyu-rewrite.js` | 通用重写脚本，承接原版中 19 条复杂规则（响应体字符串替换、`jsonjq` 改写、伪造响应、请求体改写） |

### 转换对照

| Quantumult X | Egern / Surge |
|---|---|
| `url reject-200` / `reject` / `reject-img` / `reject-dict` | `- reject-200` / `- reject` / `- reject-img` / `- reject-dict` |
| `url script-response-body …/dict.js` | `- reject-dict`（等价，都是返回空 `{}`） |
| `url script-response-body <其他脚本>` | `[Script]` 引用原作者脚本地址 |
| `url response-body A response-body B` 等 | 由 `scripts/moyu-rewrite.js` 统一处理 |
| `host-suffix, x, reject` | `DOMAIN-SUFFIX,x,REJECT` |

### 更新

原作者更新规则后，重新抓取并覆盖本仓库对应文件即可，Egern 按模块的更新间隔自动拉取。

### 免责

本仓库仅做格式转换，不拥有规则内容版权；引用请注明原作者 @ddgksf2013。
