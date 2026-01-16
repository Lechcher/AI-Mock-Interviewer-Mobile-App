// Root layout for the "(root)" group: centralizes auth/loading handling
// and renders nested routes via Expo Router's Slot.

import { StyledSafeAreaView } from "@/core/customUniwind";
import { useGlobalContext } from "@/core/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";

const AppLayout = () => {
	// Read global app state: `loading` during initial bootstrap, `isLoggedIn` for auth guard
	const { loading, isLoggedIn } = useGlobalContext();

	if (loading) {
		return (
			<StyledSafeAreaView className="bg-white flex justify-center h-full items-center">
				{/* Show a large activity indicator while we hydrate session/user data */}
				<ActivityIndicator className="text-primary-100" size={"large"} />
			</StyledSafeAreaView>
		);
	}

	// If the user is not authenticated, redirect them to the auth flow
	if (!isLoggedIn) return <Redirect href={"/auth"} />;

	// Render child routes for this segment. Slot mounts the matching screen
	// under `app/(root)/...` based on the current URL.
	return <Slot />;
};

export default AppLayout;
