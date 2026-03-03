import { Text, TouchableOpacity, View } from "react-native";

import { ChevronRight } from "lucide-react-native";
import type { profileSettingsListData } from "@/constants/data";

interface SettingItemProps {
	item: (typeof profileSettingsListData)[keyof typeof profileSettingsListData]["items"][number];
	isLast?: boolean;
}

const SettingItem = ({ item, isLast }: SettingItemProps) => {
	const title = item.titleItem;
	const Icon = item.icon;
	const iconColor = "iconColor" in item ? item.iconColor : "#4B5563";

	const isLogout = item.titleItem.toLowerCase() === "log out";

	return (
		<TouchableOpacity
			onPress={item.onPress}
			className={`flex flex-row items-center justify-between py-3`}
			style={{
				borderBottomWidth: !isLast ? 1 : 0,
				borderBottomColor: "#E5E7EB",
			}}
		>
			<View className="flex flex-row items-center gap-3">
				<View
					className={`size-10 flex items-center justify-center`}
					style={{
						backgroundColor:
							"iconColor" in item ? `${item.iconColor}1A` : "#4B55631A",
						borderRadius: 16,
					}}
				>
					<Icon size={24} color={iconColor} />
				</View>

				<Text
					className={"text-base font-semibold"}
					style={{
						color: isLogout ? "#EF4444" : "#111827",
					}}
				>
					{title}
				</Text>
			</View>

			<View className="flex flex-row items-center gap-2">
				{"currentLanguage" in item && (
					<Text className="text-sm font-medium text-slate-500">
						{item.currentLanguage}
					</Text>
				)}

				<ChevronRight size={24} color={"#9CA3AF"} />
			</View>
		</TouchableOpacity>
	);
};

export default SettingItem;
