import { type featuredCardsData, industries } from "@/constants/data";
import { Heart, Star } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CardProps {
  card: (typeof featuredCardsData)[0];
  onPress?: () => void;
}

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
        maxHeight: 181,
      }}
      className="shadow-sm"
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
          <Text className="text-lg font-bold text-slate-800">{card.title}</Text>
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

  const favouriteToggle = () => {
    setIsFavourite(!isFavourite);
  };

  return <TouchableOpacity onPress={onPress}></TouchableOpacity>;
};
