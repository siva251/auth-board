import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import authReducer from "./authSlice";
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export default store;
