import { industriesCategories } from "@/constants/data";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

const Filter = () => {
	const params = useLocalSearchParams<{ industry?: string }>();

	const [selectedIndustry, setSelectedIndustry] = useState(
		params.industry || "All",
	);

	const handleIndustryChange = (industry: string) => {
		if (industry === selectedIndustry) {
			setSelectedIndustry("All");
			router.setParams({ industry: "" });
			return;
		}

		setSelectedIndustry(industry);
		router.setParams({ industry });
	};

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="mt-3 mb-2"
		>
			{industriesCategories.map((industry) => (
				<TouchableOpacity
					key={industry.title}
					className={`flex flex-col items-start px-4 py-2 rounded-full border`}
					style={{
						backgroundColor:
							selectedIndustry === industry.title ? "#0F172A" : "#FFFFFF",
						borderColor:
							selectedIndustry === industry.title ? "#0F172A" : "#E2E8F0",
						marginRight: 5,
					}}
					onPress={() => handleIndustryChange(industry.title)}
				>
					<Text
						className={`text-sm text-medium`}
						style={{
							color:
								selectedIndustry === industry.title ? "#FFFFFF" : "#0F172A",
						}}
					>
						{industry.title}
					</Text>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

export default Filter;
