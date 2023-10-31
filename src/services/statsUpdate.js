import NetInfo from '@react-native-community/netinfo';
import { BACK_API } from '@env';

export const syncDataToMongoDB = async (jsonData) => {
  try {
    const isConnected = (await NetInfo.fetch()).isConnected;

    if (isConnected) {
      const response = await fetch(`http://192.168.1.78:8082/postStats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        console.log('Data was successfully uploaded');
      } else {
        console.log('Data upload failed.');
      }
    }
  } catch (error) {
    console.error('Error syncing data to MongoDB:', error);
  }
};
