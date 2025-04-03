// src/components/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";

const MainLayout = () => {
  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className="col-12">
          <Navbar />
          <main className="w-100">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
