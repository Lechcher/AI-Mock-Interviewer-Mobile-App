import { login } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import { Redirect } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const Auth = () => {
  const StyledSafeAreaView = withUniwind(SafeAreaView);

  const { refetch, loading, isLoggedIn } = useGlobalContext();

  // If not loading and already logged in, redirect to the home screen
  if (!loading && isLoggedIn) return <Redirect href={"/"} />;

  // Handler for the Google login button press
  const handleLogin = async () => {
    // Attempt to log in using the Appwrite service
    const result = await login();

    // If login is successful, refetch global context data
    if (result) {
      await refetch({});
    } else {
      // If login fails, display an alert to the user
      Alert.alert("Login Failed", "Unable to login. Please try again.");
    }
  };

  return (
    <StyledSafeAreaView>
      {/* Google login button */}
      <TouchableOpacity
        className="bg-white shadow-zinc-300 rounded-full w-full py-4 mt-5"
        onPress={handleLogin} // Attach the handleLogin function to the button press
      >
        {/* Container for the Google icon and text */}
        <View className="flex flex-row items-center justify-center">
          {/* Button text */}
          <Text className="text-lg font-rubik text-black-200 text-center ml-2">
            Continue with Google
          </Text>
        </View>
      </TouchableOpacity>
    </StyledSafeAreaView>
  );
};

export default Auth;
