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

module.exports = {
	Client: jest.fn(() => createClient()),
	Account: jest.fn(() => createAccount()),
	Avatars: jest.fn(() => createAvatars()),
	Storage: jest.fn(() => createStorage()),
	ID: { unique: jest.fn(() => "unique-id") },
	OAuthProvider: { Google: "google" },
};
