import {
	type cardsData,
	difficulties,
	industries,
	status,
	weekDaysLabels,
} from "@/constants/data";
import {
	UniBottomSheet,
	UniBottomSheetBackdrop,
	UniBottomSheetView,
} from "@/core/customUniwind";
import Icons from "@/lib/icons";
import type BottomSheet from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import {
	ArrowRight,
	BriefcaseBusiness,
	Check,
	Flame,
	List,
	MessageSquare,
	Star,
	Target,
	X,
	Zap,
} from "lucide-react-native";
import { type ReactNode, type RefObject, useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface BottomSheetPopupProps {
	children: ReactNode;
	bottomSheetPopupRef: React.RefObject<BottomSheet | null>;
	snapPoints?: (string | number)[];
	handleBottomSheetPopupClose: () => void;
}

export const BottomSheetPopup = ({
	children,
	bottomSheetPopupRef,
	snapPoints,
	handleBottomSheetPopupClose,
}: BottomSheetPopupProps) => {
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<UniBottomSheetBackdrop
				{...props}
				opacity={0.6}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				style={[props.style, { backgroundColor: "#111827" }]}
			/>
		),
		[],
	);

	return (
		<UniBottomSheet
			ref={bottomSheetPopupRef}
			index={-1}
			snapPoints={snapPoints}
			enablePanDownToClose={true}
			backdropComponent={renderBackdrop}
			handleIndicatorStyle={{
				backgroundColor: "#D9D9D9",
				width: 48,
				height: 6,
			}}
			containerStyle={{
				borderTopLeftRadius: 32,
				borderTopRightRadius: 32,
			}}
			style={{ padding: 16 }}
		>
			<UniBottomSheetView>
				<View className="absolute" style={{ top: 0, right: 20 }}>
					<TouchableOpacity onPress={() => handleBottomSheetPopupClose()}>
						<X size={24} color={"#9CA3AF"} />
					</TouchableOpacity>
				</View>

				<View>{children}</View>
			</UniBottomSheetView>
		</UniBottomSheet>
	);
};

interface BottomSheetProps {
	sheetRef: RefObject<BottomSheet | null>;
	snapPoints: (string | number)[];
	handleSheetRefClose: () => void;
}

export const StreakBottomSheet = ({
	sheetRef,
	snapPoints,
	handleSheetRefClose,
}: BottomSheetProps) => {
	const currentDayPosition = status.streaks % 7 === 0 ? 7 : status.streaks % 7;

	const weekDaysLabelsArray = Object.values(weekDaysLabels);

	return (
		<BottomSheetPopup
			bottomSheetPopupRef={sheetRef}
			snapPoints={snapPoints}
			handleBottomSheetPopupClose={handleSheetRefClose}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
					justifyContent: "center",
					gap: 20,
					marginTop: 16,
				}}
			>
				<View
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
					}}
				>
					<View
						style={{
							width: 80,
							height: 80,
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							backgroundColor: "#FF890414",
							filter: "blur(20px)",
							borderRadius: 100,
						}}
					/>
					<Icons.fire style={{ width: 64, height: 64 }} />
				</View>

				<Text className="text-3xl font-bold text-center">
					You are on a{" "}
					<Text className="text-primary-100">{status.streaks}-day</Text> streak!
				</Text>

				<Text className="text-base text-slate-600 text-center">
					Complete an interview today to keep it! Consistency is key to acing
					your next job interview.
				</Text>

				<View
					className="rounded-2xl p-5 border border-gray-100 gap-4"
					style={{ backgroundColor: "#F9FAFB" }}
				>
					<View className="flex flex-row justify-between items-center gap-2">
						{weekDaysLabelsArray.map(({ label, shortenLabel }, index) => {
							const dayNumber = index + 1;
							const isPast = dayNumber < currentDayPosition;
							const isCurrentDay = dayNumber === currentDayPosition;

							const isStreakDay = {
								isCompleted: isPast || (isCurrentDay && status.hasLearnedToday),
								isTodayTarget: isCurrentDay && !status.hasLearnedToday,
								isFuture: dayNumber > currentDayPosition,
							} as const;

							return (
								<View
									key={label}
									className="flex flex-col items-center gap-2 flex-1"
								>
									<Text
										className={`text-xs font-medium text-center ${isStreakDay.isTodayTarget ? "text-primary-100" : "text-slate-400"}`}
									>
										{isStreakDay.isTodayTarget ? "TODAY" : shortenLabel}
									</Text>

									{isStreakDay.isCompleted && (
										<View
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												padding: 10,
												borderRadius: 100,
												backgroundColor: "#2563EB",
											}}
										>
											<Check size={16} color={"#FFFFFF"} />
										</View>
									)}

									{isStreakDay.isTodayTarget && (
										<View
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												backgroundColor: "#2563EB14",
												borderRadius: 100,
												padding: 4,
											}}
										>
											<View
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													width: 32,
													height: 32,
													backgroundColor: "white",
													borderRadius: 100,
													borderWidth: 3,
													borderColor: "#2563EB",
												}}
											>
												<View className="size-3 bg-primary-100 rounded-full" />
											</View>
										</View>
									)}

									{isStreakDay.isFuture && (
										<View
											style={{
												width: 32,
												height: 32,
												borderRadius: 100,
												borderWidth: 2,
												borderStyle: "dashed",
												backgroundColor: "#F3F4F6",
												borderColor: "#D1D5DC",
											}}
										/>
									)}
								</View>
							);
						})}
					</View>

					<View
						className="flex flex-row items-center justify-center py-2 px-3 bg-amber-50 rounded-full mx-auto w-fit border border-amber-100"
						style={{
							backgroundColor: "#FFFBEB",
							borderColor: "#FEF3C6",
							gap: 6,
						}}
					>
						<Zap color={"#D97706"} size={18} />

						<Text
							className="text-sm font-medium text-amber-600"
							style={{ color: "#E17100" }}
						>
							Don't break the chain!
						</Text>
					</View>
				</View>

				<View className="flex flex-row items-center justify-center gap-2 bg-primary-100 py-4 px-6 rounded-full shadow-lg shadow-primary-100/25">
					<Text className="text-lg font-bold text-white">
						Start Practice Interview
					</Text>

					{status.vipStatus && <ArrowRight size={20} color={"#FFFFFF"} />}
				</View>

				<TouchableOpacity onPress={() => handleSheetRefClose()}>
					<Text className="flex text-center w-full items-center justify-center text-gray-500 text-base font-medium">
						Maybe later
					</Text>
				</TouchableOpacity>
			</View>
		</BottomSheetPopup>
	);
};

interface ItemBottomSheetProps extends BottomSheetProps {
	item: (typeof cardsData)[0] | null;
}

export const ItemBottomSheet = ({
	sheetRef,
	snapPoints,
	handleSheetRefClose,
	item,
}: ItemBottomSheetProps) => {
	if (!item) return null;

	const industry = industries[item.industry as keyof typeof industries];
	const difficulty = difficulties[item.difficulty as keyof typeof difficulties];

	return (
		<BottomSheetPopup
			bottomSheetPopupRef={sheetRef}
			snapPoints={snapPoints}
			handleBottomSheetPopupClose={handleSheetRefClose}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					paddingHorizontal: "auto",
					alignItems: "stretch",
					gap: 30,
					marginTop: 16,
				}}
			>
				{/* Industry Icon */}
				<View className="items-center justify-center">
					<View
						style={{ backgroundColor: industry?.backgroundColor }}
						className="p-6 rounded-full"
					>
						<industry.icon size={32} color={industry?.iconColor} />
					</View>
				</View>

				{/* Title and Time */}
				<View className="flex flex-col items-center gap-1">
					<Text className="text-2xl font-bold text-center">{item.title}</Text>
					<Text className="text-sm text-slate-500 text-center">
						Estimated time: 15 mins
					</Text>
				</View>

				{/* Info Cards */}
				<View className="flex flex-row justify-between gap-1">
					<View
						className="flex-1 items-center justify-center border border-blue-100 rounded-2xl gap-1.5"
						style={{ padding: 16 }}
					>
						<BriefcaseBusiness size={24} color={"#0D59F2"} />
						<Text className="text-xs font-bold text-slate-900 uppercase">
							{item.industry}
						</Text>
					</View>

					<View className="flex-1 items-center justify-center border border-blue-100 rounded-2xl gap-1.5">
						<Flame size={24} color={difficulty?.color} />
						<Text
							className="text-xs font-bold uppercase"
							style={{ color: difficulty?.color }}
						>
							{item.difficulty}
						</Text>
					</View>

					<View className="flex-1 items-center justify-center border border-blue-100 rounded-2xl gap-1.5">
						<List size={24} color={"#0D59F2"} />
						<Text className="text-xs font-bold text-slate-900 uppercase">
							{item.questions} Questions
						</Text>
					</View>
				</View>

				{/* Reviews */}
				<View className="flex flex-row items-center justify-between">
					<View className="flex flex-row items-center gap-2">
						<MessageSquare size={24} color={"#0D59F2"} />
						<Text className="text-sm font-bold text-slate-900 uppercase">
							Reviews
						</Text>
					</View>
					<View className="flex flex-row items-center gap-1">
						<Text className="text-sm font-bold text-slate-900">
							{item.review}
						</Text>
						<Text className="text-xs text-slate-400">
							({item.reviewCount} reviews)
						</Text>
						<Star size={16} color="#EAB308" fill="#EAB308" />
					</View>
				</View>

				{/* Focus Area */}
				<View className="p-5 border border-blue-100 rounded-2xl gap-3">
					<View className="flex flex-row items-center gap-2">
						<Target size={24} color={"#0D59F2"} />
						<Text className="text-sm font-bold text-slate-900 uppercase">
							Focus Area
						</Text>
					</View>
					<Text className="text-sm text-slate-800 leading-relaxed">
						{item.focusArea}
					</Text>
				</View>

				{/* Action Buttons */}
				<View className="flex flex-col gap-3">
					<TouchableOpacity className="flex flex-row items-center justify-center gap-2 bg-primary-100 py-4 px-6 rounded-3xl shadow-lg shadow-primary-100/25">
						<Text className="text-lg font-bold text-white">Start Now</Text>
						<ArrowRight size={20} color={"#FFFFFF"} />
					</TouchableOpacity>
					<Text className="text-center text-xs text-blue-800 font-medium">
						Ready to test your skills?
					</Text>
				</View>
			</View>
		</BottomSheetPopup>
	);
};
