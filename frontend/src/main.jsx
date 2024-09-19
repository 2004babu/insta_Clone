import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import ContextProvider from "./Context/ContextProvider.jsx";
// import { toast, ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
  <ContextProvider>
    
      <App />
  </ContextProvider>
    </Provider>
  </BrowserRouter>
);
