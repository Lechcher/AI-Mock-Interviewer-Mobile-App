import {
	type cardsData,
	difficulties,
	type featuredCardsData,
	industries,
	type powerUpsData,
	type questData,
	type shopCardData,
} from "@/constants/data";
import { Gem, Gift, Heart, Star } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CardProps {
	card: (typeof featuredCardsData | typeof cardsData)[0];
	onPress?: () => void;
}

interface QuestCardProps {
	card: (typeof questData)[keyof typeof questData];
	onPress?: () => void;
}

interface ShopCardProps {
	card: (typeof shopCardData)[keyof typeof shopCardData];
	onPress?: () => void;
}

interface PowerUpCardProps {
	card: (typeof powerUpsData)[keyof typeof powerUpsData];
	onPress?: () => void;
}

const shortTitle = ({ str, maxLength }: { str: string; maxLength: number }) => {
	if (maxLength < 3) {
		return str.slice(0, maxLength);
	}
	if (str.length > maxLength) {
		return str.slice(0, maxLength - 3) + "...";
	}

	return str;
};

export const FeaturedCard = ({ card, onPress }: CardProps) => {
	const [isFavourite, setIsFavourite] = useState(card.isFavourite);
	const industry = industries[card.industry as keyof typeof industries];

	const favouriteToggle = () => {
		setIsFavourite(!isFavourite);
	};

	return (
		<TouchableOpacity
			key={card.title}
			onPress={onPress}
			style={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				width: "auto",
				height: "auto",
				padding: 16,
				borderRadius: 16,
				backgroundColor: "white",
				minWidth: 246,
			}}
		>
			<View
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					padding: 10,
					backgroundColor: "#0D59F210",
					borderTopRightRadius: 16,
					borderBottomLeftRadius: 12,
				}}
			>
				<Text
					style={{
						textAlign: "center",
						fontSize: 10,
						fontWeight: "bold",
						color: "#0D59F2",
					}}
				>
					POPULAR
				</Text>
			</View>

			<View className="gap-3">
				<View
					style={{
						backgroundColor: industry?.backgroundColor,
						width: 54,
						height: 54,
					}}
					className="rounded-full items-center justify-center"
				>
					{industry?.icon && (
						<industry.icon size={30} color={industry?.iconColor} />
					)}
				</View>

				<View className="flex flex-col gap-2.5">
					<Text className="text-lg font-bold text-slate-800">
						{shortTitle({ str: card.title, maxLength: 20 })}
					</Text>
					<Text className="text-slate-500 text-sm">{card.industry}</Text>
				</View>

				<View className="flex flex-row items-center justify-between">
					<View className="flex flex-row items-center gap-1">
						<Star size={12} color={"#FACC15"} />

						<Text className="text-slate-700 text-sm font-bold">
							{card.review}
						</Text>

						<Text className="text-slate-400 text-xs">
							({card.reviewCount}{" "}
							{card.reviewCount === 1 ? "review" : "reviews"})
						</Text>
					</View>

					<TouchableOpacity onPress={favouriteToggle}>
						<Heart
							size={20}
							color={isFavourite ? "#F43F5E" : "#94A3B8"}
							fill={isFavourite ? "#F43F5E" : "transparent"}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export const Card = ({ card, onPress }: CardProps) => {
	const [isFavourite, setIsFavourite] = useState(card.isFavourite);
	const industry = industries[card.industry as keyof typeof industries];
	const difficulty = difficulties[card.difficulty as keyof typeof difficulties];

	const favouriteToggle = () => {
		setIsFavourite(!isFavourite);
	};

	return (
		<TouchableOpacity onPress={onPress}>
			<View
				className="flex flex-row items-center justify-between p-4 pr-6 bg-white rounded-4xl shadow-xs"
				style={{ padding: 16, paddingRight: 24, borderRadius: 32 }}
			>
				<View className="flex flex-row" style={{ gap: 32 }}>
					<View
						style={{
							backgroundColor: industry?.backgroundColor,
							borderRadius: 100,
							height: 48,
							width: 48,
						}}
						className="flex items-center justify-center"
					>
						<industry.icon size={24} color={industry?.iconColor} />
					</View>

					<View className="flex flex-col gap-2.5">
						<Text className="text-lg font-bold text-wrap">
							{shortTitle({ str: card.title, maxLength: 20 })}
						</Text>

						<View className="flex flex-row" style={{ gap: 10 }}>
							<View
								className="flex rounded-full"
								style={{
									backgroundColor: difficulty?.backgroundColor,
									paddingVertical: 2,
									paddingHorizontal: 10,
								}}
							>
								<Text
									className="font-medium text-center"
									style={{
										color: difficulty?.color,
										fontSize: 10,
									}}
								>
									{card.difficulty}
								</Text>
							</View>

							<View className="flex py-0.5 px-2.5 bg-slate-100">
								<Text
									className="font-medium text-slate-600 rounded-full"
									style={{
										fontSize: 10,
										backgroundColor: "#F1F5F9",
										paddingVertical: 2,
										paddingHorizontal: 10,
									}}
								>
									{card.industry}
								</Text>
							</View>
						</View>
					</View>
				</View>

				<TouchableOpacity onPress={favouriteToggle}>
					<Heart
						size={20}
						color={isFavourite ? "#F43F5E" : "#94A3B8"}
						fill={isFavourite ? "#F43F5E" : "transparent"}
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

export const QuestCard = ({ card, onPress }: QuestCardProps) => {
	const Icon = card.icon;

	return (
		<View
			className="flex flex-col gap-4 bg-white rounded-3xl border border-slate-100 shadow-sm mb-3"
			style={{ padding: 16 }}
		>
			<View className="flex flex-row items-center justify-between">
				<View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
					<View
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 12,
							backgroundColor: card.backgroundColor,
							borderRadius: 100,
						}}
					>
						<Icon size={24} color={card.iconColor} />
					</View>

					<View className="flex flex-col gap-0.5">
						<Text className="text-slate-900 font-bold text-sm">
							{card.title}
						</Text>
						<Text className="text-slate-500 text-xs">
							{typeof card.description === "function"
								? card.description()
								: card.description}
						</Text>
					</View>
				</View>

				<View className="flex flex-row items-center justify-center bg-blue-50 gap-1 px-2 py-1.5 rounded-full border border-blue-100">
					<Gem size={12} color="#3B82F6" />
					<Text className="text-blue-600 font-bold text-[10px]">
						+
						{typeof card.reward === "function"
							? Math.round(card.reward())
							: card.reward}
					</Text>
				</View>
			</View>

			<View className="flex flex-row items-center justify-between">
				<Text
					className="text-xs font-medium"
					style={{
						color: card.progress !== 0 ? "#475569" : "#94A3B8",
					}}
				>
					{card.progress >= card.requirements
						? "Complete"
						: card.progress === 0
							? "To Do"
							: "In Progress"}
				</Text>

				<Text
					className="text-xs font-medium"
					style={{
						color:
							card.progress >= card.requirements
								? "#0D59F2"
								: card.progress === 0
									? "#94A3B8"
									: "#0F172A",
					}}
				>
					{card.progress}/{card.requirements}
				</Text>
			</View>

			<View
				style={{
					width: "100%",
					height: 8,
					borderRadius: 100,
					backgroundColor: "#F1F5F9",
					overflow: "hidden",
				}}
			>
				<View
					style={{
						width: `${(card.progress / card.requirements) * 100}%`,
						height: 8,
						borderRadius: 100,
						backgroundColor: "#0D59F2",
					}}
				/>
			</View>

			<TouchableOpacity
				className="w-full rounded-full flex items-center justify-center shadow"
				style={{
					backgroundColor:
						card.progress >= card.requirements
							? "#0D59F2"
							: card.progress === 0
								? "#FFFFFF"
								: "#DBEAFE",
					borderWidth: 1,
					borderColor: card.progress === 0 ? "#E2E8F0" : "transparent",
					paddingVertical: 10,
				}}
				onPress={onPress}
			>
				{card.progress >= card.requirements ? (
					<View className="flex flex-row gap-2">
						<Gift size={18} color={"white"} />

						<Text className="text-xs font-medium text-center text-white">
							Claim Reward
						</Text>
					</View>
				) : card.progress === 0 ? (
					<Text className="text-slate-700 text-xs font-medium">Start</Text>
				) : (
					<Text className="text-primary-100 text-xs font-medium">Continue</Text>
				)}
			</TouchableOpacity>
		</View>
	);
};

export const ShopCard = ({ card, onPress }: ShopCardProps) => {
	const BadgeIcon = card.badgeIcon;
	const CardIcon = card.cardIcon;

	return (
		<View
			className="rounded-2xl shadow-sm"
			style={{
				position: "relative",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "flex-start",
				width: "auto",
				height: 210,
				overflow: "hidden",
				padding: 16,
				minWidth: 354,
				backgroundColor: card.cardBgColor,
			}}
		>
			<View
				className="flex flex-row items-center w-auto gap-1 px-2 py-1.5 rounded-full border border-solid"
				style={{
					backgroundColor: `${card.badgeBgColor}14`,
					borderColor: `${card.badgeBgStroke}0A`,
				}}
			>
				<BadgeIcon size={14} color={"#FFFFFF"} />

				<Text className="text-xs font-bold uppercase text-white">Premium</Text>
			</View>

			<Text className="font-bold text-white" style={{ fontSize: 24 }}>
				{card.title}
			</Text>

			<Text className="text-white text-sm" style={{ width: "50%" }}>
				{card.description}
			</Text>

			<TouchableOpacity
				onPress={onPress}
				className="flex flex-row bg-white"
				style={{
					paddingHorizontal: 20,
					paddingVertical: 10,
					borderRadius: 16,
				}}
			>
				<Text className="font-bold text-sm" style={{ color: card.cardBgColor }}>
					{card.buttonTitle}
				</Text>
			</TouchableOpacity>

			<View
				style={{
					position: "absolute",
					bottom: -20,
					right: -20,
				}}
			>
				<View
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: 128,
						height: 128,
						borderWidth: 6,
						borderColor: "#FFFFFF14",
						borderRadius: 100,
					}}
				>
					<CardIcon size={64} color={"#FFFFFF"} />
				</View>
			</View>
		</View>
	);
};

export const PowerUpCard = ({ card, onPress }: PowerUpCardProps) => {
	const Icon = card.icon;

	return (
		<View
			className="bg-white rounded-3xl flex flex-col justify-between gap-3"
			style={{ width: "48%", padding: 16 }}
		>
			<View className="flex flex-col gap-3">
				<View
					className="w-full aspect-square rounded-2xl items-center justify-center"
					style={{ backgroundColor: card.backgroundColor }}
				>
					<Icon size={72} color={card.iconColor} />
				</View>

				<View className="flex flex-col gap-1">
					<Text className="text-base font-bold text-slate-900">
						{card.title}
					</Text>
					<Text className="text-xs text-slate-500 leading-4">
						{card.description}
					</Text>
				</View>
			</View>

			<TouchableOpacity
				onPress={onPress}
				className="rounded-xl flex flex-row items-center justify-center gap-1.5"
				style={{
					width: "100%",
					backgroundColor: "#155DFC",
					paddingBlock: 10,
					borderRadius: 16,
				}}
			>
				<Gem size={14} color="white" />
				<Text className="text-white font-bold text-sm">{card.price}</Text>
			</TouchableOpacity>
		</View>
	);
};
