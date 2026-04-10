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
} from "react-native-appwrite";
import {
	EXPO_PUBLIC_APPWRITE_BUCKET_ID,
	EXPO_PUBLIC_APPWRITE_ENDPOINT,
	EXPO_PUBLIC_APPWRITE_PROJECT_ID,
	EXPO_PUBLIC_BACKEND_URL,
} from "../lib/env";

import { openAuthSessionAsync } from "expo-web-browser";

/**
 * Constants
 */
const CURRENT_SESSION_ID = "current";
const isDevelopment = __DEV__;

/**
 * Type definitions
 */
export interface AppwriteUser {
	$id: string;
	$createdAt: string;
	$updatedAt: string;
	name: string;
	email: string;
	emailVerification: boolean;
	prefs: Record<string, unknown>;
	avatar: string;
}

export interface SyncPayload {
	name: string;
	avatar: string;
}

export interface BackendSyncResponse {
	success: boolean;
	data?: unknown;
	error?: string;
}

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

export const storage = new Storage(client);

/**
 * Removes sensitive console logs in production.
 * Only logs when running in development mode.
 */
// ...existing code...

/**
 * Handles Google OAuth login.
 * Creates an OAuth2 token, opens a web browser for authentication, and creates a session.
 * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
 */
export const login = async (): Promise<boolean> => {
	try {
		const redirectUrl = Linking.createURL("/");

		const response = await account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: redirectUrl,
		});

		if (!response) throw new Error("Failed to create OAuth2 token");

		const browserResult = await openAuthSessionAsync(
			response.toString(),
			redirectUrl,
		);

		if (isDevelopment) {
			console.log("OAuth2 token created successfully");
		}

		if (browserResult.type !== "success") {
			throw new Error("Browser authentication was cancelled or failed");
		}

		const url = new URL(browserResult.url);

		const secret = url.searchParams.get("secret")?.toString();
		const userId = url.searchParams.get("userId")?.toString();

		if (!secret || !userId) {
			throw new Error("Missing authentication credentials from OAuth callback");
		}

		const session = await account.createSession({
			userId,
			secret,
		});

		if (isDevelopment) {
			console.log("Session created successfully");
		}

		if (!session) throw new Error("Failed to create session");

		return true;
	} catch (error) {
		console.error("Login error:", error);
		return false;
	}
};

/**
 * Logs out the current user by deleting the current session.
 * @returns {Promise<boolean>} A promise that resolves to true if logout is successful, false otherwise.
 */
export const logout = async (): Promise<boolean> => {
	try {
		await account.deleteSession({ sessionId: CURRENT_SESSION_ID });
		return true;
	} catch (error) {
		console.error("Logout error:", error);
		return false;
	}
};

/**
 * Retrieves the current authenticated user.
 * If a user is found, it also generates and attaches an avatar URL.
 * @returns {Promise<AppwriteUser | null>} A promise that resolves to the user object with an avatar, or null if no user is found or an error occurs.
 */
export const getCurrentUser = async (): Promise<AppwriteUser | null> => {
	try {
		const result = await account.get();

		if (result.$id) {
			const avatarUrl = avatar.getInitialsURL(result.name);

			return {
				...result,
				avatar: avatarUrl.toString(),
			} as AppwriteUser;
		}

		return null;
	} catch (error) {
		console.error("Get current user error:", error);
		return null;
	}
};

export const syncProfileToBackend = async (
	url: string,
	{ arg }: { arg: SyncPayload },
): Promise<BackendSyncResponse> => {
	try {
		const jwtResponse = await account.createJWT();
		const jwt = jwtResponse.jwt;

		if (isDevelopment) {
			console.log("Created JWT for backend sync");
		}

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

		if (isDevelopment) {
			console.log("Sync data to Backend successfully");
		}

		return {
			success: true,
			data: data.data,
		};
	} catch (error) {
		console.error("Backend synchronization error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};

export const uploadAvatarToAppwrite = async (
	fileUri: string,
): Promise<string | null> => {
	try {
		// Get file info to determine MIME type and size
		const fileName = `avatar_${Date.now()}.jpg`;
		const mimeType = "image/jpeg"; // Adjust based on actual file type if needed

		const file = {
			uri: fileUri,
			name: fileName,
			type: mimeType,
			size: 0, // Appwrite will determine the actual size
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

		if (isDevelopment) {
			console.log("Avatar uploaded successfully:", fileUrl.toString());
		}

		return fileUrl.toString();
	} catch (error) {
		console.error("Avatar upload error:", error);
		return null;
	}
};
