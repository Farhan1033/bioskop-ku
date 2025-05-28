import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";

// Halaman
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

// Admin
import HomeAdmin from "../pages/admin/HomeAdmin.jsx";
import AddMoviePage from "../pages/admin/AddMoviePage.jsx";
import AddSchedulePage from "../pages/admin/AddSchedulePage.jsx";
import ActivateSeatPage from "../pages/admin/ActivateSeatsPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/login" replace />,
            },
            {
                path: "home",
                element: <ProtectedRoute><HomePage /></ProtectedRoute>

            },
            {
                path: "history",
                element: <ProtectedRoute><HistoryPage /></ProtectedRoute>
            },
            {
                path: "detail-history/:id",
                element: <ProtectedRoute><DetailHistory /></ProtectedRoute>
            },
            {
                path: "search",
                element: <ProtectedRoute><SearchPage /></ProtectedRoute>
            },

        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "home-admin",
                element: (
                    <AdminRoute>
                        <HomeAdmin />
                    </AdminRoute>
                )
            },
            {
                path: "add-movie",
                element: (
                    <AdminRoute>
                        <AddMoviePage />
                    </AdminRoute>
                )
            },
            {
                path: "add-schedule",
                element: (
                    <AdminRoute>
                        <AddSchedulePage />
                    </AdminRoute>
                )
            },
            {
                path: "activate-all-seats",
                element: (
                    <AdminRoute>
                        <ActivateSeatPage />
                    </AdminRoute>
                )
            }
        ]
    },
    {
        path: "detail-movie/:id",
        element: <ProtectedRoute><DetailMovie /></ProtectedRoute>,
    },
    {
        path: "booking-movie/:id",
        element: <ProtectedRoute><BookingPage /></ProtectedRoute>,
    },
    {
        path: "quantity-seats",
        element: <ProtectedRoute><QuantityPage /></ProtectedRoute>,
    },
    {
        path: "seats/:id",
        element: <ProtectedRoute><SeatPage /></ProtectedRoute>,
    },
    {
        path: "checkout",
        element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>,
    },
    {
        path: "receipt",
        element: <ProtectedRoute><RecieptPage /></ProtectedRoute>,
    },
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "register",
        element: <RegisterPage />,
    }
]);

export default router;
