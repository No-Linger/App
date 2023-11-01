import NetInfo from '@react-native-community/netinfo';

export const syncDataToMongoDB = async (jsonData) => {
  try {
    const isConnected = (await NetInfo.fetch()).isConnected;

    if (isConnected) {
      const response = await fetch(`http://10.48.71.80:8082/postStats`, {
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
    } else {
      // Handle the case where the device is not connected to the internet
      console.log('No internet connection. Data upload skipped.');
    }
  } catch (error) {
    // Handle errors more gracefully
    console.error('Error syncing data to MongoDB:', error);
  }
};
