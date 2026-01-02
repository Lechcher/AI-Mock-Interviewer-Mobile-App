import { Tabs } from "expo-router";
import { Compass, House, Radar } from "lucide-react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0061FF",
        tabBarInactiveTintColor: "#666876",
      }}
      backBehavior="order"
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false, // Each screen manages its own header
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
          popToTopOnBlur: true,
          headerShown: false,
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
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Radar color={focused ? "#0061FF" : "#666876"} size={24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
