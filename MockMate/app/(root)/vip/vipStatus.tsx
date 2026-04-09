import { useRouter } from "expo-router";
import {
	CalendarRange,
	CheckCircle2,
	Crown,
	Settings,
	X,
} from "lucide-react-native";
import {
	Alert,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { UniSafeAreaView } from "@/core/customUniwind";
import { useRevenueCat } from "@/hooks/useRevenueCat";

const VipStatusPage = () => {
	const router = useRouter();
	const {
		isPro,
		proEntitlementIdentifier,
		proExpiryDate,
		presentCustomerCenter,
		isPurchaseInProgress,
	} = useRevenueCat();

	const features = [
		{ title: "Unlimited Interviews", subtitle: "No daily cap" },
		{ title: "Create Custom Interviews", subtitle: "Fully unlocked" },
		{ title: "Deep AI Feedback", subtitle: "Premium quality" },
		{ title: "Premium Voices", subtitle: "All available voices" },
		{ title: "Ad-Free Experience", subtitle: "No interruptions" },
	];

	const expiryDateLabel = proExpiryDate
		? new Date(proExpiryDate).toDateString()
		: "N/A";

	const handleManageSubscription = async () => {
		try {
			await presentCustomerCenter();
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to open customer center.";
			Alert.alert("Customer Center error", message);
		}
	};

	return (
		<UniSafeAreaView className="relative flex-1 bg-[#020617]">
			<StatusBar barStyle="light-content" />

			<ScrollView
				contentContainerClassName="flex-grow pb-10"
				showsVerticalScrollIndicator={false}
			>
				<View className="px-6 pt-4 flex flex-row justify-end">
					<TouchableOpacity
						onPress={() => router.back()}
						className="p-2 bg-[#FFFFFF0A] rounded-full border border-[#FFFFFF14]"
					>
						<X size={20} color="#FFFFFF99" />
					</TouchableOpacity>
				</View>

				<View className="items-center px-6 mt-4">
					<Crown size={80} color="#FFD700" />

					<Text className="text-white text-4xl font-extrabold text-center leading-tight mt-6">
						{isPro ? (
							<>
								You are a <Text className="text-[#FFD700]">MockMate! Pro</Text>{" "}
								member
							</>
						) : (
							<>
								You are on <Text className="text-[#FFD700]">Free</Text> plan
							</>
						)}
					</Text>

					<Text className="text-slate-400 text-base text-center mt-4 px-4 font-medium">
						{isPro
							? "Manage your subscription from RevenueCat Customer Center."
							: "Upgrade to unlock all premium interview preparation features."}
					</Text>
				</View>

				<View className="flex flex-col mx-6 mt-8 p-6 gap-4 border-2 rounded-2xl border-[#FFD700]">
					<View className="flex flex-row items-start justify-between">
						<View className="gap-1">
							<Text className="text-white text-2xl font-bold">
								{isPro ? "MockMate! Pro" : "Free Plan"}
							</Text>
							<Text className="text-xs font-semibold text-[#FFD700] uppercase tracking-widest">
								Entitlement: {proEntitlementIdentifier || "Inactive"}
							</Text>
						</View>

						<Text
							className={`px-3 py-1 rounded-full border font-bold text-sm ${
								isPro
									? "border-green-400/40 bg-green-400/20 text-green-400"
									: "border-slate-400/40 bg-slate-400/20 text-slate-300"
							}`}
						>
							{isPro ? "ACTIVE" : "INACTIVE"}
						</Text>
					</View>

					<View className="bg-linear-to-r from-yellow-400/0 via-yellow-400 to-yellow-400/0 h-0.5" />

					<View className="flex flex-row items-center justify-center gap-3">
						<View className="p-1.5 items-center bg-[#FFD700]/10 rounded-full">
							<CalendarRange size={15} color="#FFD700" />
						</View>

						<Text className="text-white text-sm">
							Next billing date: <Text>{expiryDateLabel}</Text>
						</Text>
					</View>
				</View>

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
								<Text className="text-slate-400 font-medium">
									({feature.subtitle})
								</Text>
							</Text>
						</View>
					))}
				</View>

				<View className="px-6 mt-10">
					{isPro ? (
						<TouchableOpacity
							onPress={handleManageSubscription}
							disabled={isPurchaseInProgress}
							className="w-full bg-[#FFD700] h-16 rounded-2xl flex flex-row items-center justify-center gap-2"
						>
							<Settings size={20} color="#020617" />
							<Text className="text-[#020617] text-lg font-black">
								Manage Subscription
							</Text>
						</TouchableOpacity>
					) : (
						<TouchableOpacity
							onPress={() => router.push("/vip/vipSubscription")}
							className="w-full bg-[#FFD700] h-16 rounded-2xl flex items-center justify-center"
						>
							<Text className="text-[#020617] text-lg font-black">
								Upgrade to Pro
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
		</UniSafeAreaView>
	);
};

export default VipStatusPage;
