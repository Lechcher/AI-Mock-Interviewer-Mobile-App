import "./global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomSplashScreen from "@/components/SplashScreen";
import { UniSafeAreaProvider } from "@/core/customUniwind";
import GlobalProvider from "@/core/global-provider";
import { InterviewProvider } from "@/core/interviewContext";
import { RevenueCatProvider } from "@/core/revenuecat-provider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontLoaded] = useFonts({
		Lexend: require("../assets/fonts/Lexend-VariableFont.ttf"),
	});

	const [showCustomSplash, setShowCustomSplash] = useState(true);

	useEffect(() => {
		if (fontLoaded) {
			SplashScreen.hideAsync();
			const timer = setTimeout(() => {
				setShowCustomSplash(false);
			}, 2000); // Show custom splash for 2 seconds
			return () => clearTimeout(timer);
		}
	}, [fontLoaded]);

	if (!fontLoaded || showCustomSplash) {
		return <CustomSplashScreen />;
	}

	return (
		<GlobalProvider>
			<RevenueCatProvider>
				<InterviewProvider>
					<GestureHandlerRootView>
						<BottomSheetModalProvider>
							<UniSafeAreaProvider className="font-lexend bg-background">
								<StatusBar style="dark" />
								<Stack screenOptions={{ headerShown: false }} />
							</UniSafeAreaProvider>
						</BottomSheetModalProvider>
					</GestureHandlerRootView>
				</InterviewProvider>
			</RevenueCatProvider>
		</GlobalProvider>
	);
}
