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
        name="Estadística"
        component={Stats}
        options={{
          tabBarLabel: "Estadística",
          tabBarIcon: ({ color, size }) => (
            <Icon name="align-vertical-bottom" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cámara"
        component={TakePicture}
        options={{
          headerShown: false,
          tabBarLabel: "Cámara",
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ajustes"
        component={Profile}
        options={{
          tabBarLabel: "Ajustes",
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
