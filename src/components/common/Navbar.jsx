// src/components/common/Navbar.jsx
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import apiService from "../../api/creditRiskApi";

const AppNavbar = () => {
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await apiService.checkHealth();
        setApiStatus("online");
      } catch (error) {
        setApiStatus("offline");
      }
    };

    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header mb-4">
      <Container fluid>
        <Navbar expand="lg" className="p-0">
          <Navbar.Brand as={Link} to="/" className="logo-text">
            <i className="bi bi-graph-up-arrow me-2"></i>
            Credit Risk Analytics
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="border-0"
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                className="px-3 py-2 position-relative"
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/predict"
                className="px-3 py-2 position-relative"
              >
                Risk Prediction
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/analytics"
                className="px-3 py-2 position-relative"
              >
                Analytics
              </Nav.Link>
            </Nav>
            <div className="d-flex align-items-center">
              <div className="me-3 text-white">
                API Status:
                <Badge
                  bg={
                    apiStatus === "online"
                      ? "success"
                      : apiStatus === "checking"
                      ? "warning"
                      : "danger"
                  }
                  className="ms-2"
                >
                  {apiStatus === "online" ? (
                    <>
                      <i className="bi bi-heart-pulse me-1"></i> {apiStatus}
                    </>
                  ) : apiStatus === "checking" ? (
                    <>
                      <i className="bi bi-hourglass-split me-1"></i> {apiStatus}
                    </>
                  ) : (
                    <>
                      <i className="bi bi-exclamation-triangle me-1"></i>{" "}
                      {apiStatus}
                    </>
                  )}
                </Badge>
              </div>
              <Link to="/predict" className="btn btn-outline-accent me-2">
                <i className="bi bi-calculator me-1"></i> Predict
              </Link>
              <Link to="/" className="btn btn-accent">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </div>
  );
};

export default AppNavbar;
