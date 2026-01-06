import { featuredCardsData, industries } from "@/constants/data";
import { BadgeCheck, Gem } from "lucide-react-native";
import { Text, View } from "react-native";

const FeatureExample = () => {
  return (
    <View>
      {featuredCardsData.map((card) => {
        const industry = industries[card.industry as keyof typeof industries];
        const IconComponent = industry?.icon;

        return (
          <View
            key={card.title}
            className="flex flex-col items-start p-4 bg-white rounded-3xl border border-slate-100 shadow-sm mb-4"
          >
            <View className="flex flex-row items-center justify-between w-full mb-4">
              <View
                style={{ backgroundColor: industry?.backgroundColor }}
                className="p-2 rounded-xl"
              >
                {IconComponent && (
                  <IconComponent size={24} color={industry?.iconColor} />
                )}
              </View>
              <View className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <Text className="text-slate-600 text-xs font-bold">
                  {card.difficulty}
                </Text>
              </View>
            </View>

            <Text className="text-lg font-bold text-slate-900 mb-1">
              {card.title}
            </Text>
            <Text className="text-slate-500 text-sm mb-4">
              {card.focusArea}
            </Text>

            <View className="flex flex-row items-center justify-between w-full pt-4 border-t border-slate-50">
              <View className="flex flex-row items-center gap-1">
                <BadgeCheck size={16} color="#64748b" />
                <Text className="text-slate-500 text-xs">
                  {card.questions} Questions
                </Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <Gem size={16} color="#fbbf24" />
                <Text className="text-slate-900 text-xs font-bold">
                  {card.review}
                </Text>
                <Text className="text-slate-400 text-xs">
                  ({card.reviewCount})
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default FeatureExample;
