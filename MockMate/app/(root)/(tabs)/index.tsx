import { useGlobalContext } from "@/core/global-provider";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyleSafeAreaView = withUniwind(SafeAreaView);

export default function Index() {
  // Global user and authentication state
  const { loading, isLoggedIn } = useGlobalContext();

  // If user is not authenticated, redirect to auth screen
  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  return (
    <StyleSafeAreaView className="flex-1 px-4">
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Uniwind!
        </Text>
      </View>
    </StyleSafeAreaView>
  );
}
