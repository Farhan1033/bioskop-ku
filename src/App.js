import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "../src/routers/Router.jsx";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BookingProvider } from "./context/BookingContext.jsx";
import { SelectedSeatsProvider } from "./context/SeatContext.jsx";

function App() {
  return (
    <React.StrictMode>
      <BookingProvider >
        <SelectedSeatsProvider>
          <RouterProvider router={router} />
        </SelectedSeatsProvider>
      </BookingProvider>
    </React.StrictMode>
  );
}

export default App;
