import { useRouter } from "expo-router";
import { ArrowRight, Crown, Loader2, RefreshCw, X } from "lucide-react-native";
import { useMemo, useState } from "react";
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

type Plan = "yearly" | "monthly";

const PLAN_LABELS: Record<Plan, string> = {
	yearly: "Yearly",
	monthly: "Monthly",
};

const VipSubscriptionPage = () => {
	const router = useRouter();
	const {
		yearlyPackage,
		monthlyPackage,
		purchasePlan,
		restorePurchases,
		isPurchaseInProgress,
		isLoading,
		presentPaywall,
	} = useRevenueCat();

	const [selectedPlan, setSelectedPlan] = useState<Plan>("yearly");

	const plans = useMemo(
		() => ({ yearly: yearlyPackage, monthly: monthlyPackage }),
		[yearlyPackage, monthlyPackage],
	);

	const selectedPackage = plans[selectedPlan];

	const handlePurchase = async () => {
		if (!selectedPackage) {
			Alert.alert(
				"Plan not available",
				"This plan is not configured in RevenueCat offering yet. Please verify offering package identifiers yearly and monthly.",
			);
			return;
		}

		try {
			const customerInfo = await purchasePlan(selectedPlan);

			if (customerInfo) {
				Alert.alert(
					"Purchase successful",
					"MockMate! Pro is now active on your account.",
				);
				router.replace("/vip/vipStatus");
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to complete purchase.";
			Alert.alert("Purchase failed", message);
		}
	};

	const handleRestore = async () => {
		try {
			const customerInfo = await restorePurchases();
			if (
				customerInfo &&
				Object.keys(customerInfo.entitlements.active).length > 0
			) {
				Alert.alert("Restore completed", "Your purchases were restored.");
				router.replace("/vip/vipStatus");
			} else {
				Alert.alert(
					"No active purchases",
					"No active subscription entitlement was found for this account.",
				);
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to restore purchases.";
			Alert.alert("Restore failed", message);
		}
	};

	const handlePaywall = async () => {
		try {
			const result = await presentPaywall();
			if (result) {
				Alert.alert("Paywall result", result.toString());
				if (result === "PURCHASED" || result === "RESTORED") {
					router.replace("/vip/vipStatus");
				}
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Unable to open paywall.";
			Alert.alert("Paywall error", message);
		}
	};

	const features = [
		"Unlimited interviews",
		"Custom interview generation",
		"Advanced AI feedback",
		"Premium voices",
		"No ads",
	];

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
						Unlock <Text className="text-[#FFD700]">MockMate! Pro</Text>
					</Text>
					<Text className="text-slate-400 text-base text-center mt-4 px-4 font-medium">
						Choose a subscription plan or present RevenueCat Paywall.
					</Text>
				</View>

				<View className="px-6 mt-8 gap-4">
					{(["yearly", "monthly"] as const).map((plan) => {
						const pkg = plans[plan];
						const selected = selectedPlan === plan;
						return (
							<TouchableOpacity
								key={plan}
								onPress={() => setSelectedPlan(plan)}
								className={`p-5 rounded-2xl border-2 flex flex-row items-center justify-between ${
									selected
										? "border-[#FFD700] bg-[#1E293B66]"
										: "border-[#FFFFFF14] bg-[#FFFFFF0A]"
								}`}
							>
								<View>
									<Text className="text-white text-lg font-bold">
										{PLAN_LABELS[plan]} Plan
									</Text>
									<Text className="text-slate-400 text-xs font-medium mt-1">
										Identifier: {pkg?.identifier ?? "Missing in offering"}
									</Text>
								</View>

								<View className="items-end">
									<Text className="text-white text-2xl font-black">
										{pkg?.product.priceString ?? "N/A"}
									</Text>
									<Text className="text-slate-500 text-[10px] uppercase font-bold">
										{plan === "yearly" ? "annual" : "monthly"}
									</Text>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>

				<View className="mx-6 mt-8 p-6 bg-[#1E293B66] rounded-2xl border border-[#FFFFFF14] gap-3">
					{features.map((feature) => (
						<Text key={feature} className="text-white text-sm font-semibold">
							- {feature}
						</Text>
					))}
				</View>

				<View className="px-6 mt-8 gap-3">
					<TouchableOpacity
						onPress={handlePurchase}
						disabled={isLoading || isPurchaseInProgress}
						className="w-full bg-[#FFD700] h-16 rounded-2xl flex flex-row items-center justify-center gap-2"
					>
						{isPurchaseInProgress ? (
							<Loader2 size={20} color="#020617" />
						) : (
							<ArrowRight size={20} color="#020617" strokeWidth={3} />
						)}
						<Text className="text-[#020617] text-lg font-black">
							Start {PLAN_LABELS[selectedPlan]} Subscription
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handlePaywall}
						disabled={isLoading || isPurchaseInProgress}
						className="w-full bg-[#334155] h-14 rounded-2xl flex flex-row items-center justify-center"
					>
						<Text className="text-white text-base font-bold">
							Present RevenueCat Paywall
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={handleRestore}
						disabled={isLoading || isPurchaseInProgress}
						className="w-full h-12 rounded-2xl border border-[#FFFFFF20] flex flex-row items-center justify-center gap-2"
					>
						<RefreshCw size={16} color="#94A3B8" />
						<Text className="text-slate-300 text-sm font-bold uppercase tracking-wider">
							Restore Purchases
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</UniSafeAreaView>
	);
};

export default VipSubscriptionPage;
