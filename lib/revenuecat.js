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
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function purchasePackage(pkg) {
  if (!isNative()) return null;
  const Purchases = await loadSDK();
  const result = await Purchases.purchasePackage({ aPackage: pkg });
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

export async function configureRevenueCat(userEmail) {
  if (!isNative()) return;
  try {
    const Purchases = await loadSDK();
    const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_IOS_KEY;
    if (!apiKey) return;
    await Purchases.configure({ apiKey });
    if (userEmail) {
      await Purchases.logIn({ appUserID: userEmail });
    }
  } catch (e) {
    console.error("RevenueCat configure error", e);
  }
}
