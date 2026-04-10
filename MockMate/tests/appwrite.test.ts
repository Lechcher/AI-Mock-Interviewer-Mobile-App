/**
 * @file Unit tests for Appwrite configuration and services
 */

import { openAuthSessionAsync } from "expo-web-browser";

jest.mock("expo-linking", () => ({
	createURL: jest.fn(() => "app://redirect"),
}));

jest.mock("expo-web-browser", () => ({
	openAuthSessionAsync: jest.fn(),
}));

jest.mock("react-native-appwrite");

const setEnvVars = () => {
	process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT = "https://api.appwrite.test";
	process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID = "project-id";
	process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID = "bucket-id";
	process.env.EXPO_PUBLIC_BACKEND_URL = "https://backend.test";
};

const loadModule = () => {
	jest.resetModules();
	jest.clearAllMocks();
	setEnvVars();
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	return require("../core/appwrite") as typeof import("../core/appwrite");
};

describe("appwrite config and client setup", () => {
	test("uses environment variables to configure client", () => {
		const appwrite = loadModule();
		const clientInstance = (appwrite.client as unknown as jest.Mock).mock
			.results[0].value;

		expect(appwrite.config.endpoint).toBe("https://api.appwrite.test");
		expect(appwrite.config.projectId).toBe("project-id");
		expect(appwrite.config.bucketId).toBe("bucket-id");
		expect(clientInstance.setEndpoint).toHaveBeenCalledWith(
			"https://api.appwrite.test",
		);
		expect(clientInstance.setProject).toHaveBeenCalledWith("project-id");
	});

	test("exports all required services", () => {
		const appwrite = loadModule();

		expect(appwrite.client).toBeDefined();
		expect(appwrite.account).toBeDefined();
		expect(appwrite.avatar).toBeDefined();
		expect(appwrite.storage).toBeDefined();
	});
});

describe("login", () => {
	test("returns true on successful oauth and session creation", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createOAuth2Token: jest.Mock;
			createSession: jest.Mock;
		};

		mockAccount.createOAuth2Token.mockResolvedValue("https://auth");
		(openAuthSessionAsync as jest.Mock).mockResolvedValue({
			type: "success",
			url: "app://redirect?secret=sec&userId=uid",
		});
		mockAccount.createSession.mockResolvedValue({ $id: "session" });

		const result = await appwrite.login();

		expect(result).toBe(true);
		expect(mockAccount.createOAuth2Token).toHaveBeenCalledWith({
			provider: "google",
			success: "app://redirect",
		});
		expect(mockAccount.createSession).toHaveBeenCalledWith({
			userId: "uid",
			secret: "sec",
		});
	});

	test("returns false when browser flow fails", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createOAuth2Token: jest.Mock;
			createSession: jest.Mock;
		};

		mockAccount.createOAuth2Token.mockResolvedValue("https://auth");
		(openAuthSessionAsync as jest.Mock).mockResolvedValue({
			type: "cancel",
			url: "",
		});

		const result = await appwrite.login();

		expect(result).toBe(false);
	});

	test("returns false when OAuth token creation fails", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createOAuth2Token: jest.Mock;
		};

		mockAccount.createOAuth2Token.mockResolvedValue(null);

		const result = await appwrite.login();

		expect(result).toBe(false);
	});

	test("returns false when secret or userId is missing", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createOAuth2Token: jest.Mock;
			createSession: jest.Mock;
		};

		mockAccount.createOAuth2Token.mockResolvedValue("https://auth");
		(openAuthSessionAsync as jest.Mock).mockResolvedValue({
			type: "success",
			url: "app://redirect",
		});

		const result = await appwrite.login();

		expect(result).toBe(false);
	});

	test("returns false when session creation fails", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createOAuth2Token: jest.Mock;
			createSession: jest.Mock;
		};

		mockAccount.createOAuth2Token.mockResolvedValue("https://auth");
		(openAuthSessionAsync as jest.Mock).mockResolvedValue({
			type: "success",
			url: "app://redirect?secret=sec&userId=uid",
		});
		mockAccount.createSession.mockResolvedValue(null);

		const result = await appwrite.login();

		expect(result).toBe(false);
	});
});

describe("logout", () => {
	test("returns true on successful logout", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			deleteSession: jest.Mock;
		};

		mockAccount.deleteSession.mockResolvedValue(undefined);

		const result = await appwrite.logout();

		expect(result).toBe(true);
		expect(mockAccount.deleteSession).toHaveBeenCalledWith({
			sessionId: "current",
		});
	});

	test("returns false when logout fails", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			deleteSession: jest.Mock;
		};

		mockAccount.deleteSession.mockRejectedValue(new Error("Session not found"));

		const result = await appwrite.logout();

		expect(result).toBe(false);
	});
});

describe("getCurrentUser", () => {
	test("returns user object with avatar when user is authenticated", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			get: jest.Mock;
		};
		const mockAvatars = appwrite.avatar as unknown as {
			getInitialsURL: jest.Mock;
		};

		const mockUser = {
			$id: "user123",
			$createdAt: "2024-01-01",
			$updatedAt: "2024-01-01",
			name: "John Doe",
			email: "john@example.com",
			emailVerification: true,
			prefs: {},
		};

		mockAccount.get.mockResolvedValue(mockUser);
		mockAvatars.getInitialsURL.mockReturnValue(
			new URL("https://avatar.test/john"),
		);

		const result = await appwrite.getCurrentUser();

		expect(result).toEqual({
			...mockUser,
			avatar: "https://avatar.test/john",
		});
	});

	test("returns null when no user is authenticated", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			get: jest.Mock;
		};

		mockAccount.get.mockRejectedValue(new Error("User not found"));

		const result = await appwrite.getCurrentUser();

		expect(result).toBeNull();
	});

	test("returns null when user has no ID", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			get: jest.Mock;
		};

		mockAccount.get.mockResolvedValue({ $id: undefined });

		const result = await appwrite.getCurrentUser();

		expect(result).toBeNull();
	});
});

describe("syncProfileToBackend", () => {
	const mockFetch = jest.fn();

	beforeAll(() => {
		global.fetch = mockFetch as unknown as typeof fetch;
	});

	afterEach(() => {
		mockFetch.mockClear();
	});

	test("returns success response when sync is successful", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createJWT: jest.Mock;
		};

		const mockJWT = { jwt: "test-jwt-token" };
		mockAccount.createJWT.mockResolvedValue(mockJWT);

		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue({
				data: {
					id: "profile123",
					name: "John",
					avatarUrl: "https://avatar.test",
				},
			}),
		};
		mockFetch.mockResolvedValue(mockResponse);

		const result = await appwrite.syncProfileToBackend("/profile", {
			arg: { name: "John", avatar: "https://avatar.test" },
		});

		expect(result).toEqual({
			success: true,
			data: {
				id: "profile123",
				name: "John",
				avatarUrl: "https://avatar.test",
			},
		});
		expect(mockAccount.createJWT).toHaveBeenCalled();
		expect(mockFetch).toHaveBeenCalledWith(
			"https://backend.test/profile",
			expect.objectContaining({
				method: "PUT",
				headers: {
					Authorization: "Bearer test-jwt-token",
					"Content-Type": "application/json",
				},
			}),
		);
	});

	test("returns error response when backend request fails", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createJWT: jest.Mock;
		};

		const mockJWT = { jwt: "test-jwt-token" };
		mockAccount.createJWT.mockResolvedValue(mockJWT);

		const mockResponse = {
			ok: false,
			json: jest.fn().mockResolvedValue({
				error: "Profile not found",
			}),
		};
		mockFetch.mockResolvedValue(mockResponse);

		const result = await appwrite.syncProfileToBackend("/profile", {
			arg: { name: "John", avatar: "https://avatar.test" },
		});

		expect(result).toEqual({
			success: false,
			error: "Profile not found",
		});
	});

	test("returns error response when JWT creation fails", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			createJWT: jest.Mock;
		};

		mockAccount.createJWT.mockRejectedValue(new Error("JWT creation failed"));

		const result = await appwrite.syncProfileToBackend("/profile", {
			arg: { name: "John", avatar: "https://avatar.test" },
		});

		expect(result).toEqual({
			success: false,
			error: "JWT creation failed",
		});
	});
});

describe("uploadAvatarToAppwrite", () => {
	test("returns file URL on successful upload", async () => {
		const appwrite = loadModule();
		const mockStorage = appwrite.storage as unknown as {
			createFile: jest.Mock;
			getFileView: jest.Mock;
		};

		const mockFileId = "file123";
		mockStorage.createFile.mockResolvedValue({ $id: mockFileId });
		mockStorage.getFileView.mockReturnValue(
			new URL("https://storage.test/file123"),
		);

		const fileUri = "file:///path/to/avatar.jpg";
		const result = await appwrite.uploadAvatarToAppwrite(fileUri);

		expect(result).toBe("https://storage.test/file123");
		expect(mockStorage.createFile).toHaveBeenCalledWith({
			bucketId: "bucket-id",
			fileId: "unique-id",
			file: {
				uri: fileUri,
				name: expect.stringMatching(/^avatar_\d+\.jpg$/),
				type: "image/jpeg",
				size: 0,
			},
		});
	});

	test("returns null when upload fails", async () => {
		const appwrite = loadModule();
		const mockStorage = appwrite.storage as unknown as {
			createFile: jest.Mock;
		};

		mockStorage.createFile.mockRejectedValue(new Error("Upload failed"));

		const fileUri = "file:///path/to/avatar.jpg";
		const result = await appwrite.uploadAvatarToAppwrite(fileUri);

		expect(result).toBeNull();
	});

	test("returns null when getFileView fails", async () => {
		const appwrite = loadModule();
		const mockStorage = appwrite.storage as unknown as {
			createFile: jest.Mock;
			getFileView: jest.Mock;
		};

		const mockFileId = "file123";
		mockStorage.createFile.mockResolvedValue({ $id: mockFileId });
		mockStorage.getFileView.mockImplementation(() => {
			throw new Error("Get file view failed");
		});

		const fileUri = "file:///path/to/avatar.jpg";
		const result = await appwrite.uploadAvatarToAppwrite(fileUri);

		expect(result).toBeNull();
	});
});
