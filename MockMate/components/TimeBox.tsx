import { Text, View } from "react-native";

const TimeBox = ({ value, label }: { value: string; label: string }) => (
	<View className="flex flex-col items-center gap-1 flex-1">
		<View className="bg-white border border-slate-100 rounded-2xl shadow-sm w-full py-4 flex items-center justify-center">
			<Text className="text-slate-900 font-bold text-lg">{value}</Text>
		</View>
		<Text className="text-slate-500 font-bold text-[10px] uppercase">
			{label}
		</Text>
	</View>
);

export default TimeBox;
