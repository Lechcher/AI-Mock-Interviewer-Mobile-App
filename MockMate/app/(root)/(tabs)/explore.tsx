import { Card } from "@/components/Card";
import Filter from "@/components/Filter";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { cardsData, status } from "@/constants/data";
import { UniSafeAreaView } from "@/core/customUniwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Gem } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

const Explore = () => {
	const router = useRouter();
	const params = useLocalSearchParams<{ search?: string; industry?: string }>();
	const [refreshing, setRefreshing] = useState(false);
	const [limit, setLimit] = useState(5);

	const filteredCards = useMemo(() => {
		return cardsData.filter((card) => {
			const matchesSearch = params.search
				? card.title.toLowerCase().includes(params.search.toLowerCase())
				: true;
			const matchesIndustry =
				params.industry && params.industry !== "All"
					? card.industry === params.industry
					: true;
			return matchesSearch && matchesIndustry;
		});
	}, [params.search, params.industry]);

	const onRefresh = () => {
		setRefreshing(true);
		setLimit(5);
		// Simulate a refresh operation
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	};

	const handleLoadMore = () => {
		if (limit < filteredCards.length) {
			setLimit((prev) => prev + 5);
		}
	};

	return (
		<UniSafeAreaView className="h-full bg-white">
			<Header
				middle={<Text className="text-lg text-black font-bold">Explore</Text>}
				end={
					<View className="flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 rounded-full border border-blue-100">
						<Gem size={20} color={"#3B82F6"} />
						<Text className="text-blue-600 font-bold text-xs">
							{status.gems}
						</Text>
					</View>
				}
			/>

			<View className="bg-background px-4">
				<FlatList
					data={filteredCards.slice(0, limit)}
					renderItem={({ item }) => (
						<Card
							card={item}
							onPress={() => router.push(`/properties/${item.id}`)}
						/>
					)}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					bounces={false}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					contentContainerClassName="gap-3 mt-3"
					contentContainerStyle={{ paddingBottom: 79 }}
					ListHeaderComponent={
						<>
							<SearchBar />
							<Filter />
						</>
					}
				/>
			</View>
		</UniSafeAreaView>
	);
};

export default Explore;
