import {
	CalendarRange,
	CheckCircle2,
	Crown,
	Settings,
	X,
} from "lucide-react-native";
import {
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { UniSafeAreaView } from "@/core/customUniwind";
import { status } from "@/constants/data";
import { useRouter } from "expo-router";

const VipPage = () => {
	const router = useRouter();

	const features = [
		{ title: "Unlimited Interviews", subtitle: "(Free: Limit 3/day)" },
		{ title: "Create Custom Interviews", subtitle: "(Exclusive)" },
		{ title: "Deep AI Feedback", subtitle: "(Free: Basic summary)" },
		{ title: "Premium Voices", subtitle: "" },
		{ title: "Ad-Free Experience", subtitle: "" },
	];

	return (
		<UniSafeAreaView className="relative flex-1 bg-[#020617]">
			<StatusBar barStyle={"light-content"} />

			{/* Background Glows */}
			<View
				className="absolute top-0 h-[50vh] w-full"
				style={{
					backgroundColor: "#2563EB08",
					filter: "blur(100px)",
				}}
			/>
			<View
				className="absolute size-64 bg-amber-500 opacity-10 self-center"
				style={{ top: -32, filter: "blur(80px)" }}
			/>

			<ScrollView
				contentContainerClassName="flex-grow pb-10"
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View className="px-6 pt-4 flex flex-row justify-end">
					<TouchableOpacity
						onPress={() => router.back()}
						className="p-2 bg-[#FFFFFF0A] rounded-full border border-[#FFFFFF14]"
					>
						<X size={20} color={"#FFFFFF99"} />
					</TouchableOpacity>
				</View>

				<View className="items-center px-6 mt-4">
					<View className="mb-6">
						<Crown size={80} color="#FFD700" />
					</View>

					<Text className="text-white text-4xl font-extrabold text-center leading-tight">
						You are a <Text className="text-[#FFD700]">VIP Member</Text>
					</Text>

					<Text className="text-slate-400 text-base text-center mt-4 px-4 font-medium">
						Enjoying the ultimate career prep experience.
					</Text>
				</View>

				<View className="flex flex-col mx-6 mt-8 p-6 gap-4 border-2 rounded-2xl border-[#FFD700]">
					<View className="flex flex-row items-start justify-between">
						<View className="gap-1">
							<Text className="text-white text-2xl font-bold">
								VIP Yearly Plan
							</Text>
							<Text className="text-xs font-semibold text-[#FFD700] uppercase tracking-widest">
								Premium Subscription
							</Text>
						</View>

						<Text className="px-3 py-1 rounded-full border border-green-400/40 bg-green-400/20 text-green-400 font-bold text-sm">
							ACTIVE
						</Text>
					</View>

					<View className="bg-linear-to-r from-yellow-400/0 via-yellow-400 to-yellow-400/0 h-0.5" />

					<View className="flex flex-row items-center justify-center gap-3">
						<View className="p-1.5 items-center bg-[#FFD700]/10 rounded-full">
							<CalendarRange size={15} color="#FFD700" />
						</View>

						<Text className="text-white text-sm">
							Next billing date:{" "}
							<Text>{status.vipExpiryDate()?.toDateString()}</Text>
						</Text>
					</View>
				</View>

				{/* Features List */}
				<View className="mx-6 mt-8 p-6 bg-[#1E293B66] rounded-2xl border border-[#FFFFFF14] gap-4">
					{features.map((feature) => (
						<View
							key={feature.title}
							className="flex flex-row items-start gap-3"
						>
							<View className="mt-0.5">
								<CheckCircle2 size={18} color="#FFD700" />
							</View>
							<Text className="text-white text-sm font-bold flex-1">
								{feature.title}{" "}
								{feature.subtitle && (
									<Text className="text-slate-400 font-medium">
										{feature.subtitle}
									</Text>
								)}
							</Text>
						</View>
					))}
				</View>

				{/* Footer Button and Links */}
				<View className="px-6 mt-10">
					<TouchableOpacity
						className="w-full bg-[#FFD700] h-16 rounded-2xl flex flex-row items-center justify-center gap-2 shadow-lg shadow-[#FFD70040]"
						activeOpacity={0.8}
					>
						<Settings size={20} color="#020617" />

						<Text className="text-[#020617] text-lg font-black">
							Manage Subscription
						</Text>
					</TouchableOpacity>

					<View className="flex flex-row justify-center gap-6 mt-6">
						<TouchableOpacity>
							<Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
								Cancel Subscription
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</UniSafeAreaView>
	);
};

export default VipPage;
