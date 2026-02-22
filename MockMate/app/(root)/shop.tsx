import { PowerUpCard, ShopCard } from "@/components/Card";
import Header from "@/components/Header";
import { powerUpsData, shopCardData, status } from "@/constants/data";
import { UniSafeAreaView } from "@/core/customUniwind";
import { Gem, Zap } from "lucide-react-native";
import { FlatList, Text, View } from "react-native";

const Shop = () => {
	return (
		<UniSafeAreaView className="bg-white h-full">
			<Header
				middle={<Text className="text-lg text-black font-bold">Shop</Text>}
				end={
					<View className="flex flex-row w-fit items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 rounded-full border border-blue-100">
						<Gem size={20} color={"#3B82F6"} />
						<Text className="text-blue-600 font-bold text-xs">
							{status.gems}
						</Text>
					</View>
				}
			/>

			<View className="h-full bg-background px-4">
				<View>
					<FlatList
						data={Object.values(powerUpsData)}
						renderItem={({ item }) => <PowerUpCard key={item.id} card={item} />}
						keyExtractor={(item) => item.id.toString()}
						showsVerticalScrollIndicator={false}
						numColumns={2}
						columnWrapperClassName="flex justify-between"
						contentContainerClassName="flex gap-3 mt-3"
						ListHeaderComponent={
							<View>
								<FlatList
									data={Object.values(shopCardData)}
									renderItem={({ item }) => <ShopCard card={item} />}
									keyExtractor={(item) => item.id.toString()}
									horizontal={true}
									showsHorizontalScrollIndicator={false}
									bounces={false}
									contentContainerClassName="flex gap-3 mt-3"
								/>

								<View className="flex flex-row justify-start gap-2 mt-3">
									<Zap color={"#F59E0B"} size={24} />

									<Text className="text-xl font-bold text-black">
										Power-ups
									</Text>
								</View>
							</View>
						}
					/>
				</View>
			</View>
		</UniSafeAreaView>
	);
};

export default Shop;
