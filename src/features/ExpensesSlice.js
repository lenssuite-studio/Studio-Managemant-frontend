import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./axiosInstance";

// 1. GET EXPENSES (Studio Manager only) — optional { from, to } ISO date strings
export const getExpenses = createAsyncThunk(
  "Expenses/getExpenses",
  async ({ from, to } = {}, thunkAPI) => {
    try {
      const response = await API.get("/Studio/Expenses", { params: { from, to } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

// 2. ADD EXPENSE (Studio Manager only)
export const addExpense = createAsyncThunk(
  "Expenses/addExpense",
  async (expenseData, thunkAPI) => {
    try {
      const response = await API.post("/Studio/Expenses", expenseData);
      return response.data.expense;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

// 3. DELETE EXPENSE (Studio Manager only)
export const deleteExpense = createAsyncThunk(
  "Expenses/deleteExpense",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/Studio/Expenses/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

const ExpensesSlice = createSlice({
  name: "Expenses",
  initialState: {
    expenses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload || [];
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default ExpensesSlice.reducer;
