import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Page from "./Success";
import DonationPage from "./donations";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "success",
    element: <Page />,
  },
  {
    path: "donations",
    element: <DonationPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
