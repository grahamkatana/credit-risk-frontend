// src/components/dashboard/SummaryCards.jsx
import { Row, Col, Card } from "react-bootstrap";

const SummaryCards = ({ summaryData }) => {
  // Calculate metrics from summary data
  const totalRecords = summaryData.total_records || 0;
  const defaultCount = summaryData.loan_status_distribution?.[1] || 0;
  const nonDefaultCount = summaryData.loan_status_distribution?.[0] || 0;
  const defaultRate =
    totalRecords > 0 ? (defaultCount / totalRecords) * 100 : 0;

  return (
    <Row>
      <Col md={3}>
        <Card bg="dark" text="white" className="mb-4 border-primary">
          <Card.Body>
            <Card.Title className="text-muted">Total Records</Card.Title>
            <Card.Text className="display-6">
              {totalRecords.toLocaleString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card bg="dark" text="white" className="mb-4 border-success">
          <Card.Body>
            <Card.Title className="text-muted">Non-Default Loans</Card.Title>
            <Card.Text className="display-6">
              {nonDefaultCount.toLocaleString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card bg="dark" text="white" className="mb-4 border-danger">
          <Card.Body>
            <Card.Title className="text-muted">Default Loans</Card.Title>
            <Card.Text className="display-6">
              {defaultCount.toLocaleString()}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={3}>
        <Card bg="dark" text="white" className="mb-4 border-warning">
          <Card.Body>
            <Card.Title className="text-muted">Default Rate</Card.Title>
            <Card.Text className="display-6">
              {defaultRate.toFixed(2)}%
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SummaryCards;
