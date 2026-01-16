import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

export const StyledSafeAreaView = withUniwind(SafeAreaView);

export const StyledSafeAreaProvider = withUniwind(SafeAreaProvider);
