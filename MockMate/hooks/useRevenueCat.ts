import { useRevenueCatContext } from "@/core/revenuecat-provider";

export const useRevenueCat = () => {
	return useRevenueCatContext();
};

export default useRevenueCat;
