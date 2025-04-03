// src/pages/RiskPrediction.jsx
import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
  ProgressBar,
  Badge,
  Table,
  Accordion,
} from "react-bootstrap";
import apiService, {
  dataMappings,
  reverseMappings,
} from "../api/creditRiskApi";

const RiskPrediction = () => {
  const [formData, setFormData] = useState({
    person_age: 35,
    person_income: 85000,
    person_home_ownership: 1, // MORTGAGE
    person_emp_length: 12.0,
    loan_intent: 3, // PERSONAL
    loan_grade: 1, // B
    loan_amnt: 15000,
    loan_int_rate: 12.5,
    loan_percent_income: 0.18,
    cb_person_default_on_file: 0, // N
    cb_person_cred_hist_length: 15,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate derived fields
  const debtToIncome = formData.loan_amnt / formData.person_income;
  const incomeToLoanRatio = formData.person_income / formData.loan_amnt;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Convert numeric values
    if (type === "number" || type === "range") {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      // Add derived fields
      const predictionData = {
        ...formData,
        debt_to_income: debtToIncome,
        income_to_loan_ratio: incomeToLoanRatio,
      };

      // Make API call
      const result = await apiService.predict(predictionData);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction error:", error);
      setError("Error making prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      person_age: 35,
      person_income: 85000,
      person_home_ownership: 1,
      person_emp_length: 12.0,
      loan_intent: 3,
      loan_grade: 1,
      loan_amnt: 15000,
      loan_int_rate: 12.5,
      loan_percent_income: 0.18,
      cb_person_default_on_file: 0,
      cb_person_cred_hist_length: 15,
    });
    setPrediction(null);
  };

  return (
    <Container fluid>
      <h1 className="mb-4">Credit Risk Prediction</h1>

      <Row>
        <Col lg={7}>
          <Card bg="dark" text="white" className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-calculator me-2"></i>Loan Application
                Details
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{" "}
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Personal Information */}
                  <Col md={6}>
                    <h6 className="text-white mb-3">Personal Information</h6>

                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="person_age"
                        value={formData.person_age}
                        onChange={handleInputChange}
                        min="18"
                        max="100"
                        required
                      />
                      <Form.Text muted>Applicant's age (18-100)</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Annual Income</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <Form.Control
                          type="number"
                          name="person_income"
                          value={formData.person_income}
                          onChange={handleInputChange}
                          min="10000"
                          step="1000"
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Home Ownership</Form.Label>
                      <Form.Select
                        name="person_home_ownership"
                        value={formData.person_home_ownership}
                        onChange={handleInputChange}
                        required
                      >
                        {Object.entries(dataMappings.homeOwnership).map(
                          ([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Employment Length (years)</Form.Label>
                      <Form.Control
                        type="number"
                        name="person_emp_length"
                        value={formData.person_emp_length}
                        onChange={handleInputChange}
                        min="0"
                        max="60"
                        step="0.5"
                        required
                      />
                      <Form.Text muted>Years at current employer</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Credit History Length (years)</Form.Label>
                      <Form.Control
                        type="number"
                        name="cb_person_cred_hist_length"
                        value={formData.cb_person_cred_hist_length}
                        onChange={handleInputChange}
                        min="0"
                        max="60"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Previous Default on File</Form.Label>
                      <Form.Select
                        name="cb_person_default_on_file"
                        value={formData.cb_person_default_on_file}
                        onChange={handleInputChange}
                        required
                      >
                        {Object.entries(dataMappings.defaultOnFile).map(
                          ([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Loan Information */}
                  <Col md={6}>
                    <h6 className="text-white mb-3">Loan Information</h6>

                    <Form.Group className="mb-3">
                      <Form.Label>Loan Intent</Form.Label>
                      <Form.Select
                        name="loan_intent"
                        value={formData.loan_intent}
                        onChange={handleInputChange}
                        required
                      >
                        {Object.entries(dataMappings.loanIntent).map(
                          ([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Loan Grade</Form.Label>
                      <Form.Select
                        name="loan_grade"
                        value={formData.loan_grade}
                        onChange={handleInputChange}
                        required
                      >
                        {Object.entries(dataMappings.loanGrade).map(
                          ([code, label]) => (
                            <option key={code} value={code}>
                              {label}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Loan Amount</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <Form.Control
                          type="number"
                          name="loan_amnt"
                          value={formData.loan_amnt}
                          onChange={handleInputChange}
                          min="1000"
                          max="100000"
                          step="1000"
                          required
                        />
                      </div>
                      <Form.Text muted>Amount requested in USD</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Interest Rate (%)</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type="number"
                          name="loan_int_rate"
                          value={formData.loan_int_rate}
                          onChange={handleInputChange}
                          min="1"
                          max="30"
                          step="0.1"
                          required
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Loan Percent Income</Form.Label>
                      <Form.Control
                        type="number"
                        name="loan_percent_income"
                        value={formData.loan_percent_income}
                        onChange={handleInputChange}
                        min="0.01"
                        max="1"
                        step="0.01"
                        required
                      />
                      <Form.Text muted>Value between 0.01 and 1.0</Form.Text>
                    </Form.Group>

                    <h6 className="text-primary mb-3 mt-4">Derived Fields</h6>

                    <Form.Group className="mb-3">
                      <Form.Label>Debt-to-Income Ratio</Form.Label>
                      <Form.Control
                        type="text"
                        value={debtToIncome.toFixed(3)}
                        className="bg-dark text-white"
                        disabled
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Income-to-Loan Ratio</Form.Label>
                      <Form.Control
                        type="text"
                        value={incomeToLoanRatio.toFixed(2)}
                        className="bg-dark text-white"
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={handleReset}>
                    <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
                    Form
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Processing...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calculator me-1"></i> Predict
                        Default Risk
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card bg="dark" text="white" className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>Prediction Result
              </h5>
            </Card.Header>
            <Card.Body>
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <p className="mt-3">Analyzing loan risk...</p>
                </div>
              )}

              {error && (
                <Alert variant="danger">
                  <Alert.Heading>Error</Alert.Heading>
                  <p>{error}</p>
                </Alert>
              )}

              {!loading && !error && prediction && (
                <>
                  <div className="mb-4 text-center">
                    <h4>Risk Assessment</h4>
                    {(() => {
                      const defaultProb = prediction.probability[0][1] * 100;
                      let riskLevel, variant;

                      if (defaultProb < 25) {
                        riskLevel = "Low Risk";
                        variant = "success";
                      } else if (defaultProb < 50) {
                        riskLevel = "Moderate Risk";
                        variant = "warning";
                      } else {
                        riskLevel = "High Risk";
                        variant = "danger";
                      }

                      return (
                        <>
                          <div
                            className={`p-3 rounded-circle d-inline-block mt-3 bg-${variant}`}
                            style={{ width: "150px", height: "150px" }}
                          >
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <div className="text-white">
                                <h3>
                                  {prediction.prediction[0] === 0
                                    ? "Non-Default"
                                    : "Default"}
                                </h3>
                                <h5>
                                  {(
                                    prediction.probability[0][
                                      prediction.prediction[0]
                                    ] * 100
                                  ).toFixed(2)}
                                  %
                                </h5>
                                <p className="mb-0">confidence</p>
                              </div>
                            </div>
                          </div>
                          <h4 className={`mt-3 text-${variant}`}>
                            {riskLevel}
                          </h4>

                          <div className="mt-4 mb-3">
                            <h5>Default Probability</h5>
                            <ProgressBar className="mt-2">
                              <ProgressBar variant="success" now={25} key={1} />
                              <ProgressBar variant="warning" now={25} key={2} />
                              <ProgressBar variant="danger" now={50} key={3} />
                            </ProgressBar>
                            <div className="d-flex justify-content-between mt-1">
                              <small>0%</small>
                              <small>25%</small>
                              <small>50%</small>
                              <small>100%</small>
                            </div>
                            <div
                              className="position-relative mt-3"
                              style={{ height: "30px" }}
                            >
                              <div
                                className="position-absolute"
                                style={{
                                  left: `${defaultProb}%`,
                                  top: "-15px",
                                  transform: "translateX(-50%)",
                                }}
                              >
                                <div
                                  className={`bg-${variant} text-white rounded px-2 py-1 small`}
                                >
                                  {defaultProb.toFixed(2)}%
                                </div>
                                <div
                                  className={`bg-${variant}`}
                                  style={{
                                    width: "3px",
                                    height: "15px",
                                    margin: "0 auto",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="mt-4">
                    <h5>Model Details</h5>
                    <Table bordered size="sm" variant="dark">
                      <tbody>
                        <tr>
                          <th>Model Name</th>
                          <td>{prediction.model_info.name}</td>
                        </tr>
                        <tr>
                          <th>Model Version</th>
                          <td>{prediction.model_info.version}</td>
                        </tr>
                      </tbody>
                    </Table>

                    {prediction.model_info.metrics && (
                      <div>
                        <h6 className="mt-3">Model Performance Metrics</h6>
                        <Row>
                          <Col xs={6}>
                            <p className="mb-1">
                              <strong>Accuracy:</strong>{" "}
                              {JSON.parse(
                                prediction.model_info.metrics
                              ).accuracy.toFixed(4)}
                            </p>
                            <p className="mb-1">
                              <strong>Precision:</strong>{" "}
                              {JSON.parse(
                                prediction.model_info.metrics
                              ).precision.toFixed(4)}
                            </p>
                          </Col>
                          <Col xs={6}>
                            <p className="mb-1">
                              <strong>Recall:</strong>{" "}
                              {JSON.parse(
                                prediction.model_info.metrics
                              ).recall.toFixed(4)}
                            </p>
                            <p className="mb-1">
                              <strong>F1 Score:</strong>{" "}
                              {JSON.parse(
                                prediction.model_info.metrics
                              ).f1.toFixed(4)}
                            </p>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </div>

                  <Alert
                    variant={
                      prediction.prediction[0] === 0 ? "success" : "danger"
                    }
                    className="mt-4"
                  >
                    {prediction.prediction[0] === 0
                      ? "This loan has a low risk of default. Recommended for approval."
                      : "This loan has a high risk of default. Caution is advised."}
                  </Alert>

                  <Accordion className="mt-4">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <i className="bi bi-code-slash me-2"></i>View API
                        Response
                      </Accordion.Header>
                      <Accordion.Body>
                        <pre
                          className="bg-dark text-light p-3"
                          style={{ overflow: "auto" }}
                        >
                          {JSON.stringify(prediction, null, 2)}
                        </pre>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </>
              )}

              {!loading && !error && !prediction && (
                <div className="text-center py-5">
                  <p className="text-muted">
                    Complete the form and click "Predict Default Risk" to
                    analyze this loan application.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RiskPrediction;
