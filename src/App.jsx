// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.scss";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import DataExplorer from "./pages/DataExplorer";
import RiskPrediction from "./pages/RiskPrediction";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          {/* <Route path="explorer" element={<DataExplorer />} /> */}
          <Route path="predict" element={<RiskPrediction />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
