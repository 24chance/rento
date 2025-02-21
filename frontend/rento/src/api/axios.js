import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the Authorization token to the request headers
api.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const accessToken = user?.access_token; // Extract token from the stored user data

        // If the access token exists, attach it to the request
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Error reading user data from localStorage", error);
      }
    }

    return config; // Return the modified config to proceed with the request
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default api;
