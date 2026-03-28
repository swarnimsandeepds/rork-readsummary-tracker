import { Tabs } from "expo-router";
import { BookOpen, BarChart3 } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8B5E3C",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFF",
          borderTopColor: "#E5DFD4",
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <BookOpen color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
