import { FeaturedCard } from "@/components/Card";
import { featuredCardsData, status } from "@/constants/data";
import { useGlobalContext } from "@/core/global-provider";
import { Redirect, router } from "expo-router";
import { BadgeCheck, Flame, Gem } from "lucide-react-native";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyleSafeAreaView = withUniwind(SafeAreaView);

export default function Index() {
  // Global user and authentication state
  const { user, loading, isLoggedIn } = useGlobalContext();

  // If user is not authenticated, redirect to auth screen
  if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

  return (
    <StyleSafeAreaView className="h-full bg-white">
      <View className="px-4 font-lexend flex flex-row items-center justify-between gap-4 py-4 h-fit">
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <View className="relative">
            <Image
              source={{ uri: user?.avatar }}
              className="size-10 rounded-full"
            />

            <View className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white" />
          </View>
        </TouchableOpacity>

        <View className="flex flex-row items-center justify-center gap-2">
          <View className="flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 bg-orange-50 rounded-full border border-orange-100">
            <Flame size={20} color={"#F97316"} />
            <Text className="text-orange-600 font-bold text-xs">
              {status.streaks}
            </Text>
          </View>

          <View className="flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 rounded-full border border-blue-100">
            <Gem size={20} color={"#3B82F6"} />
            <Text className="text-blue-600 font-bold text-xs">
              {status.gems}
            </Text>
          </View>

          <View
            className={`flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 rounded-full border ${
              status.vipStatus
                ? "bg-yellow-50 border-yellow-100"
                : "bg-slate-50 border-slate-100"
            }`}
          >
            <BadgeCheck
              size={20}
              color={`${status.vipStatus ? "#EAB308" : "#6B7280"}`}
            />
            <Text
              className={`${
                status.vipStatus ? "text-yellow-600" : "text-slate-600"
              } font-bold text-xs`}
            >
              VIP
            </Text>
          </View>
        </View>
      </View>

      <View className="h-full bg-background px-4">
        <FlatList
          data={featuredCardsData}
          renderItem={({ item }) => (
            <FeaturedCard
              card={item}
              onPress={() => router.push(`/properties/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerClassName="flex gap-3 mt-3"
          ListHeaderComponent={
            <View>
              <Text className="mt-5 text-lg font-bold">
                Featured Interviews
              </Text>

              <FlatList
                data={featuredCardsData}
                renderItem={({ item }) => (
                  <FeaturedCard
                    card={item}
                    onPress={() => router.push(`/properties/${item.id}`)}
                  />
                )}
                keyExtractor={(item) => item.title}
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                contentContainerClassName="flex gap-3 mt-3"
              />

              <View>
                <Text className="font-bold text-lg">Our Recommendations</Text>

                <TouchableOpacity>
                  <Text className="text-primary-100 font-medium text-sm">
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      </View>
    </StyleSafeAreaView>
  );
}
