import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const setAuthData = (token, email, expiry) => {
  localStorage.setItem("auth_user", JSON.stringify({ email }));
  localStorage.setItem("auth_expiry", expiry);
  // Store the token in a more secure way, like a private variable or session storage,
  // to mitigate some XSS risks. For simplicity localStorage is okay.
  localStorage.setItem("auth_token", token);
};

const clearAuthData = () => {
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_expiry");
};

const getAuthData = () => {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const token = localStorage.getItem("auth_token");
  const expiry = localStorage.getItem("auth_expiry");
  // Check if the token exists and is not expired.
  if (token && expiry && Date.now() < expiry) {
    return { user, token };
  }
  clearAuthData();
  return { user: null, token: null };
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const API_KEY = process.env.REACT_APP_API_KEY;
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE}/login`,
        credentials,{
          headers: {
            'x-api-key': API_KEY, // Add the API key to the headers
            'Content-Type': 'application/json',
          },
        }
      );
      const { token } = res.data;
      const expiryTime = Date.now() + 300 * 1000; // 5 minutes validity
      
      // Persist the data after a successful login.
      setAuthData(token, credentials.email, expiryTime);

      // Return a structured payload for the reducer.
      return { user: { email: credentials.email }, token, expiry: expiryTime };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
      // Use rejectWithValue to pass the error message to the rejected action.
      return rejectWithValue(errorMessage);
    }
  }
);

const { user, token } = getAuthData();

const initialState = {
  user,
  token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to handle logout
    logout(state) {
      state.user = null;
      state.token = null;
      // Clear data from storage.
      clearAuthData();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update state with the returned payload.
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiry = action.payload.expiry;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Payload is now the error message from rejectWithValue
        // On rejection, clear any invalid or expired session data.
        clearAuthData();
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;