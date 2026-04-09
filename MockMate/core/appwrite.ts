/**
 * @file This file contains the configuration and service initialization for interacting with the Appwrite backend.
 * It includes functions for authentication, database operations, and avatar generation.
 */

/** biome-ignore-all lint/style/noNonNullAssertion: Force import data from environment constants */
/** biome-ignore-all lint/correctness/noUnreachable: Only show error log. */

import * as Linking from "expo-linking";

import {
	Account,
	Avatars,
	Client,
	ID,
	OAuthProvider,
	Storage,
	TablesDB,
} from "react-native-appwrite";
import {
	EXPO_PUBLIC_APPWRITE_BUCKET_ID,
	EXPO_PUBLIC_APPWRITE_ENDPOINT,
	EXPO_PUBLIC_APPWRITE_PROJECT_ID,
	EXPO_PUBLIC_BACKEND_URL,
} from "../lib/env";

import { openAuthSessionAsync } from "expo-web-browser";

/**
 * Appwrite configuration object.
 * Holds the endpoint, project ID, database ID, and table IDs for the Appwrite project.
 */
export const config = {
	endpoint: EXPO_PUBLIC_APPWRITE_ENDPOINT!,
	projectId: EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
	bucketId: EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
};

/**
 * Appwrite client instance.
 * Configured with the project's endpoint and ID.
 */
export const client = new Client()
	.setEndpoint(config.endpoint)
	.setProject(config.projectId);

/**
 * Appwrite Avatars service.
 * Used for generating user avatars.
 */
export const avatar = new Avatars(client);

/**
 * Appwrite Account service.
 * Used for managing user accounts and authentication.
 */
export const account = new Account(client);

/**
 * Appwrite TablesDB service.
 * Used for interacting with the Appwrite database.
 */
export const tablesDB = new TablesDB(client);

export const storage = new Storage(client);

/**
 * Handles Google OAuth login.
 * Creates an OAuth2 token, opens a web browser for authentication, and creates a session.
 * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
 */
export const login = async () => {
	try {
		const redirectUrl = Linking.createURL("/");

		const response = await account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: redirectUrl,
		});

		if (!response) throw new Error("Create OAuth2 token failed");

		const browserResult = await openAuthSessionAsync(
			response.toString(),
			redirectUrl,
		);

		console.log(JSON.stringify(response, null, 2));

		if (browserResult.type !== "success")
			throw new Error("Create OAuth2 token failed");

		const url = new URL(browserResult.url);

		const secret = url.searchParams.get("secret")?.toString();
		const userId = url.searchParams.get("userId")?.toString();

		if (!secret || !userId) throw new Error("Create OAuth2 token failed");

		const session = await account.createSession({
			userId,
			secret,
		});

		console.log(JSON.stringify(session, null, 2));

		if (!session) throw new Error("Failed to create new session");

		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
};

/**
 * Logs out the current user by deleting the current session.
 * @returns {Promise<object | boolean>} A promise that resolves to the result of the session deletion, or false if an error occurs.
 */
export const logout = async () => {
	try {
		const result = await account.deleteSession({ sessionId: "current" });
		return result;
	} catch (error) {
		console.error(error);
		return false;
	}
};

/**
 * Retrieves the current authenticated user.
 * If a user is found, it also generates and attaches an avatar URL.
 * @returns {Promise<object | null>} A promise that resolves to the user object with an avatar, or null if no user is found or an error occurs.
 */
export const getCurrentUser = async () => {
	try {
		const result = await account.get();

		if (result.$id) {
			const avatarUrl = avatar.getInitialsURL(result.name);

			return {
				...result,
				avatar: avatarUrl.toString(),
			};
		}

		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
};

type SyncPayload = {
	name: string;
	avatar: string;
};

export const syncProfileToBackend = async (
	url: string,
	{ arg }: { arg: SyncPayload },
) => {
	try {
		const jwtResponse = await account.createJWT();
		const jwt = jwtResponse.jwt;

		const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}${url}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: arg.name,
				avatarUrl: arg.avatar,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || "Failed to sync with backend");
		}

		console.log(
			"Sync data to Backend successfully:",
			JSON.stringify(data.data, null, 2),
		);

		return data.data;
	} catch (error) {
		console.error("Backend synchronization error:", error);
		return false;
	}
};

export const uploadAvatarToAppwrite = async (fileUri: string) => {
	try {
		const file = {
			uri: fileUri,
			name: `avatar_${Date.now()}.jpg`,
			type: "image/jpeg", // Adjust the MIME type as needed
			size: 0,
		};

		const uploadedFile = await storage.createFile({
			bucketId: config.bucketId,
			fileId: ID.unique(),
			file: file,
		});

		const fileUrl = storage.getFileView({
			bucketId: config.bucketId,
			fileId: uploadedFile.$id,
		});

		return fileUrl.toString();
	} catch (error) {
		console.error("Avatar upload error:", error);
		return null;
	}
};
