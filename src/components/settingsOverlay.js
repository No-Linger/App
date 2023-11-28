import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authClient } from "../services/firebaseConfig";
import { resetPlanogramTracker } from "../services/planograms";

const SettingsOverlay = ({ isVisible, onClose, onLogout }) => {
  useEffect(() => {
    console.log(authClient.currentUser.email);
  }, []);
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
          <Text
            style={{
              color: "black",
              fontWeight: "bold",
              marginBottom: "10%",
              fontSize: 18,
            }}
          >
            {authClient.currentUser.email}
          </Text>
          <TouchableOpacity
            style={{
              borderColor: "black",
              padding: 8,
              borderWidth: 2,
              borderRadius: 10,
            }}
            onPress={resetPlanogramTracker}
          >
            <Text
              style={{
                color: "black",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Eliminar Planogramas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onLogout}>
            <Icon name="logout-variant" style={styles.icon} size={30} />
            <Text
              style={{
                textDecorationLine: "underline",
                color: "blue",
                fontWeight: "bold",
              }}
            >
              Cerrar Sesión
            </Text>
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
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    color: "blue",
  },
});

export default SettingsOverlay;
