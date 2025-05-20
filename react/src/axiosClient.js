import axios from 'axios';

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    try {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN');
        window.location.href = '/'; // redirect to hompe page
        return error; // Return the error to be handled by the calling code
      }
    } catch (err) {
      console.error(err);
    }

    throw error; // Re-throw the error to be handled by the calling code
  }
); 

export default axiosClient