import React, { useState } from "react";
import { Profile, Stats, TakePicture} from "./screens";
import Login from "./screens/Login"
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Cámara"
      screenOptions={{
        tabBarActiveTintColor: "#000000",
      }}
    >
      <Tab.Screen
        name="Estadística"
        component={Stats}
        options={{
          headerTitleAlign: "left",
          tabBarLabel: "Estadística",
          headerTitleStyle: {
            fontSize: 25,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" color={color} size={size} />
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
          headerTitleAlign: "left",
          tabBarLabel: "Ajustes",
          headerTitleStyle: {
            fontSize: 25,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-cog" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={Login}
        options={{
          tabBarLabel: "Login",
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Main() {
  const [isLoged, setIsLoged] = useState(true);
  if (isLoged) {
    return (
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    );
  } else {
    return (
      <Login
        onClick={() => {
          setIsLoged(true);
        }}
      />
    );
  }
}
