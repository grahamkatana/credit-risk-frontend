// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import apiService from '../api/creditRiskApi';
import SummaryCards from '../components/dashboard/SummaryCards';
import LoanDistributionChart from '../components/charts/LoanDistributionChart';
import DefaultRateChart from '../components/charts/DefaultRateChart';
import LoanGradeChart from '../components/charts/LoanGradeChart';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const summary = await apiService.getDataSummary();
        setSummaryData(summary.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <Container>
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container fluid className="dashboard-container">
      <h1 className="mb-4">Credit Risk Dashboard</h1>
      
      {/* Summary Cards */}
      <SummaryCards summaryData={summaryData} />
      
      {/* Charts Section */}
      <Row className="mt-4">
        <Col lg={6}>
          <Card bg="dark" text="white" className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Loan Amount Distribution</h5>
            </Card.Header>
            <Card.Body>
              <LoanDistributionChart />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card bg="dark" text="white" className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Default Rate by Month</h5>
            </Card.Header>
            <Card.Body>
              <DefaultRateChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={6}>
          <Card bg="dark" text="white" className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Default Rate by Loan Grade</h5>
            </Card.Header>
            <Card.Body>
              <LoanGradeChart />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card bg="dark" text="white" className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Feature Correlation Heatmap</h5>
            </Card.Header>
            <Card.Body>
              <CorrelationHeatmap />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;