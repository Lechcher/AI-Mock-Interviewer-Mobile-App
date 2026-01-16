import BottomSheet, {
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import { type ReactNode, useCallback } from "react";
import { TouchableOpacity, View } from "react-native";

interface BottomSheetPopupProps {
	children: ReactNode;
	bottomSheetPopupRef: React.RefObject<BottomSheet | null>;
	snapPoints?: (string | number)[];
	handleBottomSheetPopupClose: () => void;
}

const BottomSheetPopup = ({
	children,
	bottomSheetPopupRef,
	snapPoints,
	handleBottomSheetPopupClose,
}: BottomSheetPopupProps) => {
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				opacity={0.6}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
				style={[props.style, { backgroundColor: "#111827" }]}
			/>
		),
		[],
	);

	return (
		<BottomSheet
			ref={bottomSheetPopupRef}
			index={-1}
			snapPoints={snapPoints}
			enablePanDownToClose={true}
			backdropComponent={renderBackdrop}
			handleIndicatorStyle={{
				backgroundColor: "#D9D9D9",
				width: 48,
				height: 6,
			}}
			containerStyle={{
				borderTopLeftRadius: 32,
				borderTopRightRadius: 32,
			}}
			style={{ padding: 16 }}
		>
			<BottomSheetView className="relative flex-col items-center gap-8">
				<View className="absolute" style={{ top: 0, right: 20 }}>
					<TouchableOpacity onPress={() => handleBottomSheetPopupClose()}>
						<X size={24} color={"#9CA3AF"} />
					</TouchableOpacity>
				</View>

				<View>{children}</View>
			</BottomSheetView>
		</BottomSheet>
	);
};

export default BottomSheetPopup;
