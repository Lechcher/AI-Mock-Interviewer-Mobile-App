import { router } from "expo-router";
import { BadgeCheck, Check, Minus, Plus, Sparkles } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "@/components/Header";
import { difficulties, industries } from "@/constants/data";
import { UniSafeAreaView, UniScrollView } from "@/core/customUniwind";
import { useRevenueCat } from "@/hooks/useRevenueCat";

const NewInterview = () => {
	const { isPro } = useRevenueCat();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: "",
			focusArea: "",
			industry: "",
			difficulty: "Easy",
			questionCount: 5,
		},
	});

	const onSubmit = (data: any) => {
		console.log("Form Data: ", data);
		Alert.alert(
			"Interview created successfully!",
			JSON.stringify(data, null, 2),
		);
	};

	return (
		<UniSafeAreaView className="flex-1 bg-white">
			<Header
				middle={<Text className="text-lg font-bold">New Interview</Text>}
				end={
					<TouchableOpacity onPress={() => router.push("/vip/vipStatus")}>
						<View
							className={`flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 rounded-full border ${
								isPro
									? "bg-yellow-50 border-yellow-100"
									: "bg-slate-50 border-slate-100"
							}`}
						>
							<BadgeCheck
								size={20}
								color={`${isPro ? "#EAB308" : "#6B7280"}`}
							/>
							<Text
								className={`${
									isPro ? "text-yellow-600" : "text-slate-600"
								} font-bold text-xs`}
							>
								PRO
							</Text>
						</View>
					</TouchableOpacity>
				}
			/>

			<View className="bg-background flex-1 px-4">
				<UniScrollView
					contentContainerClassName="flex flex-1 flex-col items-center justify-between pb-6 mt-4"
					showsVerticalScrollIndicator={false}
				>
					<View className="w-full flex flex-col gap-2">
						<View>
							<Text className="text-lg font-bold">Interview Title</Text>

							<Controller
								control={control}
								name="title"
								rules={{
									required: "Interview title is required",
									maxLength: 50,
									validate: (value) => value.trim() !== "",
								}}
								render={({ field: { onChange, value } }) => (
									<TextInput
										className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:border-primary-100"
										placeholder="e.g., Senior Frontend Developer"
										value={value}
										onChangeText={onChange}
									/>
								)}
							/>

							{errors.title && (
								<Text className="text-red-500 text-sm">
									{errors.title.message}
								</Text>
							)}
						</View>

						<View>
							<Text className="text-lg font-bold">Focus Area</Text>

							<Controller
								control={control}
								name="focusArea"
								rules={{
									required: "Focus area is required",
									validate: (value) => value.trim() !== "",
								}}
								render={({ field: { onChange, value } }) => (
									<TextInput
										className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:border-primary-100"
										placeholder="e.g., Focus on React Hooks, Redux, and
System Design..."
										multiline
										numberOfLines={4}
										textAlignVertical="top"
										value={value}
										onChangeText={onChange}
									/>
								)}
							/>
						</View>

						<View>
							<Text className="text-lg font-bold">Work Industry</Text>

							<Controller
								control={control}
								name="industry"
								rules={{
									required: "Work industry is required",
									validate: (value) => value.trim() !== "",
								}}
								render={({ field: { onChange, value } }) => (
									<View className="flex flex-row flex-wrap gap-1">
										{Object.values(industries).map((industry) => (
											<TouchableOpacity
												key={industry.title}
												className={`border rounded-xl px-4 py-2 mb-2 ${
													value === industry.title
														? "bg-primary-100 border-blue-50"
														: "bg-white border-slate-200"
												}`}
												onPress={() => onChange(industry.title)}
											>
												<View className="flex flex-row items-center gap-3">
													{value === industry.title && (
														<Check size={16} color="#FFFFFF" />
													)}

													<Text
														className={`${value === industry.title ? "text-white" : "text-slate-900"} text-sm font-semibold`}
													>
														{industry.title}
													</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								)}
							/>
						</View>

						<View>
							<Text className="text-lg font-bold">Difficulty Level</Text>

							<Controller
								control={control}
								name="difficulty"
								rules={{
									required: "Difficulty level is required",
									validate: (value) => value.trim() !== "",
								}}
								render={({ field: { onChange, value } }) => (
									<View className="flex flex-row flex-nowrap justify-between items-center gap-1">
										{Object.values(difficulties).map((difficulty) => (
											<TouchableOpacity
												key={difficulty.title}
												className={`flex-1 items-center justify-center border rounded-xl py-3 ${
													value === difficulty.title
														? "bg-primary-100 border-blue-50"
														: "bg-white border-slate-200"
												}`}
												onPress={() => onChange(difficulty.title)}
											>
												<View className="flex flex-row items-center gap-2">
													{value === difficulty.title && (
														<Check size={16} color="#FFFFFF" />
													)}
													<Text
														className={`${value === difficulty.title ? "text-white" : "text-slate-900"} text-sm font-semibold`}
													>
														{difficulty.title}
													</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								)}
							/>
						</View>

						<View>
							<Controller
								control={control}
								name="questionCount"
								render={({ field: { onChange, value } }) => (
									<View className="flex flex-row items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
										<View className="flex-1">
											<Text className="text-lg font-bold">
												Number of Questions
											</Text>
											<Text className="text-xs text-[#49659C]">
												Estimated time: ~{value * 3} min
											</Text>
										</View>

										<View className="flex flex-row items-center justify-center bg-blue-100 rounded-lg gap-3 p-1">
											<TouchableOpacity
												className="p-2 bg-primary-100 rounded-lg"
												onPress={() => value > 1 && onChange(value - 1)}
											>
												<Minus color={"#FFFFFF"} size={24} />
											</TouchableOpacity>

											<View>
												<Text className="text-xl font-bold text-[#49659C]">
													{value}
												</Text>
											</View>

											<TouchableOpacity
												className="p-2 bg-primary-100 rounded-lg"
												onPress={() => onChange(value + 1)}
											>
												<Plus color={"#FFFFFF"} size={24} />
											</TouchableOpacity>
										</View>
									</View>
								)}
							/>
						</View>
					</View>

					<View className="w-full flex flex-col gap-3">
						<TouchableOpacity
							onPress={handleSubmit(onSubmit)}
							className="bg-primary-100 rounded-xl py-4 items-center justify-center shadow-lg shadow-primary-100/25 mt-6"
						>
							<Text className="text-white ">Start Practice Interview</Text>
						</TouchableOpacity>

						<View className="flex flex-row items-center justify-center gap-1.5">
							<Sparkles size={18} color={"#EAB308"} />

							<Text className="text-sm text-center text-[#49659C]">
								AI-Powered Generation
							</Text>
						</View>
					</View>
				</UniScrollView>
			</View>
		</UniSafeAreaView>
	);
};

export default NewInterview;
