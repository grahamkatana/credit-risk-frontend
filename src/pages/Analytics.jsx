// src/pages/Analytics.jsx
import { useState } from "react";
import { Container, Row, Col, Card, Nav, Tab } from "react-bootstrap";
import LoanGradeChart from "../components/charts/LoanGradeChart";
import CorrelationHeatmap from "../components/charts/CorrelationHeatmap";
import DefaultRateChart from "../components/charts/DefaultRateChart";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("creditRisk");

  return (
    <Container fluid>
      <h1 className="mb-4">Analytics & Insights</h1>

      <Card bg="dark" text="white" className="mb-4">
        <Card.Header>
          <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
            <Nav.Item>
              <Nav.Link eventKey="creditRisk">Credit Risk</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="customerSegmentation">
                Customer Segmentation
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="timeAnalysis">Time Series Analysis</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="modelPerformance">Model Performance</Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>
            <Tab.Pane eventKey="creditRisk" active={activeTab === "creditRisk"}>
              <h4 className="mb-4">Credit Risk Analysis</h4>
              <p>
                The following visualizations highlight key patterns and
                relationships in the credit risk data, helping identify factors
                that contribute most to loan defaults.
              </p>

              <Row>
                <Col lg={6}>
                  <Card
                    bg="dark"
                    text="white"
                    border="secondary"
                    className="mb-4"
                  >
                    <Card.Header>
                      <h5 className="mb-0">Default Rate by Loan Grade</h5>
                    </Card.Header>
                    <Card.Body>
                      <LoanGradeChart />
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Lower grade loans (D-G) show significantly higher
                        default rates, with grade G loans defaulting at over
                        50%.
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card
                    bg="dark"
                    text="white"
                    border="secondary"
                    className="mb-4"
                  >
                    <Card.Header>
                      <h5 className="mb-0">Feature Correlation Matrix</h5>
                    </Card.Header>
                    <Card.Body>
                      <CorrelationHeatmap />
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Interest rate shows the strongest positive correlation
                        with default risk, while income shows the strongest
                        negative correlation.
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col lg={12}>
                  <Card
                    bg="dark"
                    text="white"
                    border="secondary"
                    className="mb-4"
                  >
                    <Card.Header>
                      <h5 className="mb-0">Default Rate Trend</h5>
                    </Card.Header>
                    <Card.Body>
                      <DefaultRateChart />
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">
                        Default rates show seasonal patterns, with higher
                        defaults in Q4 and Q1.
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            <Tab.Pane
              eventKey="customerSegmentation"
              active={activeTab === "customerSegmentation"}
            >
              <h4 className="mb-4">Customer Segmentation</h4>
              <p>This section will contain customer segmentation analysis.</p>
              <div className="text-center py-5 text-muted">
                <p>
                  Customer segmentation visualizations will be displayed here.
                </p>
              </div>
            </Tab.Pane>

            <Tab.Pane
              eventKey="timeAnalysis"
              active={activeTab === "timeAnalysis"}
            >
              <h4 className="mb-4">Time Series Analysis</h4>
              <p>
                This section will contain time series analysis of loan
                performance.
              </p>
              <div className="text-center py-5 text-muted">
                <p>Time series visualizations will be displayed here.</p>
              </div>
            </Tab.Pane>

            <Tab.Pane
              eventKey="modelPerformance"
              active={activeTab === "modelPerformance"}
            >
              <h4 className="mb-4">Model Performance</h4>
              <p>This section will display ML model performance metrics.</p>
              <div className="text-center py-5 text-muted">
                <p>Model performance visualizations will be displayed here.</p>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Analytics;
