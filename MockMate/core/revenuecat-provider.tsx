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

type SubscriptionPlan = "yearly" | "monthly";

type RevenueCatContextValue = {
	isReady: boolean;
	isLoading: boolean;
	isPurchaseInProgress: boolean;
	isPro: boolean;
	proEntitlementIdentifier: string | null;
	proExpiryDate: string | null;
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
		});

		return unsubscribe;
	}, []);

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
	}, [user?.$id, refreshRevenueCat]);

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
		[offering],
	);

	const restorePurchases = useCallback(async () => {
		setIsPurchaseInProgress(true);

		try {
			const latestCustomerInfo = await restoreRevenueCatPurchases();
			setCustomerInfo(latestCustomerInfo);
			return latestCustomerInfo;
		} finally {
			setIsPurchaseInProgress(false);
		}
	}, []);

	const presentPaywall = useCallback(async () => {
		setIsPurchaseInProgress(true);

		try {
			const result = await presentRevenueCatPaywall(offering || undefined);

			if (result === "PURCHASED" || result === "RESTORED") {
				await refreshRevenueCat();
			}

			return result;
		} finally {
			setIsPurchaseInProgress(false);
		}
	}, [offering, refreshRevenueCat]);

	const presentCustomerCenter = useCallback(async () => {
		await presentRevenueCatCustomerCenter();
	}, []);

	const value = useMemo<RevenueCatContextValue>(() => {
		const availablePackages = getPreferredPackages(offering);
		const yearlyPackage = findPackageForPlan(offering, "yearly");
		const monthlyPackage = findPackageForPlan(offering, "monthly");
		const proEntitlement = getProEntitlement(customerInfo);

		return {
			isReady,
			isLoading,
			isPurchaseInProgress,
			isPro: isProEntitlementActive(customerInfo),
			proEntitlementIdentifier: proEntitlement?.identifier || null,
			proExpiryDate: proEntitlement?.expirationDate || null,
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
