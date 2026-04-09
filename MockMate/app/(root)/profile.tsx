import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
	Bell,
	CircleCheck,
	Crown,
	Flame,
	GraduationCap,
} from "lucide-react-native";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "@/components/Header";
import SettingList from "@/components/SettingList";
import { UniversalAvatar } from "@/components/UniversalAvatar";
import { profileSettingsListData } from "@/constants/data";
import { uploadAvatarToAppwrite } from "@/core/appwrite";
import { UniSafeAreaView } from "@/core/customUniwind";
import { useGlobalContext } from "@/core/global-provider";
import { useProfile } from "@/hooks/useProfile";
import { useRevenueCat } from "@/hooks/useRevenueCat";
import { useSyncProfile } from "@/hooks/useSyncProfile";

const Profile = () => {
	const router = useRouter();
	const { user } = useGlobalContext();
	const { isPro, proExpiryDate, presentCustomerCenter, isPurchaseInProgress } =
		useRevenueCat();

	const { profile, isLoading } = useProfile();
	const { syncProfile, isSyncing } = useSyncProfile();

	const [isNameModalVisible, setNameModalVisible] = useState(false);
	const [newName, setNewName] = useState("");

	const handleMembershipPress = async () => {
		if (!isPro) {
			router.push("/vip/vipSubscription");
			return;
		}

		try {
			await presentCustomerCenter();
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Unable to open customer center.";
			Alert.alert("Subscription management error", message);
		}
	};

	const handleEditAvatar = async () => {
		const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permissions.granted) {
			Alert.alert("Permission to access media library is required!");
			return;
		}

		const pickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!pickerResult.canceled) {
			try {
				const originalUri = pickerResult.assets[0].uri;

				const compressedImage = await ImageManipulator.manipulateAsync(
					originalUri,
					[{ resize: { width: 500, height: 500 } }],
					{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
				);

				const uploadUri = await uploadAvatarToAppwrite(compressedImage.uri);

				if (uploadUri) {
					await syncProfile({
						name: profile?.name || user?.name || "MockMate User",
						avatar: uploadUri,
					});
				}
			} catch (error) {
				Alert.alert(`Error uploading avatar: ${error}`, "Please try again.");
			}
		}
	};

	const handleSaveName = async () => {
		if (newName.trim() === "") {
			Alert.alert("Name cannot be empty.");
			return;
		}

		try {
			await syncProfile({
				name: newName,
				avatar: profile?.avatar || user?.avatar || "",
			});
			setNameModalVisible(false);
		} catch (error) {
			Alert.alert(`Error updating name: ${error}`, "Please try again.");
		}
	};

	if (isLoading) {
		return (
			<UniSafeAreaView className="bg-white flex-1 items-center justify-center">
				<ActivityIndicator size="large" color="#2563EB" />
			</UniSafeAreaView>
		);
	}

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
							<TouchableOpacity onPress={handleEditAvatar} disabled={isSyncing}>
								{isSyncing ? (
									<ActivityIndicator size="small" color="#2563EB" />
								) : (
									<UniversalAvatar
										uri={profile?.avatar || user?.avatar}
										size={100}
									/>
								)}
							</TouchableOpacity>

							<View className="absolute -bottom-1 right-0 bg-green-500 rounded-full p-1 border-4 border-white">
								<CircleCheck size={16} color="white" />
							</View>
						</View>

						<View className="flex flex-col items-center">
							<TouchableOpacity
								onPress={() => {
									setNewName(profile?.name || user?.name || "");
									setNameModalVisible(true);
								}}
							>
								<Text className="text-2xl font-bold">
									{profile?.name || user?.name}
								</Text>
							</TouchableOpacity>

							<Text className="font-medium text-dusk-blue">
								{profile?.email || user?.email}
							</Text>
						</View>

						<View className="flex flex-row gap-3 w-full justify-between items-center">
							<View className="flex-1 flex items-center justify-center p-4 gap-1 rounded-3xl bg-white border-2 border-slate-200 shadow">
								<View className="flex flex-row items-center gap-2">
									<Flame size={24} color={"#F97316"} />

									<Text className="text-orange-500 text-2xl font-bold">
										{profile?.dayStreak || 0}
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
										{profile?.interviewsLearnedCount || 0}
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
								{profile?.totalXp || 0} XP
							</Text>
						</View>
					</View>

					<View className="relative flex flex-row mt-8 w-full items-center justify-between p-4 rounded-3xl bg-linear-to-r from-primary-100 to-[#2563EB] shadow">
						<View className="absolute bottom-0.5 -right-8 bg-white/10 blur-xl" />

						<View className="flex flex-col gap-1">
							<View className="flex flex-row gap-2 items-center">
								<Crown size={24} color={"#FDE047"} />

								<Text className="text-lg font-bold text-white">
									{isPro ? "MockMate! Pro" : "Go Pro"}
								</Text>
							</View>

							<Text className="text-sm font-bold text-white">
								{isPro
									? `Next billing date: ${proExpiryDate ? new Date(proExpiryDate).toDateString() : "N/A"}`
									: "Unlock unlimited AI interviews."}
							</Text>
						</View>

						<TouchableOpacity
							onPress={handleMembershipPress}
							disabled={isPurchaseInProgress}
							className="items-center justify-center px-4 py-2 bg-white rounded-full"
						>
							<Text className="text-primary-100 text-sm font-bold">
								{isPro ? "Manage" : "Upgrade"}
							</Text>
						</TouchableOpacity>
					</View>

					<View className="w-full">
						<SettingList section={profileSettingsListData.career} />
						<SettingList section={profileSettingsListData.appSettings} />
						<SettingList section={profileSettingsListData.support} />
					</View>
				</ScrollView>

				<Modal visible={isNameModalVisible} transparent animationType="fade">
					<View className="flex-1 bg-black/50 justify-center items-center px-4">
						<View className="bg-white p-6 rounded-3xl w-full">
							<Text className="text-lg font-bold mb-4">Edit Display Name</Text>
							<TextInput
								className="border border-slate-200 rounded-xl p-4 mb-6 text-base"
								value={newName}
								onChangeText={setNewName}
								placeholder="Enter new name"
								autoFocus
							/>
							<View className="flex flex-row justify-end gap-4">
								<TouchableOpacity
									onPress={() => setNameModalVisible(false)}
									className="px-4 py-2"
								>
									<Text className="text-slate-500 font-semibold">Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleSaveName}
									className="bg-primary-100 px-6 py-2 rounded-full flex-row items-center"
									disabled={isSyncing}
								>
									{isSyncing ? (
										<ActivityIndicator color="white" size="small" />
									) : (
										<Text className="text-white font-bold">Save</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		</UniSafeAreaView>
	);
};

export default Profile;
