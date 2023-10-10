import React from "react";
import { First, Profile, Stats, TakePicture } from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Take"
      screenOptions={{
        tabBarActiveTintColor: "#000000",
      }}
    >
      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          tabBarLabel: "Stats",
          tabBarIcon: ({ color, size }) => (
            <Icon name="align-vertical-bottom" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Take"
        component={TakePicture}
        options={{
          headerShown: false,
          tabBarLabel: "Take Picture",
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Main() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
