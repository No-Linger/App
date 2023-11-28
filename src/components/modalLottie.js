import React, { useState, useEffect } from 'react';
import { View, Text, Modal } from 'react-native';
//import Modal from 'react-native-modal';
import LottieAnimation from './LottieAnimation'; // Asegúrate de que la ruta sea correcta

const CustomModal = ({ isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {

            }, 3000); //Cierra el modal después de 3 segundos

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible]);

  return (
    <Modal style={styles.modalStyle} isVisible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.lottieAnimationStyle}>
          <LottieAnimation
            source={require("../../assets/lotties/keyLogin.json")}
            width={50}
            height={50}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalStyle: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    
 },
 modalContent: {
    backgroundColor: 'white',
    padding: 20,
 },
 lottieAnimationStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
 },
};

export default CustomModal;
