// RevenueCat Purchases SDK wrapper
// Only active when running inside Capacitor (native app)
// On web, purchase buttons link to the sales funnel instead

export const PRODUCT_IDS = {
  monthly: "buenas_noches_mensual",
  annual: "buenas_noches_anual",
};

export const ENTITLEMENT_ID = "Premium Buenas Noches";

function isNative() {
  return typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.();
}

async function loadSDK() {
  const { Purchases } = await import("@revenuecat/purchases-capacitor");
  return Purchases;
}

export async function getOfferings() {
  if (!isNative()) return null;
  const Purchases = await loadSDK();
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("getOfferings timed out after 15s")), 15000)
  );
  const offerings = await Promise.race([Purchases.getOfferings(), timeout]);
  return offerings.current;
}

export async function purchasePackage(pkg) {
  if (!isNative()) return null;
  const Purchases = await loadSDK();
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Purchase timed out after 15s")), 15000)
  );
  const result = await Promise.race([
    Purchases.purchasePackage({ aPackage: pkg }),
    timeout,
  ]);
  return result.customerInfo;
}

export async function restorePurchases() {
  if (!isNative()) return null;
  const Purchases = await loadSDK();
  const result = await Purchases.restorePurchases();
  return result.customerInfo;
}

export async function getCustomerInfo() {
  if (!isNative()) return null;
  try {
    const Purchases = await loadSDK();
    const result = await Purchases.getCustomerInfo();
    return result.customerInfo;
  } catch {
    return null;
  }
}

export function hasEntitlement(customerInfo) {
  if (!customerInfo) return false;
  const entitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
  return !!entitlement;
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)),
  ]);
}

export async function configureRevenueCat(userEmail) {
  if (!isNative()) return;
  const Purchases = await loadSDK();
  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY;
  if (!apiKey) throw new Error("Missing RevenueCat API key");
  await withTimeout(Purchases.configure({ apiKey }), 10000, "configure");
  if (userEmail) {
    await withTimeout(Purchases.logIn({ appUserID: userEmail }), 10000, "logIn");
  }
}
