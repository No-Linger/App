import React from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsOverlay = ({ isVisible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.overlayContent}>
          <TouchableOpacity style={styles.button} onPress={() => 1}>
            <Text>Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => 2}>
            <Text>Button 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
  },
  button: {
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
});

export default SettingsOverlay;
