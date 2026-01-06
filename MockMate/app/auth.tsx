import { login } from "@/core/appwrite";
import { useGlobalContext } from "@/core/global-provider";
import icons from "@/lib/icons";
import images from "@/lib/images";
import { Redirect } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

const Auth = () => {
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
    <StyledSafeAreaView className="flex flex-col px-4 h-full items-center justify-center bg-background">
      <View className="flex flex-col gap-10 items-center justify-center">
        <View className="flex flex-col items-center justify-center w-full gap-6">
          <View className="inline-flex flex-row items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
            <View className="flex flex-row overflow-hidden">
              <Image
                source={images.badge1}
                className="h-6 w-6 rounded-full border-2 border-white z-0"
              />
              <Image
                source={images.badge2}
                className="h-6 w-6 rounded-full border-2 border-white -ml-2 z-10"
              />
              <Image
                source={images.badge3}
                className="h-6 w-6 rounded-full border-2 border-white -ml-2 z-20"
              />
            </View>

            <Text className="font-semibold text-xs text-slate-800">
              Trusted by 10k+ candidates
            </Text>
          </View>

          <View className="w-full aspect-square relative max-h-[360px] rounded-3xl overflow-hidden shadow-2xl shadow-primary-100/10">
            <View className="absolute inset-0 bg-linear-to-tr from-primary-300/20 to-transparent mix-blend-overlay"></View>
            <Image
              source={images.wellcomeImage}
              className="w-full h-full bg-center bg-cover"
            />
          </View>
        </View>

        <View className="flex flex-col gap-4">
          <View className="flex flex-col gap-3">
            <Text className="text-3xl font-extrabold text-center">
              Master Your {"\n"}
              <Text className="text-primary-100">Interview Skills</Text>
            </Text>

            <Text className="text-center text-slate-500 text-lg ">
              Practice with AI and get hired {"\n"} faster. Level up your career
              today.
            </Text>
          </View>

          <View className="flex flex-col gap-6">
            {/* Google login button */}
            <TouchableOpacity
              className="bg-white shadow-zinc-300 rounded-full w-full py-4 mt-5"
              onPress={handleLogin} // Attach the handleLogin function to the button press
            >
              {/* Container for the Google icon and text */}
              <View className="flex flex-row items-center justify-center gap-4">
                <Image
                  source={icons.google}
                  className="h-5 w-5"
                  resizeMode="contain"
                />
                {/* Button text */}
                <Text className="text-base font-semibold text-black">
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>

            <Text className="text-xs text-center text-slate-400">
              By continuing, you agree to our{" "}
              <Text className="underline">Terms</Text> &{" "}
              <Text className="underline">Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
    </StyledSafeAreaView>
  );
};

export default Auth;
