import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import CustomerReducer from "../features/CustomerSlice";
import adminReducer  from "../features/AdminSlice"
import passwordReducer from "../features/passwordSlice"
import EmployeeReducer from "../features/EmployeeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    Customer: CustomerReducer,
    admin: adminReducer,
    password:passwordReducer,
    Employee: EmployeeReducer,
  },
});