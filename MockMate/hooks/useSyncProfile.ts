import { syncProfileToBackend } from "@/core/appwrite";
import useSWRMutation from "swr/mutation";

/**
 * Custom hook for syncing profile data to the backend using SWR mutation.
 * This hook provides a way to trigger profile synchronization with loading and error states.
 *
 * @param url - The backend endpoint URL to sync profile data to
 * @returns An object containing the trigger function, loading state, error state, and data
 */
export const useSyncProfile = () => {
	const { trigger, isMutating, error, data } = useSWRMutation(
		"/api/v1/users/profile",
		syncProfileToBackend,
	);

	return {
		syncProfile: trigger,
		isSyncing: isMutating,
		syncError: error,
		syncData: data,
	};
};
