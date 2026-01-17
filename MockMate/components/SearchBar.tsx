import { router, useLocalSearchParams, usePathname } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = () => {
	const path = usePathname();

	const params = useLocalSearchParams<{ search?: string }>();

	const [search, setSearch] = useState(params.search);

	const debouncedSearch = useDebouncedCallback((text: string) => {
		router.setParams({ search: text });
	}, 500);

	const handleSearch = (text: string) => {
		setSearch(text);
		debouncedSearch(text);
	};

	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				paddingVertical: 6,
				paddingLeft: 8,
				paddingRight: 20,
				backgroundColor: "white",
				borderWidth: 1,
				borderRadius: 100,
				borderColor: "#E2E8F0",
				marginVertical: 12,
			}}
		>
			<Search size={24} color={"#94A3B8"} />

			<TextInput
				value={search}
				onChangeText={handleSearch}
				placeholder="Search for interviews..."
				className="text-sm text-black-300 flex-1"
				placeholderTextColor="#E2E8F0"
			/>
		</View>
	);
};

export default SearchBar;
