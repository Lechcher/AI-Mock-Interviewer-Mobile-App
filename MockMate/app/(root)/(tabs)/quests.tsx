import { QuestCard } from "@/components/Card";
import Header from "@/components/Header";
import { questData, status } from "@/constants/data";
import { UniSafeAreaView } from "@/core/customUniwind";
import { Flame, Gem } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Text, View } from "react-native";

const TimeBox = ({ value, label }: { value: string; label: string }) => (
	<View className="flex flex-col items-center gap-1 flex-1">
		<View className="bg-white border border-slate-100 rounded-2xl shadow-sm w-full h-[55px] flex items-center justify-center">
			<Text className="text-slate-900 font-bold text-lg">{value}</Text>
		</View>
		<Text className="text-slate-500 font-bold text-[10px] uppercase">
			{label}
		</Text>
	</View>
);

const Quests = () => {
	const [timeLeft, setTimeLeft] = useState({
		hours: "00",
		minutes: "00",
		seconds: "00",
	});

	const randomQuests = useMemo(() => {
		const allQuests = Object.values(questData);
		return [...allQuests].sort(() => 0.5 - Math.random()).slice(0, 3);
	}, []);

	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();
			// Calculate the end of the current day (23:59:59.999)
			const endOfDay = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				23,
				59,
				59,
				999,
			);

			const diff = endOfDay.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
				return;
			}

			// Calculate hours, minutes, seconds from the difference
			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeLeft({
				hours: hours.toString().padStart(2, "0"),
				minutes: minutes.toString().padStart(2, "0"),
				seconds: seconds.toString().padStart(2, "0"),
			});
		};

		updateTimer();
		const timer = setInterval(updateTimer, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<UniSafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
			<Header
				middle={<Text className="text-lg font-bold">Daily Quests</Text>}
				end={
					<View className="flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 rounded-full border border-blue-100">
						<Gem size={20} color={"#3B82F6"} />
						<Text className="text-blue-600 font-bold text-xs">
							{status.gems}
						</Text>
					</View>
				}
			/>

			<View className="bg-background px-4 h-full overflow-visible">
				<View className="flex flex-row justify-between items-center mb-4 mt-4">
					<Text className="uppercase text-xs font-bold text-slate-500">
						Resets in
					</Text>

					<View className="flex flex-row items-center gap-1">
						<Flame color={"#F97316"} size={20} />

						<Text className="text-orange-500 font-bold text-xs">
							{status.streaks} {status.streaks > 1 ? "Days" : "Day"} Streak
						</Text>
					</View>
				</View>

				<View className="flex flex-row gap-4 mb-8">
					<TimeBox value={timeLeft.hours} label="Hours" />
					<TimeBox value={timeLeft.minutes} label="Minutes" />
					<TimeBox value={timeLeft.seconds} label="Seconds" />
				</View>

				<FlatList
					data={randomQuests}
					renderItem={({ item }) => <QuestCard card={item} />}
					keyExtractor={(item) => item.title}
					showsVerticalScrollIndicator={false}
					contentContainerClassName="flex gap-3 mt-3"
					contentContainerStyle={{ paddingBottom: 79 }}
				/>
			</View>
		</UniSafeAreaView>
	);
};

export default Quests;
