export const PRODUCT_IDS = {
  monthly: "buenas_noches_mensual",
  annual: "buenas_noches_anual",
};

export const ENTITLEMENT_ID = "Premium Buenas Noches";

function isNative() {
  return typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.();
}

// Access the native plugin directly via the Capacitor bridge.
// The PurchasesPlugin registers with jsName = "Purchases", so it's available
// at window.Capacitor.Plugins.Purchases without any npm module import.
function getPlugin() {
  return window?.Capacitor?.Plugins?.Purchases;
}

export function configureRevenueCat(userEmail) {
  if (!isNative()) return Promise.resolve();
  const plugin = getPlugin();
  if (!plugin) return Promise.reject(new Error("Purchases plugin not registered"));
  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY;
  if (!apiKey) return Promise.reject(new Error("Missing RevenueCat API key"));
  // configure is CAPPluginReturnNone — fire and forget, initializes synchronously on native side
  plugin.configure({ apiKey, appUserID: userEmail || undefined });
  return Promise.resolve();
}

export async function getOfferings() {
  if (!isNative()) return null;
  const plugin = getPlugin();
  if (!plugin) return null;
  const result = await plugin.getOfferings();
  return result?.current ?? null;
}

export async function purchasePackage(pkg) {
  if (!isNative()) return null;
  const plugin = getPlugin();
  if (!plugin) throw new Error("Purchases plugin not registered");
  const result = await plugin.purchasePackage({ aPackage: pkg });
  return result?.customerInfo ?? null;
}

export async function restorePurchases() {
  if (!isNative()) return null;
  const plugin = getPlugin();
  if (!plugin) return null;
  const result = await plugin.restorePurchases();
  return result?.customerInfo ?? null;
}

export async function getCustomerInfo() {
  if (!isNative()) return null;
  try {
    const plugin = getPlugin();
    if (!plugin) return null;
    const result = await plugin.getCustomerInfo();
    return result?.customerInfo ?? null;
  } catch {
    return null;
  }
}

export function hasEntitlement(customerInfo) {
  if (!customerInfo) return false;
  const entitlement = customerInfo.entitlements?.active?.[ENTITLEMENT_ID];
  return !!entitlement;
}
