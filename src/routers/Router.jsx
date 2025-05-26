import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import DetailMovie from "../pages/DetailMovie.jsx";
import BookingPage from "../pages/BookingPage.jsx";
import QuantityPage from "../pages/QuantityPage.jsx";
import SeatPage from "../pages/SeatPage.jsx";
import CheckoutPage from "../pages/CheckoutPage.jsx";
import RecieptPage from "../pages/ReceiptPage.jsx";
import HistoryPage from "../pages/HistoryPage.jsx";
import DetailHistory from "../pages/DetailHistoryPage.jsx";
import SearchPage from "../pages/SearchPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to='/home' replace />
            },
            {
                path: "home",
                element: <HomePage />
            },
            {
                path: "history",
                element: <HistoryPage />
            },
            {
                path: "detail-history/:movieTitle",
                element: <DetailHistory />
            },
            {
                path: "search",
                element: <SearchPage />
            },
        ]
    },
    {
        path: "detail-movie/:id",
        element: <DetailMovie />
    },
    {
        path: "booking-movie/:id",
        element: <BookingPage />
    },
    {
        path: "quantity-seats",
        element: <QuantityPage />
    },
    {
        path: "seats/:id",
        element: <SeatPage />
    },
    {
        path: "checkout",
        element: <CheckoutPage />
    },
    {
        path: "reciept/:id",
        element: <RecieptPage />
    },
    {
        path: "login",
        element: <LoginPage />
    },
    {
        path: "register",
        element: <RegisterPage />
    },
]);

export default router;
