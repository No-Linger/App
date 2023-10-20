import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { BACK_API } from '@env';

export const syncDataToMongoDB = async (jsonData) => {
  try {
    const isConnected = (await NetInfo.fetch()).isConnected;

    if (isConnected) {
      // Fetch data from AsyncStorage
      const data = await AsyncStorage.getItem('statData');
      if (data) {
        const parsedData = JSON.parse(data);
        // Fetch the list of identifiers of data that have already been uploaded
        const uploadedData = await AsyncStorage.getItem('uploadedData');
        const uploadedIdentifiers = uploadedData ? JSON.parse(uploadedData) : [];
        // Filter the data to find captures that haven't been uploaded
        
        const capturesToUpload = Array.isArray(parsedData)
        ? parsedData.filter(capture => !uploadedIdentifiers.includes(capture.uniqueIdentifier))
        : [];

        if (Array.isArray(capturesToUpload)) {
          const response = await fetch(BACK_API + '/postStats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({parsedData}),
          });

          let data = await response.json()
          console.log(data)

          if (response.ok) {
            console.log('Aidrian si jalan los datos')
            // Update the list of uploaded identifiers
            uploadedIdentifiers.push(
              ...capturesToUpload.map((capture) => capture.uniqueIdentifier)
            );
            await AsyncStorage.setItem('uploadedData', JSON.stringify(uploadedIdentifiers));
          }
          else {
            console.log('Jesus negro falló al pueblo de belen.')
          }
        }
      }
    }
  } catch (error) {
    console.error('Error syncing data to MongoDB:', error);
  }
};

