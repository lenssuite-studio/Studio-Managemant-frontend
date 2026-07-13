import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./axiosInstance";

// 1. GET EMPLOYEES (Studio Manager only)
export const getEmployees = createAsyncThunk(
  "Employee/getEmployees",
  async (_, thunkAPI) => {
    try {
      const response = await API.get("/Studio/Employees");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

// 2. CREATE EMPLOYEE (Studio Manager only)
export const createEmployee = createAsyncThunk(
  "Employee/createEmployee",
  async (employeeData, thunkAPI) => {
    try {
      const response = await API.post("/Studio/Employees", employeeData);
      return response.data.employee;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || error.message,
      );
    }
  },
);

const EmployeeSlice = createSlice({
  name: "Employee",
  initialState: {
    employees: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload || [];
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.unshift(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default EmployeeSlice.reducer;
