import BottomSheetPopup from "@/components/BottomSheetPopup";
import { Card, FeaturedCard } from "@/components/Card";
import {
	cardsData,
	featuredCardsData,
	status,
	weekDaysLabels,
} from "@/constants/data";
import { StyledSafeAreaView } from "@/core/customUniwind";
import { useGlobalContext } from "@/core/global-provider";
import Icons from "@/lib/icons";
import type BottomSheet from "@gorhom/bottom-sheet";
import { Redirect, useRouter } from "expo-router";
import {
	ArrowRight,
	BadgeCheck,
	Check,
	Flame,
	Gem,
	LockKeyhole,
	Plus,
	Zap,
} from "lucide-react-native";
import { useMemo, useRef } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
	// Global user and authentication state
	const { user, loading, isLoggedIn } = useGlobalContext();

	const router = useRouter();

	const streakSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ["85%"], []);

	// If user is not authenticated, redirect to auth screen
	if (!loading && !isLoggedIn) return <Redirect href={"/auth"} />;

	const handleStreakSheetExpand = () => {
		streakSheetRef.current?.expand();
	};

	const handleStreakSheetClose = () => {
		streakSheetRef.current?.close();
	};

	const currentDayPosition = status.streaks % 7 === 0 ? 7 : status.streaks % 7;

	const weekDaysLabelsArray = Object.values(weekDaysLabels);

	return (
		<StyledSafeAreaView className="h-full bg-white">
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
						onPress={() => handleStreakSheetExpand()}
					>
						<Flame size={20} color={"#F97316"} />
						<Text className="text-orange-600 font-bold text-xs">
							{status.streaks}
						</Text>
					</TouchableOpacity>

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
					data={cardsData.slice(0, 5)}
					renderItem={({ item }) => (
						<Card
							card={item}
							onPress={() => router.push(`/properties/${item.id}`)}
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					bounces={false}
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
										onPress={() => router.push(`/properties/${item.id}`)}
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

			<BottomSheetPopup
				bottomSheetPopupRef={streakSheetRef as any}
				snapPoints={snapPoints}
				handleBottomSheetPopupClose={handleStreakSheetClose}
			>
				<View className="flex flex-col justify-center gap-5 mt-4">
					<View className="relative items-center justify-center">
						<View
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 bg-orange-400/20 rounded-full"
							style={{ filter: "blur(20px)" }}
						/>
						<Icons.fire className="w-16" />
					</View>

					<Text className="text-3xl font-bold text-center">
						You are on a{" "}
						<Text className="text-primary-100">{status.streaks}-day</Text>{" "}
						streak!
					</Text>

					<Text className="text-base text-slate-600 text-center">
						Complete an interview today to keep it! Consistency is key to acing
						your next job interview.
					</Text>

					<View className="bg-gray-50 rounded-2xl p-5 border border-gray-100 gap-4">
						<View className="flex flex-row justify-between items-center gap-2">
							{weekDaysLabelsArray.map(({ label, shortenLabel }, index) => {
								const dayNumber = index + 1;
								const isPast = dayNumber < currentDayPosition;
								const isCurrentDay = dayNumber === currentDayPosition;

								const isStreakDay = {
									isCompleted:
										isPast || (isCurrentDay && status.hasLearnedToday),
									isTodayTarget: isCurrentDay && !status.hasLearnedToday,
									isFuture: dayNumber > currentDayPosition,
								} as const;

								return (
									<View
										key={label}
										className="flex flex-col items-center gap-2 flex-1"
									>
										<Text
											className={`text-xs font-medium ${isStreakDay.isTodayTarget ? "text-primary-100" : "text-slate-400"}`}
										>
											{isStreakDay.isTodayTarget ? "TODAY" : shortenLabel}
										</Text>

										{isStreakDay.isCompleted && (
											<View className="flex items-center justify-center bg-primary-100 rounded-full p-2.5">
												<Check size={16} color={"#FFFFFF"} />
											</View>
										)}

										{isStreakDay.isTodayTarget && (
											<View className="flex items-center justify-center bg-primary-100/20 rounded-full p-1">
												<View className="flex items-center justify-center size-8 bg-white rounded-full border-3 border-primary-100 shadow-lg shadow-primary-100/20">
													<View className="size-3 bg-primary-100 rounded-full" />
												</View>
											</View>
										)}

										{isStreakDay.isFuture && (
											<View className="size-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-300" />
										)}
									</View>
								);
							})}
						</View>

						<View className="flex flex-row items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 rounded-full mx-auto w-fit border border-amber-100">
							<Zap color={"#D97706"} size={18} />

							<Text className="text-sm font-medium text-amber-600">
								Don't break the chain!
							</Text>
						</View>
					</View>

					<View className="flex flex-row items-center justify-center gap-2 bg-primary-100 py-4 px-6 rounded-full shadow-lg shadow-primary-100/25">
						<Text className="text-lg font-bold text-white">
							Start Practice Interview
						</Text>

						<ArrowRight size={20} color={"#FFFFFF"} />
					</View>

					<TouchableOpacity onPress={() => handleStreakSheetClose()}>
						<Text className="flex text-center w-full items-center justify-center text-gray-500 text-base font-medium">
							Maybe later
						</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetPopup>
		</StyledSafeAreaView>
	);
}
