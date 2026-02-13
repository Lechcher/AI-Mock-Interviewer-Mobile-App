import {
	ItemBottomSheet,
	StreakBottomSheet,
} from "@/components/BottomSheetPopup";
import { Card, FeaturedCard } from "@/components/Card";
import { cardsData, featuredCardsData, status } from "@/constants/data";
import { UniSafeAreaView } from "@/core/customUniwind";
import { useGlobalContext } from "@/core/global-provider";
import type BottomSheet from "@gorhom/bottom-sheet";
import { Redirect, useRouter } from "expo-router";
import { BadgeCheck, Flame, Gem, LockKeyhole, Plus } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import {
	FlatList,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function Index() {
	// Global user and authentication state
	const { user, loading, isLoggedIn } = useGlobalContext();

	const router = useRouter();

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = () => {
		setRefreshing(true);
		// Simulate a refresh operation
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	};

	const streakSheetRef = useRef<BottomSheet>(null);

	const itemSheetRef = useRef<BottomSheet>(null);

	const [selectedInterview, setSelectedInterview] = useState<
		(typeof cardsData)[0] | null
	>(null);

	const snapPoints = useMemo(() => ["80%"], []);

	// If user is not authenticated, redirect to auth screen
	if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

	const handleStreakSheetRefExpand = () => {
		streakSheetRef.current?.expand();
	};

	const handleItemSheetRefExpand = (item: (typeof cardsData)[0]) => {
		setSelectedInterview(item);
		itemSheetRef.current?.expand();
	};

	const handleSheetRefClose = () => {
		streakSheetRef.current?.close();
		itemSheetRef.current?.close();
	};

	const onShopPress = () => {
		router.push("/shop");
	};

	return (
		<UniSafeAreaView className="h-full bg-white">
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
					<TouchableOpacity
						className="flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 bg-orange-50 rounded-full border border-orange-100"
						onPress={() => handleStreakSheetRefExpand()}
					>
						<Flame size={20} color={"#F97316"} />
						<Text className="text-orange-600 font-bold text-xs">
							{status.streaks}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={onShopPress}>
						<View className="flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 rounded-full border border-blue-100">
							<Gem size={20} color={"#3B82F6"} />
							<Text className="text-blue-600 font-bold text-xs">
								{status.gems}
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => router.push("/vip")}>
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
					</TouchableOpacity>
				</View>
			</View>

			<View className="h-full bg-background px-4">
				<FlatList
					data={cardsData.slice(0, 5)}
					renderItem={({ item }) => (
						<Card card={item} onPress={() => handleItemSheetRefExpand(item)} />
					)}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					bounces={false}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					contentContainerClassName="flex gap-3 mt-3"
					contentContainerStyle={{ paddingBottom: 79 }}
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
										onPress={() => handleItemSheetRefExpand(item)}
									/>
								)}
								keyExtractor={(item) => item.id.toString()}
								horizontal
								showsHorizontalScrollIndicator={false}
								bounces={false}
								contentContainerClassName="flex gap-3 mt-3"
							/>

							<View className="flex flex-row items-center justify-between mt-6">
								<Text className="font-bold text-lg">Our Recommendations</Text>

								<TouchableOpacity onPress={() => router.push("/explore")}>
									<Text className="text-primary-100 font-medium text-sm">
										See All
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					}
				/>
			</View>

			<TouchableOpacity
				className="absolute bottom-4 right-4"
				onPress={() => router.push("/newInterview")}
			>
				{!status.vipStatus && (
					<View className="absolute -top-3 -right-3 inline-flex items-center justify-center p-2 rounded-full bg-[#FACC15] border-2 border-white z-10">
						<LockKeyhole
							color={"#713F12"}
							size={14}
							strokeWidth={2}
							absoluteStrokeWidth={true}
						/>
					</View>
				)}

				<View className="flex flex-row items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary-100 border-2 border-white/20 shadow-lg">
					<Plus color={"#FFFFFF"} size={24} />
					<Text className="text-lg font-bold text-white">New Interview</Text>
				</View>
			</TouchableOpacity>

			<StreakBottomSheet
				sheetRef={streakSheetRef}
				snapPoints={snapPoints}
				handleSheetRefClose={handleSheetRefClose}
			/>

			<ItemBottomSheet
				sheetRef={itemSheetRef}
				snapPoints={snapPoints}
				handleSheetRefClose={handleSheetRefClose}
				item={selectedInterview}
			/>
		</UniSafeAreaView>
	);
}
