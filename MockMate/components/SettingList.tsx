import { Text, View } from "react-native";

import SettingItem from "./SettingItem";
import type { profileSettingsListData } from "@/constants/data";

interface SettingListProps {
	section: {
		title: string;
		items: (typeof profileSettingsListData)[keyof typeof profileSettingsListData]["items"];
	};
}

const SettingList = ({ section }: SettingListProps) => {
	return (
		<View>
			<Text className="text-sm font-bold text-dusk-blue uppercase tracking-wider mt-4 mb-2">
				{section.title}
			</Text>

			<View className="px-4 py-1 bg-white rounded-2xl shadow border border-slate-200">
				{section.items.map((item, index) => (
					<SettingItem
						key={item.titleItem}
						item={item}
						isLast={index === section.items.length - 1}
					/>
				))}
			</View>
		</View>
	);
};

export default SettingList;
