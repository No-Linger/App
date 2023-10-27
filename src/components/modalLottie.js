import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
// import Modal from 'react-native-modal';
import LottieAnimation from './LottieAnimation'; // Asegúrate de que la ruta sea correcta

const CustomModal = ({ isVisible, onModalClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onModalClose();
      }, 3000); //Cierra el modal después de 3 segundos

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, onModalClose]);

  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.lottieAnimationStyle}>
          <LottieAnimation
            source={require("../../assets/lotties/keyLogin.json")}
            width={10}
            height={10}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
  },
  lottieAnimationStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default CustomModal;
