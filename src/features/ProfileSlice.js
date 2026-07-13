import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./axiosInstance";

// GET MY PROFILE (any logged-in studio-side role)
export const getProfile = createAsyncThunk(
  "Profile/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/User/Profile");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ProfileSlice.reducer;
