import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export const useProfile = () => {
	const { data, error, isLoading, mutate } = useSWR(
		"/api/v1/users/profile",
		fetcher,
	);

	return {
		profile: data,
		isLoading,
		isError: error,
		mutateProfile: mutate,
	};
};
