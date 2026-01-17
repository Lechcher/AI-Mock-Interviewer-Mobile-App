import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

interface HeaderProps {
	middle: ReactNode;
	end: ReactNode;
}

const Header = ({ middle, end }: HeaderProps) => {
	const navigation = useNavigation();

	const handleBack = () => {
		navigation.goBack();
	};

	return (
		<View className="px-4 font-lexend flex flex-row items-center justify-between gap-4 py-4 h-fit">
			<TouchableOpacity onPress={handleBack}>
				<ChevronLeft size={40} color={"#0F172A"} strokeWidth={2} />
			</TouchableOpacity>

			{middle}

			{end}
		</View>
	);
};

export default Header;
