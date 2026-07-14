# Stripe 收款页面

基于 Stripe 的在线收款页面,支持 **支付宝、微信支付、信用卡**,资金通过 Stripe 结算至 **Mercury** 银行账户,部署到 **Cloudflare Workers** 并绑定自定义域名 `pay.sinosoft.online`。

## 功能特性

- 💳 三种支付方式:支付宝 / 微信支付 / 信用卡(含真实品牌图标)
- 💲 固定档位($20 / $100 / $200)+ 自定义金额
- 🟢 微信亮绿主色调(#07C160)
- 🌍 USD 收款,Stripe 自动处理人民币 -> 美元转换
- 🔒 Stripe Checkout 托管支付页,安全合规
- ☁️ Cloudflare Workers 部署,GitHub Actions 自动发布,绑定 `pay.sinosoft.online`
- 🏦 收款自动结算至 Mercury 账户

## 技术栈

- Next.js 15(App Router)+ React 19 + TypeScript
- Stripe Checkout
- Tailwind CSS
- Zod(请求校验)
- `@opennextjs/cloudflare`(Next.js -> Cloudflare Workers 适配器)
- GitHub Actions(自动构建部署)

## 部署到 Cloudflare Workers

> ⚠️ **Windows 用户**:`@opennextjs/cloudflare` 本地构建不支持 Windows 原生。推荐用**方式一(GitHub Actions)**或**方式二(Git 集成)**,两者都在 Linux 环境构建,无需本地构建。

### 前置条件

- Cloudflare 账户,`sinosoft.online` 已托管在 Cloudflare(✓)
- Stripe 账户(海外,支持微信支付;中国大陆 Stripe 账户不支持微信支付)
- GitHub 仓库

### 方式一:GitHub Actions 自动部署(推荐)

用 `CLOUDFLARE_API_TOKEN` 认证,推送到 GitHub 自动构建部署(Ubuntu runner,规避 Windows 限制)。

1. **推本项目到 GitHub**
2. **创建 Cloudflare API Token**:Cloudflare Dashboard -> My Profile -> API Tokens -> Create Token -> 选 "Edit Cloudflare Workers" 模板,确保包含 `sinosoft.online` 的 Zone 权限(用于自动绑定自定义域名)
3. **在 GitHub 仓库添加 Secrets**(Settings -> Secrets and variables -> Actions -> New repository secret):
   - `CLOUDFLARE_API_TOKEN` — 上一步创建的 token
   - `CLOUDFLARE_ACCOUNT_ID` — 在 Cloudflare Dashboard 右下角或任意 Worker 页面右侧查看
4. **推送到 `main` 分支**,`.github/workflows/deploy.yml` 自动触发:安装依赖 -> OpenNext 构建 -> `wrangler deploy`
5. **设置 Stripe 密钥**(见下文,首次部署创建 Worker 后在 Dashboard 设置)

> `wrangler.jsonc` 已配置 `routes` 指向 `pay.sinosoft.online`,部署时自动绑定域名并签发 SSL。

### 方式二:Cloudflare Workers Git 集成

1. 推本项目到 GitHub
2. Cloudflare Dashboard -> **Workers & Pages** -> **Create** -> **Connect to Git** -> 选仓库
3. 构建配置:
   - **Build command**:`npx opennextjs-cloudflare build`
   - **Deploy command**:`npx wrangler deploy`
4. 在 **Settings -> Variables and Secrets** 添加环境变量
5. **Save and Deploy**

### 方式三:CLI 部署(需 Linux / macOS / WSL)

```bash
# 设置 token(替代 wrangler login,适合 CI/脚本)
export CLOUDFLARE_API_TOKEN=你的token

# 构建并部署
npm run deploy

# 设置敏感密钥(交互式,每个执行一次,持久保存在 Worker)
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

> Windows 用户请在 WSL 中执行(`wsl` 进入后操作)。

### 绑定自定义域名

`wrangler.jsonc` 已声明 `pay.sinosoft.online` 的 custom domain route,部署时自动绑定。若自动绑定未生效,手动:Worker -> **Settings -> Domains & Routes -> Add -> Custom Domain** -> 输入 `pay.sinosoft.online`。

## 环境变量

### Cloudflare Worker 运行时变量

| 变量名 | 类型 | 设置方式 | 说明 | 示例 |
|--------|------|----------|------|------|
| `STRIPE_SECRET_KEY` | Secret | Dashboard 或 `wrangler secret put` | Stripe 密钥 | `sk_live_xxx` |
| `STRIPE_WEBHOOK_SECRET` | Secret | Dashboard 或 `wrangler secret put` | Webhook 签名密钥 | `whsec_xxx` |
| `BASE_URL` | Text | `wrangler.jsonc` vars(已配置) | 站点域名 | `https://pay.sinosoft.online` |

> 首次部署(方式一/二)创建 Worker 后,到 Cloudflare Dashboard -> Worker -> **Settings -> Variables and Secrets** 设置上表前 2 个变量。`BASE_URL` 已写在 `wrangler.jsonc`,随部署自动生效。
>
> `BASE_URL` 用非 `NEXT_PUBLIC_` 前缀,确保运行时读取(不被 build 时内联)。

### GitHub Actions Secrets(仅方式一)

| Secret 名 | 说明 |
|-----------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token(Edit Workers 权限) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID |

> Stripe 密钥**不**放 GitHub Secrets,而是直接在 Cloudflare Worker 设置(加密存储,更安全)。

## Stripe 后台配置

### 1. 获取 API 密钥

Stripe Dashboard -> Developers -> API keys:

- `Secret key` -> `STRIPE_SECRET_KEY`

### 2. 启用支付方式

Stripe Dashboard -> Settings -> Payment methods:

- ✅ **Alipay**(支付宝)
- ✅ **WeChat Pay**(微信支付)
- ✅ Cards(信用卡,默认已启用)

> ⚠️ 微信支付需 Stripe 账户在支持地区(美/港/新/欧盟/英/加/澳/日等),中国大陆账户不支持。支付宝全球大多数地区可用。

### 3. 配置 Webhook

Stripe Dashboard -> Developers -> Webhooks -> Add endpoint:

- **Endpoint URL**:`https://pay.sinosoft.online/api/webhook`
- **Events to send**:`checkout.session.completed`
- 复制 **Signing secret**(`whsec_...`)-> 设为 `STRIPE_WEBHOOK_SECRET`

## Mercury 收款配置

Mercury 是美元商业银行账户,通过 Stripe Payouts 自动结算。

### 1. 获取 Mercury 账户信息

[Mercury Dashboard](https://app.mercury.com) -> 选择账户 -> **Account Details**:

- 记录 **Routing Number**(9 位)
- 记录 **Account Number**

### 2. 在 Stripe 绑定 Mercury 账户

Stripe Dashboard -> Settings -> Payouts -> Bank accounts -> **Add bank account**:

- 填入 Mercury 的 Routing Number 和 Account Number
- Stripe 存入两笔小额测试款(1–2 个工作日)
- 回到 Stripe 后台输入两笔金额完成验证

### 3. 设置结算节奏

Stripe Dashboard -> Settings -> Payouts:

- **Daily / Weekly / Monthly**:自动按周期结算到 Mercury
- **Manual**:手动发起结算

资金流:

```
用户付款(支付宝 / 微信 / 信用卡)
        ↓
   Stripe 余额(扣除手续费)
        ↓
   自动 payout 到 Mercury 账户
```

## 本地开发

```bash
# 1. 安装依赖(国内网络用镜像)
npm install --registry=https://registry.npmmirror.com

# 2. 配置 next dev 环境变量
cp .env.example .env.local
# 编辑 .env.local 填入测试密钥

# 3. 启动开发服务器
npm run dev
# 打开 http://localhost:3000

# 4.(可选)本地预览 Cloudflare 运行时(需 Linux/WSL)
cp .dev.vars.example .dev.vars
npm run preview

# 5.(可选)监听 webhook
stripe listen --forward-to localhost:3000/api/webhook
```

## 项目结构

```
app/                              # Next.js App Router
├── page.tsx                      # 收款主页
├── success/page.tsx              # 支付成功页
├── canceled/page.tsx             # 支付取消页
└── api/
    ├── create-checkout-session/  # 创建 Stripe Checkout Session
    └── webhook/                  # Stripe Webhook 处理
components/                       # 前端组件(含支付宝/微信/信用卡图标)
lib/                              # 配置与工具
.github/workflows/deploy.yml      # GitHub Actions 自动部署
open-next.config.ts               # OpenNext Cloudflare 适配配置
wrangler.jsonc                    # Cloudflare Worker 配置(含自定义域名)
```

## 自定义

- **金额档位**:编辑 `lib/pricing.ts` 的 `priceTiers`
- **支付方式**:编辑 `lib/payment.ts` 的 `paymentMethods`
- **页面文案 / 样式**:编辑 `app/page.tsx`
- **域名**:编辑 `wrangler.jsonc` 的 `routes` 和 `vars.BASE_URL`
- **部署触发分支**:编辑 `.github/workflows/deploy.yml` 的 `on.push.branches`

## 注意事项

- 测试环境用 `sk_test_` 密钥;上线前切换为 `sk_live_`
- 微信支付在 Checkout 页面以二维码形式展示(已配置 `client: "web"`)
- 支付宝会跳转支付宝 App 或网页完成付款
- OpenNext 本地构建不支持 Windows 原生,请用 GitHub Actions(方式一)或 WSL
- Stripe 手续费:美国账户约 2.9% + $0.30/笔(跨境可能加收 1%)

## License

MIT
