import { account } from "@/core/appwrite";

export const fetcher = async (url: string) => {
	try {
		const jwtResponse = await account.createJWT();
		const jwt = jwtResponse.jwt;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error("Failed to fetch data");
		}

		return data.data;
	} catch (error) {
		console.error(error);
		return null;
	}
};
