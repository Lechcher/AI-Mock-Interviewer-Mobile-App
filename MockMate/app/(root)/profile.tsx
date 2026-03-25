import {
	Bell,
	CircleCheck,
	Crown,
	Flame,
	GraduationCap,
} from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { profileSettingsListData, status } from "@/constants/data";

import Header from "@/components/Header";
import SettingList from "@/components/SettingList";
import { UniSafeAreaView } from "@/core/customUniwind";
import { UniversalAvatar } from "@/components/UniversalAvatar";
import { useGlobalContext } from "@/core/global-provider";

const Profile = () => {
	const { user } = useGlobalContext();

	return (
		<UniSafeAreaView className="bg-white">
			<Header
				middle={<Text className="text-lg text-black font-bold">Profile</Text>}
				end={<Bell />}
			/>

			<View className="bg-background h-full">
				<ScrollView
					className="flex flex-col mb-35"
					contentContainerClassName="items-center p-4"
					showsVerticalScrollIndicator={false}
				>
					<View className="flex flex-col gap-4 items-center">
						<View className="relative aspect-square border-white border-4 rounded-full shadow-lg">
							<UniversalAvatar uri={user?.avatar} size={100} />

							<View className="absolute -bottom-1 right-0 bg-green-500 rounded-full p-1 border-4 border-white">
								<CircleCheck size={16} color="white" />
							</View>
						</View>

						<View className="flex flex-col items-center">
							<Text className="text-2xl font-bold">{user?.name}</Text>

							<Text className="font-medium text-dusk-blue">{user?.email}</Text>
						</View>

						<View className="flex flex-row gap-3 w-full justify-between items-center">
							<View className="flex-1 flex items-center justify-center p-4 gap-1 rounded-3xl bg-white border-2 border-slate-200 shadow">
								<View className="flex flex-row items-center gap-2">
									<Flame size={24} color={"#F97316"} />

									<Text className="text-orange-500 text-2xl font-bold">
										{status.streaks}
									</Text>
								</View>

								<Text className="text-dusk-blue text-sm font-bold uppercase tracking-wider">
									Day Streak
								</Text>
							</View>

							<View className="flex-1 flex items-center justify-center p-4 gap-1 rounded-3xl bg-white border-2 border-slate-200 shadow">
								<View className="flex flex-row items-center gap-2">
									<GraduationCap size={24} color={"#0D59F2"} />

									<Text className="text-primary-100 text-2xl font-bold">
										{status.hasLearned}
									</Text>
								</View>

								<Text className="text-dusk-blue text-sm font-bold uppercase tracking-wider">
									Interviews
								</Text>
							</View>
						</View>

						<View className="flex flex-row w-full items-center justify-between p-4 rounded-3xl bg-white border-2 border-slate-200 shadow">
							<Text className="text-sm font-bold uppercase text-dusk-blue">
								Total XP Earned
							</Text>

							<Text className="text-sm font-bold uppercase text-primary-100">
								{status.xpEarned} XP
							</Text>
						</View>
					</View>

					<View className="relative flex flex-row mt-8 w-full items-center justify-between p-4 rounded-3xl bg-linear-to-r from-primary-100 to-[#2563EB] shadow">
						<View className="absolute bottom-0.5 -right-8 bg-white/10 blur-xl" />

						<View className="flex flex-col gap-1">
							<View className="flex flex-row gap-2 items-center">
								<Crown size={24} color={"#FDE047"} />

								<Text className="text-lg font-bold text-white">
									{status.vipStatus ? "VIP Member" : "Go VIP"}
								</Text>
							</View>

							<Text className="text-sm font-bold text-white">
								{status.vipStatus
									? `Next billing date: ${status.vipExpiryDate()?.toDateString()}`
									: "Unlock unlimited AI interviews."}
							</Text>
						</View>

						<TouchableOpacity className="items-center justify-center px-4 py-2 bg-white rounded-full">
							<Text className="text-primary-100 text-sm font-bold">
								{status.vipStatus ? "Manage" : "Upgrade"}
							</Text>
						</TouchableOpacity>
					</View>

					<View className="w-full">
						<SettingList section={profileSettingsListData.career} />
						<SettingList section={profileSettingsListData.appSettings} />
						<SettingList section={profileSettingsListData.support} />
					</View>
				</ScrollView>
			</View>
		</UniSafeAreaView>
	);
};

export default Profile;
