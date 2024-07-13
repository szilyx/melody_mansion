import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Favorites from './Favorites';

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>
    },
    {
        path: "favorites",
        element: <Favorites/>
      },
  ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
