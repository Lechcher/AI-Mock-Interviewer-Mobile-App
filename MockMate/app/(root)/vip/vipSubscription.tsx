import { vipPlanData } from "@/constants/data";
import { UniSafeAreaView } from "@/core/customUniwind";
import { useRouter } from "expo-router";
import { ArrowRight, CheckCircle2, Crown, X } from "lucide-react-native";
import { useState } from "react";
import {
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const VipPage = () => {
	const router = useRouter();
	const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly">(
		"yearly",
	);

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
				contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
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
						Unlock Your{"\n"}
						<Text className="text-[#FFD700]">Dream Job</Text>
					</Text>

					<Text className="text-slate-400 text-base text-center mt-4 px-4 font-medium">
						Upgrade to VIP for the ultimate career advantage.
					</Text>
				</View>

				{/* Subscription Plans */}
				<View className="px-6 mt-10 gap-4">
					{/* Yearly Plan */}
					<TouchableOpacity
						onPress={() => setSelectedPlan("yearly")}
						className={`relative p-5 rounded-2xl border-2 flex flex-row items-center justify-between ${
							selectedPlan === "yearly"
								? "border-[#FFD700] bg-[#1E293B66]"
								: "border-[#FFFFFF14] bg-[#FFFFFF0A]"
						}`}
					>
						{selectedPlan === "yearly" && (
							<View className="absolute -top-3 right-4 bg-[#FFD700] px-3 py-1 rounded-lg">
								<Text className="text-[#020617] text-[10px] font-black uppercase tracking-widest">
									Save{" "}
									{(
										(Number(vipPlanData.Yearly.priceDiscount) /
											Number(vipPlanData.Yearly.price)) *
										100
									).toString()}
									%
								</Text>
							</View>
						)}

						<View className="flex flex-row items-center gap-4">
							<View
								className={`size-6 rounded-full border-2 items-center justify-center ${
									selectedPlan === "yearly"
										? "border-[#FFD700] bg-[#FFD700]"
										: "border-slate-500"
								}`}
							>
								{selectedPlan === "yearly" && (
									<CheckCircle2 size={16} color="#020617" />
								)}
							</View>
							<View>
								<Text className="text-white text-lg font-bold">
									Yearly Plan
								</Text>
								<Text className="text-[#FFD700] text-xs font-semibold">
									Billed yearly (${vipPlanData.Yearly.priceDiscount.toFixed(2)})
								</Text>
							</View>
						</View>

						<View className="items-end">
							<Text className="text-white text-2xl font-black">
								$ {vipPlanData.Yearly.priceForEachMonth.toFixed(2)}
							</Text>
							<Text className="text-slate-500 text-[10px] uppercase font-bold">
								/ month
							</Text>
						</View>
					</TouchableOpacity>

					{/* Monthly Plan */}
					<TouchableOpacity
						onPress={() => setSelectedPlan("monthly")}
						className={`p-5 rounded-2xl border flex flex-row items-center justify-between ${
							selectedPlan === "monthly"
								? "border-[#FFD700] bg-[#1E293B66]"
								: "border-[#FFFFFF14] bg-[#FFFFFF0A]"
						}`}
					>
						<View className="flex flex-row items-center gap-4">
							<View
								className={`size-6 rounded-full border-2 items-center justify-center ${
									selectedPlan === "monthly"
										? "border-[#FFD700] bg-[#FFD700]"
										: "border-slate-500"
								}`}
							>
								{selectedPlan === "monthly" && (
									<CheckCircle2 size={16} color="#020617" />
								)}
							</View>
							<View>
								<Text className="text-white text-lg font-bold">
									Monthly Plan
								</Text>
								<Text className="text-slate-400 text-xs font-medium">
									Billed monthly
								</Text>
							</View>
						</View>

						<View className="items-end">
							<Text className="text-white text-2xl font-black">
								$ {vipPlanData.Monthly.price.toFixed(2)}
							</Text>
							<Text className="text-slate-500 text-[10px] uppercase font-bold">
								/ month
							</Text>
						</View>
					</TouchableOpacity>
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
						<Text className="text-[#020617] text-lg font-black">
							Start 7-Day Free Trial
						</Text>
						<ArrowRight size={20} color="#020617" strokeWidth={3} />
					</TouchableOpacity>

					<View className="flex flex-row justify-center gap-6 mt-6">
						<TouchableOpacity>
							<Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
								Restore Purchase
							</Text>
						</TouchableOpacity>
						<Text className="text-slate-700 text-[10px]">•</Text>
						<TouchableOpacity>
							<Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
								Terms of Service
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</UniSafeAreaView>
	);
};

export default VipPage;
