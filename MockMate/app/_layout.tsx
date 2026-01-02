import "./global.css";

import GlobalProvider from "@/core/global-provider";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

SplashScreen.preventAutoHideAsync();

const StyledSafeAreaProvider = withUniwind(SafeAreaProvider);

export default function RootLayout() {
  const [fontLoaded] = useFonts({
    Lexend: require("../assets/fonts/Lexend-VariableFont.ttf"),
  });

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <StyledSafeAreaProvider className="font-lexend">
        <Stack screenOptions={{ headerShown: false }} />
      </StyledSafeAreaProvider>
    </GlobalProvider>
  );
}
