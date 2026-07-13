import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./axiosInstance";

// GET ACTIVITY HISTORY (Studio Manager only)
export const getActivityHistory = createAsyncThunk(
  "ActivityHistory/getActivityHistory",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/Studio/ActivityHistory");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

const ActivityHistorySlice = createSlice({
  name: "ActivityHistory",
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getActivityHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload || [];
      })
      .addCase(getActivityHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ActivityHistorySlice.reducer;
