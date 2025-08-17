import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../utils/api";

export const loadUsers = createAsyncThunk("users/load", async (page = 1) => {
 const data = await api.fetchUsers(page);
 return data;
});

export const loadUser = createAsyncThunk("users/loadOne", async (id) => {
 const data = await api.fetchUserByID(id);
 return data;
});

export const addUser = createAsyncThunk("users/add", async (payload) => {
 const data = await api.createUser(payload);
 return data;
});

export const editUser = createAsyncThunk(
 "users/edit",
 async ({ id, payload }) => {
  const data = await api.updateUser(id, payload);
  return { id, data };
 }
);

export const removeUser = createAsyncThunk("users/remove", async (id) => {
 await api.deleteUser(id);
 return id;
});

const usersSlice = createSlice({
 name: "users",
 initialState: {
  entities: {},
  ids: [],
  page: 1,
  total: 0,
  per_page: 6,
  // Splitted loading states for clarity and better UI control.
  // `isLoadingList` is for the main list fetch.
  // `isProcessingAction` is for single-user operations (add, edit, remove).
  isLoadingList: false,
  isProcessingAction: false,
  error: null,
  selectedUser: null,
 },
 reducers: {
  setPage(state, action) {
   state.page = action.payload;
  },
 },
 extraReducers: (builder) => {
  builder
   .addCase(loadUsers.pending, (state) => {
    state.isLoadingList = true;
    state.error = null;
   })
   .addCase(loadUsers.fulfilled, (state, action) => {
    state.isLoadingList = false;
    // Normalize the data and store it in `entities` and `ids`.
    state.entities = action.payload.data.reduce((acc, user) => {
     acc[user.id] = user;
     return acc;
    }, {});
    state.ids = action.payload.data.map((user) => user.id);
    state.page = action.payload.page;
    state.total = action.payload.total;
    state.per_page = action.payload.per_page;
   })
   .addCase(loadUsers.rejected, (state, action) => {
    state.isLoadingList = false;
    state.error = action.error.message || "Failed to load users.";
   })

   .addCase(loadUser.pending, (state) => {
    state.selectedUser = null; // Clear previous selection to show loading state.
    state.isProcessingAction = true;
    state.error = null;
   })
   .addCase(loadUser.fulfilled, (state, action) => {
    state.isProcessingAction = false;
    state.selectedUser = action.payload.data;
   })
   .addCase(loadUser.rejected, (state, action) => {
    state.isProcessingAction = false;
    state.error = action.error.message || "Failed to load user.";
   })

   .addCase(addUser.pending, (state) => {
    state.isProcessingAction = true;
    state.error = null;
   })
   .addCase(addUser.fulfilled, (state, action) => {
    state.isProcessingAction = false;
    const newUser = action.payload;
    state.entities[newUser.id] = newUser;
    state.ids.unshift(newUser.id); // Add new user to the start of the IDs list.
   })
   .addCase(addUser.rejected, (state, action) => {
    state.isProcessingAction = false;
    state.error = action.error.message || "Failed to add user.";
   })

   .addCase(editUser.pending, (state) => {
    state.isProcessingAction = true;
    state.error = null;
   })
   .addCase(editUser.fulfilled, (state, action) => {
    state.isProcessingAction = false;
    const { id, data } = action.payload;
    // Directly update the entity in the map, which is highly efficient.
    if (state.entities[id]) {
     state.entities[id] = { ...state.entities[id], ...data };
    }
   })
   .addCase(editUser.rejected, (state, action) => {
    state.isProcessingAction = false;
    state.error = action.error.message || "Failed to edit user.";
   })

   .addCase(removeUser.pending, (state) => {
    state.isProcessingAction = true;
    state.error = null;
   })
   .addCase(removeUser.fulfilled, (state, action) => {
    state.isProcessingAction = false;
    delete state.entities[action.payload];
    state.ids = state.ids.filter((id) => String(id) !== String(action.payload));
  })
   .addCase(removeUser.rejected, (state, action) => {
    state.isProcessingAction = false;
    state.error = action.error.message || "Failed to remove user.";
   });
 },
});

export const { setPage } = usersSlice.actions;
export default usersSlice.reducer;