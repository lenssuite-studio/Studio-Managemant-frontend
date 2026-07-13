import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import CustomerReducer from "../features/CustomerSlice";
import adminReducer  from "../features/AdminSlice"
import passwordReducer from "../features/passwordSlice"
import EmployeeReducer from "../features/EmployeeSlice"
import ProfileReducer from "../features/ProfileSlice"
import ApprovalsReducer from "../features/ApprovalsSlice"
import ActivityHistoryReducer from "../features/ActivityHistorySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    Customer: CustomerReducer,
    admin: adminReducer,
    password:passwordReducer,
    Employee: EmployeeReducer,
    Profile: ProfileReducer,
    Approvals: ApprovalsReducer,
    ActivityHistory: ActivityHistoryReducer,
  },
});