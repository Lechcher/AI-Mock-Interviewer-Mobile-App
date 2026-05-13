import { syncVipStatusToBackend } from "@/core/appwrite";
import useSWRMutation from "swr/mutation";

/**
 * Custom hook for syncing VIP status to the backend using SWR mutation.
 * This hook provides a way to trigger VIP status synchronization with loading and error states.
 * Called after RevenueCat purchase/restore to ensure backend stays in sync.
 *
 * @returns An object containing the trigger function, loading state, error state, and data
 */
export const useSyncVipStatus = () => {
	const { trigger, isMutating, error, data } = useSWRMutation(
		"/api/v1/users/vip-status",
		syncVipStatusToBackend,
	);

	return {
		syncVipStatus: trigger,
		isSyncing: isMutating,
		syncError: error,
		syncData: data,
	};
};
