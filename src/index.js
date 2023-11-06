import React, { useState } from "react";
import { Profile, Stats, TakePicture } from "./screens";
import Login from "./screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ModelProvider } from "./contexts/model";

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
        name="Historial"
        component={Stats}
        options={{
          headerTitleAlign: "left",
          tabBarLabel: "Historial",
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
        name="Planogramas"
        component={Profile}
        options={{
          headerTitleAlign: "left",
          tabBarLabel: "Planogramas",
          headerTitleStyle: {
            fontSize: 25,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Main() {
  //const [isLoged, setIsLoged] = useState(false);
  const [isLoged, setIsLoged] = useState(true);
  if (isLoged) {
    return (
      <ModelProvider>
        <NavigationContainer>
          <MyTabs />
        </NavigationContainer>
      </ModelProvider>
    );
  } else {
    return (
      <Login
        setIsLoged={setIsLoged}
        onClick={() => {
          setIsLoged(true);
        }}
      />
    );
  }
}
