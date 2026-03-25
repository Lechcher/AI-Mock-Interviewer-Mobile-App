import { SvgUri, SvgXml } from "react-native-svg";

import { Image } from "expo-image";
import { View } from "react-native";

interface AvatarProps {
	uri?: string;
	size?: number;
}

export const UniversalAvatar = ({ uri, size = 50 }: AvatarProps) => {
	const containerStyle = {
		width: size,
		height: size,
		borderRadius: size / 2,
		overflow: "hidden" as const,
	};

	if (!uri) {
		return (
			<Image
				source={require("../assets/images/default-avatar.png")}
				style={containerStyle}
			/>
		);
	}

	try {
		if (uri.startsWith("data:image/svg+xml")) {
			const base64Content = uri.split(",")[1];
			const xmlString = atob(base64Content);
			return (
				<View style={containerStyle}>
					<SvgXml xml={xmlString} width="100%" height="100%" />
				</View>
			);
		}

		if (uri.endsWith(".svg")) {
			return (
				<View style={containerStyle}>
					<SvgUri uri={uri} width="100%" height="100%" />
				</View>
			);
		}

		return (
			<Image
				source={{ uri }}
				style={containerStyle}
				contentFit="cover"
				transition={200}
			/>
		);
	} catch (e) {
		return (
			<Image
				source={require("../assets/images/default-avatar.png")}
				style={containerStyle}
			/>
		);
	}
};
