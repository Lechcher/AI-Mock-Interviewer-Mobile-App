module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
	testMatch: ["**/?(*.)+(spec|test).ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
	moduleNameMapper: {
		"react-native-appwrite":
			"<rootDir>/tests/__mocks__/react-native-appwrite.js",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(react-native|@react-native|expo|expo-linking|expo-web-browser)/)",
	],
};
