import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

export const UniSafeAreaView = withUniwind(SafeAreaView);

export const UniSafeAreaProvider = withUniwind(SafeAreaProvider);

export const UniBottomSheetBackdrop = withUniwind(BottomSheetBackdrop);

export const UniBottomSheet = withUniwind(BottomSheet);

export const UniBottomSheetView = withUniwind(BottomSheetView);
