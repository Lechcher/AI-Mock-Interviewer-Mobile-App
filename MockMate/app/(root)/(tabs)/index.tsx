import { useGlobalContext } from "@/core/global-provider";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  // Global user and authentication state
  const { loading, isLoggedIn } = useGlobalContext();

  // If user is not authenticated, redirect to auth screen
  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
