import { Outlet } from "react-router-dom";
import Headers from "../components/Header.jsx";

export default function MainLayout() {
  return (
    <>
      <Headers />
      <main className="container my-4">
        <Outlet />
      </main>
    </>
  );
}
