import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./axiosInstance";

// GET REPORT (Studio Manager only) — { from, to } ISO date strings
export const getReport = createAsyncThunk(
  "Reports/getReport",
  async ({ from, to }, thunkAPI) => {
    try {
      const response = await API.get("/Studio/Reports", { params: { from, to } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

const ReportsSlice = createSlice({
  name: "Reports",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ReportsSlice.reducer;
