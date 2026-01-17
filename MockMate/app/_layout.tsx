import { UniSafeAreaProvider } from "@/core/customUniwind";
import "./global.css";

import CustomSplashScreen from "@/components/SplashScreen";
import GlobalProvider from "@/core/global-provider";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
			<GestureHandlerRootView>
				<BottomSheetModalProvider>
					<UniSafeAreaProvider className="font-lexend bg-background">
						<StatusBar style="auto" />
						<Stack screenOptions={{ headerShown: false }} />
					</UniSafeAreaProvider>
				</BottomSheetModalProvider>
			</GestureHandlerRootView>
		</GlobalProvider>
	);
}
