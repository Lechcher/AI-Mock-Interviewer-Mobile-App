import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

export const UniSafeAreaView = withUniwind(SafeAreaView);

export const UniSafeAreaProvider = withUniwind(SafeAreaProvider);
