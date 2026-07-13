import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./axiosInstance";

// 1. GET PENDING CHANGES (Studio Manager only)
export const getPendingChanges = createAsyncThunk(
  "Approvals/getPendingChanges",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/Studio/PendingChanges");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

// 2. APPROVE PENDING CHANGE (Studio Manager only)
export const approvePendingChange = createAsyncThunk(
  "Approvals/approvePendingChange",
  async (id, thunkAPI) => {
    try {
      const response = await API.put(`/Studio/PendingChanges/Approve/${id}`, {});
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

// 3. REJECT PENDING CHANGE (Studio Manager only)
export const rejectPendingChange = createAsyncThunk(
  "Approvals/rejectPendingChange",
  async (id, thunkAPI) => {
    try {
      await API.put(`/Studio/PendingChanges/Reject/${id}`, {});
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

const ApprovalsSlice = createSlice({
  name: "Approvals",
  initialState: {
    pendingChanges: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPendingChanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingChanges.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingChanges = action.payload || [];
      })
      .addCase(getPendingChanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approvePendingChange.fulfilled, (state, action) => {
        state.pendingChanges = state.pendingChanges.filter((p) => p._id !== action.payload);
      })
      .addCase(approvePendingChange.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(rejectPendingChange.fulfilled, (state, action) => {
        state.pendingChanges = state.pendingChanges.filter((p) => p._id !== action.payload);
      })
      .addCase(rejectPendingChange.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ApprovalsSlice.reducer;
