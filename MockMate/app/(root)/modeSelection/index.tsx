import { MessageSquare, Mic } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

import Header from "@/components/Header";
import { UniSafeAreaView } from "@/core/customUniwind";
import { router } from "expo-router";
import { useInterviewSetup } from "@/core/interviewContext";

const ModeSelection = () => {
	const { interviewMode, setInterviewMode } = useInterviewSetup();

	const handleModeSelect = (mode: "chat" | "voice") => {
		setInterviewMode(mode);

		if (mode === "chat") {
			router.push("/modeSelection/textMode");
		} else {
			router.push("/modeSelection/voiceMode");
		}
	};

	return (
		<UniSafeAreaView>
			<Header />

			<View className="p-4 h-full">
				<View className="flex-1 flex flex-col justify-between pb-6 mt-4">
					<View className="gap-6">
						<View className="justify-center items-center">
							<Text className="text-2xl font-bold text-center">
								How do you want to interview?
							</Text>
							<Text className="text-dusk-blue">
								Choose your preferred mode to start practicing.
							</Text>
						</View>

						<View className="flex-col gap-4">
							<TouchableOpacity
								onPress={() => handleModeSelect("chat")}
								className="p-8 items-center bg-white rounded-2xl shadow-lg"
							>
								<View className="p-5 bg-primary-100/10 rounded-4xl">
									<MessageSquare size={40} color={"#0D59F2"} />
								</View>

								<View className="items-center gap-1">
									<Text className="text-lg font-bold">Text Chat</Text>

									<Text className="text-center text-dusk-blue text-sm">
										Type your answers at your own pace. Great for refining your
										thought process.
									</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => handleModeSelect("voice")}
								className="p-8 items-center bg-white rounded-2xl shadow-lg"
							>
								<View className="p-5 bg-purple-600/10 rounded-4xl">
									<Mic size={40} color={"#9333EA"} />
								</View>

								<View className="items-center gap-1">
									<Text className="text-lg font-bold">Voice Call</Text>

									<Text className="text-center text-dusk-blue text-sm">
										Speak naturally for a realistic experience. Simulates a real
										video interview.
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</UniSafeAreaView>
	);
};

export default ModeSelection;
