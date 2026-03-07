import { Text } from "react-native";
import { UniSafeAreaView } from "@/core/customUniwind";
import { useInterviewSetup } from "@/core/interviewContext";

const voiceMode = () => {
	const { interviewData, interviewMode } = useInterviewSetup();

	return (
		<UniSafeAreaView>
			<Text>Interview: {interviewData.title}</Text>
			<Text>Difficulty: {interviewData.difficulty}</Text>
			<Text>Mode: {interviewMode}</Text>
		</UniSafeAreaView>
	);
};

export default voiceMode;
