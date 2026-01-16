import { StyledSafeAreaView } from "@/core/customUniwind";
import { Text, View } from "react-native";

const Explore = () => {
	return (
		<StyledSafeAreaView className="h-full bg-white">
			<View className="px-4 font-lexend flex flex-row items-center justify-between gap-4 py-4 h-fit">
				<Text>Explore</Text>
			</View>
		</StyledSafeAreaView>
	);
};

export default Explore;
