import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Account, Avatars, Client, ID, Storage } from "react-native-appwrite";

jest.mock("expo-linking", () => ({
	createURL: jest.fn(() => "app://redirect"),
}));

jest.mock("expo-web-browser", () => ({
	openAuthSessionAsync: jest.fn(),
}));

jest.mock("react-native-appwrite", () => {
	const createClient = () => ({
		setEndpoint: jest.fn().mockReturnThis(),
		setProject: jest.fn().mockReturnThis(),
	});

	const createAccount = () => ({
		createOAuth2Token: jest.fn(),
		createSession: jest.fn(),
		deleteSession: jest.fn(),
		get: jest.fn(),
		createJWT: jest.fn(),
	});

	const createAvatars = () => ({
		getInitialsURL: jest.fn(),
	});

	const createStorage = () => ({
		createFile: jest.fn(),
		getFileView: jest.fn(),
	});

	return {
		Client: jest.fn(() => createClient()),
		Account: jest.fn(() => createAccount()),
		Avatars: jest.fn(() => createAvatars()),
		TablesDB: jest.fn(() => ({})),
		Storage: jest.fn(() => createStorage()),
		ID: { unique: jest.fn(() => "unique-id") },
		OAuthProvider: { Google: "google" },
	};
});

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
	return require("./appwrite") as typeof import("./appwrite");
};

describe("appwrite config and client setup", () => {
	test("uses environment variables to configure client", () => {
		const appwrite = loadModule();
		const clientInstance = (Client as jest.Mock).mock.results[0].value;

		expect(appwrite.config.endpoint).toBe("https://api.appwrite.test");
		expect(appwrite.config.projectId).toBe("project-id");
		expect(appwrite.config.bucketId).toBe("bucket-id");
		expect(clientInstance.setEndpoint).toHaveBeenCalledWith(
			"https://api.appwrite.test",
		);
		expect(clientInstance.setProject).toHaveBeenCalledWith("project-id");
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
		expect(mockAccount.createSession).not.toHaveBeenCalled();
	});
});

describe("logout", () => {
	test("returns deletion result when successful", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			deleteSession: jest.Mock;
		};

		mockAccount.deleteSession.mockResolvedValue({ success: true });

		const result = await appwrite.logout();

		expect(result).toEqual({ success: true });
		expect(mockAccount.deleteSession).toHaveBeenCalledWith({
			sessionId: "current",
		});
	});

	test("returns false on deletion error", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as {
			deleteSession: jest.Mock;
		};

		mockAccount.deleteSession.mockRejectedValue(new Error("fail"));

		const result = await appwrite.logout();

		expect(result).toBe(false);
	});
});

describe("getCurrentUser", () => {
	test("returns user with avatar url when account exists", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as { get: jest.Mock };
		const mockAvatar = appwrite.avatar as unknown as {
			getInitialsURL: jest.Mock;
		};

		mockAccount.get.mockResolvedValue({ $id: "user-1", name: "Test User" });
		mockAvatar.getInitialsURL.mockReturnValue({ toString: () => "avatar-url" });

		const result = await appwrite.getCurrentUser();

		expect(result).toEqual({
			$id: "user-1",
			name: "Test User",
			avatar: "avatar-url",
		});
		expect(mockAvatar.getInitialsURL).toHaveBeenCalledWith("Test User");
	});

	test("returns null when fetch fails", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as { get: jest.Mock };

		mockAccount.get.mockRejectedValue(new Error("fail"));

		const result = await appwrite.getCurrentUser();

		expect(result).toBeNull();
	});
});

describe("syncProfileToBackend", () => {
	test("sends jwt and returns backend data when successful", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as { createJWT: jest.Mock };
		mockAccount.createJWT.mockResolvedValue({ jwt: "jwt-token" });

		const fetchMock = jest.fn(async () => ({
			ok: true,
			json: async () => ({ data: { synced: true } }),
		}));
		global.fetch = fetchMock as any;

		const result = await appwrite.syncProfileToBackend("/profile", {
			arg: { name: "Name", avatar: "avatar" },
		});

		expect(result).toEqual({ synced: true });
		expect(fetchMock).toHaveBeenCalledWith(
			"https://backend.test/profile",
			expect.objectContaining({
				method: "PUT",
				headers: expect.objectContaining({ Authorization: "Bearer jwt-token" }),
			}),
		);
	});

	test("returns false on backend error", async () => {
		const appwrite = loadModule();
		const mockAccount = appwrite.account as unknown as { createJWT: jest.Mock };
		mockAccount.createJWT.mockResolvedValue({ jwt: "jwt-token" });

		global.fetch = jest.fn(async () => ({
			ok: false,
			json: async () => ({ error: "bad" }),
		})) as any;

		const result = await appwrite.syncProfileToBackend("/profile", {
			arg: { name: "Name", avatar: "avatar" },
		});

		expect(result).toBe(false);
	});
});

describe("uploadAvatarToAppwrite", () => {
	test("uploads file and returns file view url", async () => {
		const appwrite = loadModule();
		const mockStorage = appwrite.storage as unknown as {
			createFile: jest.Mock;
			getFileView: jest.Mock;
		};

		mockStorage.createFile.mockResolvedValue({ $id: "file-1" });
		mockStorage.getFileView.mockReturnValue({ toString: () => "file-url" });

		const result = await appwrite.uploadAvatarToAppwrite("/tmp/avatar.jpg");

		expect(result).toBe("file-url");
		expect(mockStorage.createFile).toHaveBeenCalledWith({
			bucketId: "bucket-id",
			fileId: "unique-id",
			file: expect.objectContaining({ uri: "/tmp/avatar.jpg" }),
		});
		expect(mockStorage.getFileView).toHaveBeenCalledWith({
			bucketId: "bucket-id",
			fileId: "file-1",
		});
	});

	test("returns null when upload fails", async () => {
		const appwrite = loadModule();
		const mockStorage = appwrite.storage as unknown as {
			createFile: jest.Mock;
		};

		mockStorage.createFile.mockRejectedValue(new Error("fail"));

		const result = await appwrite.uploadAvatarToAppwrite("/tmp/avatar.jpg");

		expect(result).toBeNull();
	});
});

describe("ID helper", () => {
	test("uses ID.unique when creating file", async () => {
		const appwrite = loadModule();
		const mockStorage = appwrite.storage as unknown as {
			createFile: jest.Mock;
			getFileView: jest.Mock;
		};

		mockStorage.createFile.mockResolvedValue({ $id: "file-2" });
		mockStorage.getFileView.mockReturnValue({ toString: () => "file-url" });

		await appwrite.uploadAvatarToAppwrite("/tmp/avatar.jpg");

		expect(ID.unique as jest.Mock).toHaveBeenCalled();
	});
});
