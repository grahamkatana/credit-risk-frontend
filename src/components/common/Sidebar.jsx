// src/components/common/Sidebar.jsx
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div
      className="sidebar bg-dark border-end border-secondary"
      style={{ width: "240px" }}
    >
      <Nav className="flex-column p-3">
        <h6 className="text-uppercase text-muted mb-3">Main</h6>
        <Nav.Link
          as={Link}
          to="/"
          active={location.pathname === "/"}
          className="d-flex align-items-center"
        >
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/explorer"
          active={location.pathname === "/explorer"}
          className="d-flex align-items-center"
        >
          <i className="bi bi-table me-2"></i> Data Explorer
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/predict"
          active={location.pathname === "/predict"}
          className="d-flex align-items-center"
        >
          <i className="bi bi-calculator me-2"></i> Risk Prediction
        </Nav.Link>
        <Nav.Link
          as={Link}
          to="/analytics"
          active={location.pathname === "/analytics"}
          className="d-flex align-items-center"
        >
          <i className="bi bi-graph-up me-2"></i> Analytics
        </Nav.Link>

        <h6 className="text-uppercase text-muted mt-4 mb-3">Settings</h6>
        <Nav.Link href="#settings" className="d-flex align-items-center">
          <i className="bi bi-gear me-2"></i> Settings
        </Nav.Link>
        <Nav.Link href="#api-docs" className="d-flex align-items-center">
          <i className="bi bi-file-code me-2"></i> API Documentation
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
