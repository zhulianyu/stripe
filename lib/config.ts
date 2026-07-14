/**
 * 服务端配置,仅可在 API Route / Server Component 中使用。
 * 客户端组件请勿 import 此文件(会暴露密钥并因缺少服务端变量而报错)。
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `缺少环境变量 ${key},请参考 .env.example 进行配置。`
    );
  }
  return value.trim();
}

/**
 * 服务端配置。使用 getter 延迟读取环境变量:
 * 构建阶段(环境变量尚未注入)不会触发校验,避免中断构建;
 * 运行时首次访问即校验,缺失时抛出清晰错误。
 */
export const serverConfig = {
  get stripeSecretKey() {
    return requireEnv("STRIPE_SECRET_KEY");
  },
  get stripeWebhookSecret() {
    return requireEnv("STRIPE_WEBHOOK_SECRET");
  },
  /** 站点基础 URL,用于拼接支付成功/取消回调地址 */
  get baseUrl() {
    return requireEnv("BASE_URL");
  },
};
