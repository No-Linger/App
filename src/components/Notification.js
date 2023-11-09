import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";

export default function Notification({
  title,
  message,
  icon,
  isVisible,
  onClose,
  duration = 3000,
}) {
  const slideAnim = useRef(new Animated.Value(-100)).current; // Start off-screen

  useEffect(() => {
    let timer;

    if (isVisible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Slide in
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to top of the screen
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Set a timer to slide out the notification after `duration`
      timer = setTimeout(() => {
        // Slide out
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(onClose);
      }, duration);
    }

    // Cleanup function to clear the timer
    return () => timer && clearTimeout(timer);
  }, [isVisible, slideAnim, onClose, duration]);

  // When notification is not visible, do not render it at all
  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          // Interpolate the translateY value
          transform: [
            {
              translateY: slideAnim,
            },
          ],
        },
      ]}
    >
      <View style={{ flex: 1, flexDirection: "row", alignContent: "center" }}>
        <View style={{ flex: 3 }}>
          <Text style={{ textAlign: "left", fontSize: 20, fontWeight: "600" }}>
            {title}
          </Text>
          <Text style={{ textAlign: "left", fontSize: 14, fontWeight: "400" }}>
            {message}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Icon name={icon} size={35} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "94%",
    height: "14%",
    left: "3%",
    right: "3%",
    position: "absolute",
    top: 10,
    padding: 10,
    backgroundColor: "white",
    borderColor: "#4B6CFE",
    borderRadius: 12,
    borderWidth: 2,
    zIndex: 1000,
    elevation: 1000,
  },
});
