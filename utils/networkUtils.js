const axios = require('axios');
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const sendImage = async (capturedImage) => {
  const formData = new FormData();
  formData.append('file', {
    uri: capturedImage,
    name: 'capturedImage.jpg',
    type: 'image/jpeg',
  });

  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type':'multipart/form-data',
      },
    });

    if (response.status === 200) {
      return response.data.prediction;
    }
  } catch (error) {
    console.log('Error sending file: ', error);
    return null;
  }
};