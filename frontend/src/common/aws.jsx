import axios from 'axios';

const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN;

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axios.post(`${SERVER_DOMAIN}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  console.log('Uploaded image URL:', response.data.url); // Log the URL to the console
  return response.data.url; // Return the URL of the uploaded image
};