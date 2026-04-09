module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
	testMatch: ["**/?(*.)+(spec|test).ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
