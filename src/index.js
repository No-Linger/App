import React, { useState, useEffect } from "react";
import { Profile, Stats, TakePicture } from "./screens";
import Login from "./screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ModelProvider } from "./contexts/model";
import { TouchableOpacity } from "react-native";
import { authClient } from "./services/firebaseConfig";
import SettingsOverlay from "./components/settingsOverlay";
import * as SplashScreen from "expo-splash-screen";

const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

export default function Main() {
  const [isLoged, setIsLoged] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = authClient.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in.
        setIsLoged(true);
      } else {
        // No user is signed in.
        setIsLoged(false);
      }
      await SplashScreen.hideAsync();
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const toggleOverlay = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  const logout = async () => {
    await authClient.signOut();
    setIsLoged(false);
    setIsOverlayVisible(false);
  };

  if (isLoged) {
    return (
      <ModelProvider>
        <NavigationContainer>
          <MyTabs toggleOverlay={toggleOverlay} />
          <SettingsOverlay
            isVisible={isOverlayVisible}
            onClose={() => setIsOverlayVisible(false)}
            onLogout={logout}
          />
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

function MyTabs({ toggleOverlay }) {
  return (
    <Tab.Navigator
      initialRouteName="Analizar"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#C2CDFF",
        tabBarStyle: {
          backgroundColor: "#4B6CFE",
        },
        headerStyle: {
          backgroundColor: "#4B6CFE",
        },
      }}
    >
      <Tab.Screen
        name="Datos"
        component={Stats}
        options={{
          headerTitleAlign: "left",
          tabBarLabel: "Datos",
          headerTitleStyle: {
            fontSize: 30,
            color: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-bar" color={color} size={size} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleOverlay}
              style={{ right: 7, position: "absolute", top: 7 }}
            >
              <Icon name="cog-outline" size={28} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Analizar"
        component={TakePicture}
        options={({ navigation }) => ({
          headerTitleAlign: "left",
          tabBarLabel: "Analizar",
          headerTitleStyle: {
            fontSize: 30,
            color: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="compare" color={color} size={size} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleOverlay}
              style={{ right: 7, position: "absolute", top: 7 }}
            >
              <Icon name="cog-outline" size={28} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name="Planogramas"
        component={Profile}
        options={{
          headerTitleAlign: "left",
          tabBarLabel: "Planogramas",
          headerTitleStyle: {
            fontSize: 30,
            color: "white",
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="image-multiple-outline" color={color} size={size} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleOverlay}
              style={{ right: 7, position: "absolute", top: 7 }}
            >
              <Icon name="cog-outline" size={28} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
