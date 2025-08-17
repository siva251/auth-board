import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = "https://reqres.in/api";

// Create a centralized Axios instance. As it allows for global configurations like base URL, headers, and interceptors.
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

const API_KEY = process.env.REACT_APP_API_KEY || "reqres-free-v1";
API.defaults.params = {
  api_key: API_KEY,
};

// --- Response Interceptor for Global Error Handling ---
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
      return Promise.reject(error);
    }
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        toast.error("Session expired. Please log in again.");
      } else if (status === 404) {
        toast.error("Resource not found.");
      } else {
        // Generic error message for other status codes.
        toast.error(`API Error: ${data.error || data.message || "An unexpected error occurred."}`);
      }
    } else if (error.request) {
      // The request was made, but no response was received.
      console.error("Network Error: No response received from the server.");
      toast.error("Network Error: Please check your internet connection.");
    } else {
      // Something happened in setting up the request that triggered an Error.
      console.error("Request Setup Error:", error.message);
      toast.error("An error occurred while setting up the request.");
    }
    //Re-throw the error so that the component calling the API can handle it in its `catch` block.
    return Promise.reject(error);
  }
);

/**
 * Fetches a list of users from the API.
 * @param {number} page The page number to fetch.
 * @returns {Promise<Object>} The response data.
 */
export const fetchUsers = async (page = 1) => {
  const { data } = await API.get("/users", { params: { page } });
  return data;
};

/**
 * Fetches a single user by their ID.
 * @param {string|number} id The user's ID.
 * @returns {Promise<Object>} The response data.
 */
export const fetchUserByID = async (id) => {
  const { data } = await API.get(`/users/${id}`);
  return data;
};

/**
 * Creates a new user.
 * @param {Object} payload The user data to be created.
 * @returns {Promise<Object>} The response data.
 */
export const createUser = async (payload) => {
  const { data } = await API.post("/users", payload);
  toast.success("User created successfully!");
  return data;
};

/**
 * Updates an existing user.
 * @param {string|number} id The user's ID.
 * @param {Object} payload The updated user data.
 * @returns {Promise<Object>} The response data.
 */
export const updateUser = async (id, payload) => {
  const { data } = await API.put(`/users/${id}`, payload);
  toast.success("User updated successfully!");
  return data;
};

/**
 * Deletes a user.
 * @param {string|number} id The user's ID.
 * @returns {Promise<Object>} A confirmation object.
 */
export const deleteUser = async (id) => {
  // `await` the delete call even if there's no data to return, to ensure the toast is shown after the request is complete.
  await API.delete(`/users/${id}`);
  toast.success("User deleted successfully!");
  // Return an object to provide a consistent return type.
  return { status: "success" };
};

/**
 * Handles user login.
 * @param {Object} payload The user's credentials.
 * @returns {Promise<Object>} The response data.
 */
export const login = async (payload) => {
  const { data } = await API.post("/login", payload);
  return data;
};