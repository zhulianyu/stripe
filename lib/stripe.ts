import Stripe from "stripe";
import { serverConfig } from "./config";

/**
 * Stripe 客户端单例。
 * 复用同一实例,避免在热更新或多次调用时重复创建。
 */
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) {
    return stripeInstance;
  }

  stripeInstance = new Stripe(serverConfig.stripeSecretKey, {
    typescript: true,
    appInfo: { name: "stripe-payment", version: "1.0.0" },
  });

  return stripeInstance;
}
