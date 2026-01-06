import { Tabs } from "expo-router";
import { Compass, House, Radar } from "lucide-react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0061FF",
        tabBarInactiveTintColor: "#666876",
        headerShown: false,
      }}
      backBehavior="order"
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <House color={focused ? "#0061FF" : "#666876"} size={24} />
          ),
        }}
      />

      {/* Explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <Compass color={focused ? "#0061FF" : "#666876"} size={24} />
          ),
        }}
      />

      {/* Quests tab */}
      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          tabBarIcon: ({ focused }) => (
            <Radar color={focused ? "#0061FF" : "#666876"} size={24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
