import {
	syncVipStatusToBackend,
	type VipStatusSyncPayload,
} from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import {
	addCustomerInfoListener,
	configureRevenueCat,
	findPackageForPlan,
	getCurrentOffering,
	getCustomerInfo,
	getPreferredPackages,
	getProEntitlement,
	identifyRevenueCatUser,
	isProEntitlementActive,
	isPurchaseCancelledError,
	isRevenueCatSupportedPlatform,
	logOutRevenueCatUser,
	presentRevenueCatCustomerCenter,
	presentRevenueCatPaywall,
	purchaseSelectedPackage,
	restoreRevenueCatPurchases,
} from "@/core/revenuecat";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type {
	CustomerInfo,
	PurchasesOffering,
	PurchasesPackage,
} from "react-native-purchases";
import type { PAYWALL_RESULT } from "react-native-purchases-ui";

type SubscriptionPlan = "yearly" | "monthly";

type RevenueCatContextValue = {
	isReady: boolean;
	isLoading: boolean;
	isPurchaseInProgress: boolean;
	isVip: boolean;
	vipEntitlementIdentifier: string | null;
	vipExpiryDate: string | null;
	customerInfo: CustomerInfo | null;
	offering: PurchasesOffering | null;
	availablePackages: PurchasesPackage[];
	yearlyPackage: PurchasesPackage | null;
	monthlyPackage: PurchasesPackage | null;
	refreshRevenueCat: () => Promise<void>;
	purchasePlan: (plan: SubscriptionPlan) => Promise<CustomerInfo | null>;
	restorePurchases: () => Promise<CustomerInfo | null>;
	presentPaywall: () => Promise<PAYWALL_RESULT | null>;
	presentCustomerCenter: () => Promise<void>;
};

const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
	undefined,
);

export const RevenueCatProvider = ({ children }: { children: ReactNode }) => {
	const { user } = useGlobalContext();

	const [isReady, setIsReady] = useState(!isRevenueCatSupportedPlatform);
	const [isLoading, setIsLoading] = useState(isRevenueCatSupportedPlatform);
	const [isPurchaseInProgress, setIsPurchaseInProgress] = useState(false);
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
	const [offering, setOffering] = useState<PurchasesOffering | null>(null);

	const isConfiguredRef = useRef(false);
	const syncedUserIdRef = useRef<string | null>(null);
	const lastSyncedVipStatusRef = useRef<{
		isVip: boolean;
		expiryDate: string | null;
		entitlementId: string | null;
	}>({ isVip: false, expiryDate: null, entitlementId: null });

	const syncVipStatusToBackendIfNeeded = useCallback(
		async (newCustomerInfo: CustomerInfo | null) => {
			if (!user?.$id || !newCustomerInfo) {
				return;
			}

			const newIsVip = isProEntitlementActive(newCustomerInfo);
			const newVipEntitlement = getProEntitlement(newCustomerInfo);
			const newExpiryDate = newVipEntitlement?.expirationDate || null;
			const newEntitlementId = newVipEntitlement?.identifier || null;

			// Only sync if VIP status has changed
			const hasVipStatusChanged =
				lastSyncedVipStatusRef.current.isVip !== newIsVip ||
				lastSyncedVipStatusRef.current.expiryDate !== newExpiryDate ||
				lastSyncedVipStatusRef.current.entitlementId !== newEntitlementId;

			if (!hasVipStatusChanged) {
				return;
			}

			try {
				const payload: VipStatusSyncPayload = {
					isVip: newIsVip,
					vipExpiryDate: newExpiryDate,
					entitlementIdentifier: newEntitlementId,
				};

				await syncVipStatusToBackend("/api/v1/users/vip-status", {
					arg: payload,
				});

				// Update the ref to prevent duplicate syncs
				lastSyncedVipStatusRef.current = {
					isVip: newIsVip,
					expiryDate: newExpiryDate,
					entitlementId: newEntitlementId,
				};
			} catch (error) {
				console.error("Failed to sync VIP status to backend:", error);
				// Don't throw - this is a background sync operation
			}
		},
		[user?.$id],
	);

	const refreshRevenueCat = useCallback(async () => {
		if (!isRevenueCatSupportedPlatform) {
			setIsReady(true);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);

		try {
			const [latestCustomerInfo, latestOffering] = await Promise.all([
				getCustomerInfo(),
				getCurrentOffering(),
			]);

			setCustomerInfo(latestCustomerInfo);
			setOffering(latestOffering);
		} catch (error) {
			console.error("RevenueCat refresh failed:", error);
		} finally {
			setIsReady(true);
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!isRevenueCatSupportedPlatform || isConfiguredRef.current) {
			return;
		}

		configureRevenueCat();
		isConfiguredRef.current = true;
	}, []);

	useEffect(() => {
		if (!isRevenueCatSupportedPlatform) {
			return;
		}

		const unsubscribe = addCustomerInfoListener((updatedCustomerInfo) => {
			setCustomerInfo(updatedCustomerInfo);
			// Sync VIP status to backend whenever customer info changes
			void syncVipStatusToBackendIfNeeded(updatedCustomerInfo);
		});

		return unsubscribe;
	}, [syncVipStatusToBackendIfNeeded]);

	useEffect(() => {
		if (!isRevenueCatSupportedPlatform || !isConfiguredRef.current) {
			setIsReady(true);
			setIsLoading(false);
			return;
		}

		let isCancelled = false;

		const syncRevenueCatUser = async () => {
			setIsLoading(true);

			try {
				if (user?.$id) {
					if (syncedUserIdRef.current !== user.$id) {
						await identifyRevenueCatUser(user.$id);
						syncedUserIdRef.current = user.$id;
					}
				} else if (syncedUserIdRef.current) {
					await logOutRevenueCatUser();
					syncedUserIdRef.current = null;
				}

				if (!isCancelled) {
					await refreshRevenueCat();
					// Sync VIP status after initial refresh
					const latestCustomerInfo = await getCustomerInfo();
					await syncVipStatusToBackendIfNeeded(latestCustomerInfo);
				}
			} catch (error) {
				console.error("RevenueCat user sync failed:", error);
				if (!isCancelled) {
					setIsReady(true);
					setIsLoading(false);
				}
			}
		};

		syncRevenueCatUser();

		return () => {
			isCancelled = true;
		};
	}, [user?.$id, refreshRevenueCat, syncVipStatusToBackendIfNeeded]);

	const purchasePlan = useCallback(
		async (plan: SubscriptionPlan) => {
			if (!isRevenueCatSupportedPlatform) {
				throw new Error("Purchases are only supported on iOS and Android.");
			}

			const selectedPackage = findPackageForPlan(offering, plan);

			if (!selectedPackage) {
				throw new Error(
					`Unable to find ${plan} package in the current RevenueCat offering.`,
				);
			}

			setIsPurchaseInProgress(true);

			try {
				const latestCustomerInfo =
					await purchaseSelectedPackage(selectedPackage);

				if (latestCustomerInfo) {
					setCustomerInfo(latestCustomerInfo);
					// Sync VIP status to backend immediately after successful purchase
					await syncVipStatusToBackendIfNeeded(latestCustomerInfo);
				}

				return latestCustomerInfo;
			} catch (error) {
				if (isPurchaseCancelledError(error)) {
					return null;
				}

				throw error;
			} finally {
				setIsPurchaseInProgress(false);
			}
		},
		[offering, syncVipStatusToBackendIfNeeded],
	);

	const restorePurchases = useCallback(async () => {
		setIsPurchaseInProgress(true);

		try {
			const latestCustomerInfo = await restoreRevenueCatPurchases();
			setCustomerInfo(latestCustomerInfo);
			// Sync VIP status to backend immediately after successful restore
			await syncVipStatusToBackendIfNeeded(latestCustomerInfo);
			return latestCustomerInfo;
		} finally {
			setIsPurchaseInProgress(false);
		}
	}, [syncVipStatusToBackendIfNeeded]);

	const presentPaywall = useCallback(async () => {
		setIsPurchaseInProgress(true);

		try {
			const result = await presentRevenueCatPaywall(offering || undefined);

			if (result === "PURCHASED" || result === "RESTORED") {
				await refreshRevenueCat();
				// Sync VIP status to backend after paywall purchase/restore
				const latestCustomerInfo = await getCustomerInfo();
				await syncVipStatusToBackendIfNeeded(latestCustomerInfo);
			}

			return result;
		} finally {
			setIsPurchaseInProgress(false);
		}
	}, [offering, refreshRevenueCat, syncVipStatusToBackendIfNeeded]);

	const presentCustomerCenter = useCallback(async () => {
		await presentRevenueCatCustomerCenter();
	}, []);

	const value = useMemo<RevenueCatContextValue>(() => {
		const availablePackages = getPreferredPackages(offering);
		const yearlyPackage = findPackageForPlan(offering, "yearly");
		const monthlyPackage = findPackageForPlan(offering, "monthly");
		const vipEntitlement = getProEntitlement(customerInfo);

		return {
			isReady,
			isLoading,
			isPurchaseInProgress,
			isVip: isProEntitlementActive(customerInfo),
			vipEntitlementIdentifier: vipEntitlement?.identifier || null,
			vipExpiryDate: vipEntitlement?.expirationDate || null,
			customerInfo,
			offering,
			availablePackages,
			yearlyPackage,
			monthlyPackage,
			refreshRevenueCat,
			purchasePlan,
			restorePurchases,
			presentPaywall,
			presentCustomerCenter,
		};
	}, [
		isReady,
		isLoading,
		isPurchaseInProgress,
		customerInfo,
		offering,
		refreshRevenueCat,
		purchasePlan,
		restorePurchases,
		presentPaywall,
		presentCustomerCenter,
	]);

	return (
		<RevenueCatContext.Provider value={value}>
			{children}
		</RevenueCatContext.Provider>
	);
};

export const useRevenueCatContext = () => {
	const context = useContext(RevenueCatContext);

	if (!context) {
		throw new Error(
			"useRevenueCatContext must be used within a RevenueCatProvider",
		);
	}

	return context;
};

export default RevenueCatProvider;
