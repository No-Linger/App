import React from 'react';
import { Image } from 'react-native';

const Imagen = ({ source, width, height }) => {
  return <Image source={source} style={{ width, height }} />;
};

export default Imagen;
