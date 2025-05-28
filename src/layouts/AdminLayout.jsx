import { Outlet } from "react-router-dom";
import Headers from "../components/Header.jsx";
import HeadersAdmin from "../components/HeaderAdmin.jsx";

export default function AdminLayout() {
  return (
    <>
      <HeadersAdmin />
      <main className="container my-4">
        <Outlet />
      </main>
    </>
  );
}
