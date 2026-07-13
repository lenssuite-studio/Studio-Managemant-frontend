import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./styles/theme.css";

import { Provider } from "react-redux";
import { store } from "./app/Store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
