import { Platform } from "react-native";
import Purchases, {
	type CustomerInfo,
	PACKAGE_TYPE,
	type PurchasesError,
	type PurchasesOffering,
	type PurchasesPackage,
} from "react-native-purchases";
import RevenueCatUI, { type PAYWALL_RESULT } from "react-native-purchases-ui";
import {
	EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
	EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID,
	EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
} from "@/lib/env";

export const REVENUECAT_ENTITLEMENT_ID =
	EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID || "Just Write! Pro";

const FALLBACK_ENTITLEMENT_IDS = Array.from(
	new Set([REVENUECAT_ENTITLEMENT_ID, "Just Write! Pro", "MockMate! Pro"]),
);

const OFFERING_PACKAGE_PRIORITY = ["yearly", "monthly"] as const;

const PLAN_PACKAGE_IDENTIFIERS: Record<"yearly" | "monthly", string[]> = {
	yearly: ["yearly", "annual", "$rc_annual", "$rc_yearly"],
	monthly: ["monthly", "$rc_monthly"],
};

const PLAN_PACKAGE_TYPES: Record<"yearly" | "monthly", PACKAGE_TYPE> = {
	yearly: PACKAGE_TYPE.ANNUAL,
	monthly: PACKAGE_TYPE.MONTHLY,
};

const getRevenueCatApiKey = () => {
	if (Platform.OS === "ios") {
		return EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
	}

	if (Platform.OS === "android") {
		return EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
	}

	return undefined;
};

export const isRevenueCatSupportedPlatform =
	Platform.OS === "ios" || Platform.OS === "android";

export const configureRevenueCat = ({
	appUserID,
}: {
	appUserID?: string;
} = {}) => {
	if (!isRevenueCatSupportedPlatform) {
		console.log(`RevenueCat is not supported on ${Platform.OS}.`);
		return;
	}

	const apiKey = getRevenueCatApiKey();

	if (!apiKey) {
		console.warn(
			`RevenueCat API key is missing for ${Platform.OS}. Set EXPO_PUBLIC_REVENUECAT_${Platform.OS.toUpperCase()}_API_KEY in .env.`,
		);
		return;
	}

	if (__DEV__) {
		void Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
	}

	Purchases.configure({
		apiKey,
		appUserID,
	});
};

export const isPurchaseCancelledError = (error: unknown) => {
	const purchasesError = error as PurchasesError;
	return (
		purchasesError?.code ===
		Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
	);
};

export const identifyRevenueCatUser = async (appUserID: string) => {
	if (!isRevenueCatSupportedPlatform) {
		return null;
	}

	try {
		const { customerInfo } = await Purchases.logIn(appUserID);
		return customerInfo;
	} catch (error) {
		console.error("RevenueCat login error:", error);
		throw error;
	}
};

export const logOutRevenueCatUser = async () => {
	if (!isRevenueCatSupportedPlatform) {
		return;
	}

	try {
		await Purchases.logOut();
	} catch (error) {
		console.error("RevenueCat logout error:", error);
	}
};

export const getCustomerInfo = async () => {
	if (!isRevenueCatSupportedPlatform) {
		return null;
	}

	return Purchases.getCustomerInfo();
};

export const isProEntitlementActive = (customerInfo: CustomerInfo | null) => {
	if (!customerInfo) {
		return false;
	}

	return FALLBACK_ENTITLEMENT_IDS.some((entitlementId) =>
		Boolean(customerInfo.entitlements.active[entitlementId]),
	);
};

export const getProEntitlement = (customerInfo: CustomerInfo | null) => {
	if (!customerInfo) {
		return null;
	}

	for (const entitlementId of FALLBACK_ENTITLEMENT_IDS) {
		const entitlement = customerInfo.entitlements.active[entitlementId];
		if (entitlement) {
			return entitlement;
		}
	}

	return null;
};

export const getCurrentOffering =
	async (): Promise<PurchasesOffering | null> => {
		if (!isRevenueCatSupportedPlatform) {
			return null;
		}

		const offerings = await Purchases.getOfferings();
		return offerings.current;
	};

const findPackageByIdentifier = (
	offering: PurchasesOffering,
	identifier: string,
) => {
	return offering.availablePackages.find(
		(pkg) => pkg.identifier === identifier,
	);
};

const normalizeIdentifier = (identifier: string) =>
	identifier.toLowerCase().trim();

const matchesPlan = (pkg: PurchasesPackage, plan: "yearly" | "monthly") => {
	if (pkg.packageType === PLAN_PACKAGE_TYPES[plan]) {
		return true;
	}

	const normalizedPackageIdentifier = normalizeIdentifier(pkg.identifier);
	if (PLAN_PACKAGE_IDENTIFIERS[plan].includes(normalizedPackageIdentifier)) {
		return true;
	}

	const normalizedProductIdentifier = normalizeIdentifier(
		pkg.product.identifier,
	);
	return PLAN_PACKAGE_IDENTIFIERS[plan].some((keyword) =>
		normalizedProductIdentifier.includes(keyword.replace("$rc_", "")),
	);
};

export const getPreferredPackages = (offering: PurchasesOffering | null) => {
	if (!offering) {
		return [];
	}

	const prioritized = OFFERING_PACKAGE_PRIORITY.map((plan) =>
		findPackageForPlan(offering, plan),
	).filter(Boolean) as PurchasesPackage[];

	const hasYearly = prioritized.some(
		(pkg) => normalizeIdentifier(pkg.identifier) === "yearly",
	);
	const hasMonthly = prioritized.some(
		(pkg) => normalizeIdentifier(pkg.identifier) === "monthly",
	);

	if (hasYearly && hasMonthly) {
		return prioritized;
	}

	return offering.availablePackages;
};

export const findPackageForPlan = (
	offering: PurchasesOffering | null,
	plan: "yearly" | "monthly",
) => {
	if (!offering) {
		return null;
	}

	return (
		(plan === "yearly" ? offering.annual : offering.monthly) ||
		findPackageByIdentifier(offering, plan) ||
		offering.availablePackages.find((pkg) => matchesPlan(pkg, plan)) ||
		null
	);
};

export const purchaseSelectedPackage = async (
	selectedPackage: PurchasesPackage,
) => {
	if (!isRevenueCatSupportedPlatform) {
		throw new Error("Purchases are only supported on iOS and Android.");
	}

	try {
		const result = await Purchases.purchasePackage(selectedPackage);
		return result.customerInfo;
	} catch (error) {
		if (isPurchaseCancelledError(error)) {
			return null;
		}

		throw error;
	}
};

export const restoreRevenueCatPurchases = async () => {
	if (!isRevenueCatSupportedPlatform) {
		throw new Error("Restore is only supported on iOS and Android.");
	}

	return Purchases.restorePurchases();
};

export const presentRevenueCatPaywall = async (
	offering?: PurchasesOffering,
): Promise<PAYWALL_RESULT | null> => {
	if (!isRevenueCatSupportedPlatform) {
		return null;
	}

	return RevenueCatUI.presentPaywallIfNeeded({
		requiredEntitlementIdentifier: REVENUECAT_ENTITLEMENT_ID,
		offering,
		displayCloseButton: true,
	});
};

export const presentRevenueCatCustomerCenter = async () => {
	if (!isRevenueCatSupportedPlatform) {
		return;
	}

	await RevenueCatUI.presentCustomerCenter();
};

export const addCustomerInfoListener = (
	listener: (customerInfo: CustomerInfo) => void,
) => {
	if (!isRevenueCatSupportedPlatform) {
		return () => undefined;
	}

	Purchases.addCustomerInfoUpdateListener(listener);

	return () => {
		Purchases.removeCustomerInfoUpdateListener(listener);
	};
};
