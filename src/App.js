import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "../src/routers/Router.jsx";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
