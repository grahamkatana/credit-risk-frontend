// src/pages/DataExplorer.jsx
import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Card,
  Row,
  Col,
  Form,
  Button,
  Pagination,
  Spinner,
  Badge,
} from "react-bootstrap";
import apiService, { dataMappings } from "../api/creditRiskApi";

const DataExplorer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 20,
    totalPages: 0,
    totalRecords: 0,
  });
  const [filters, setFilters] = useState({
    loan_status: "",
  });

  // Fetch data with current pagination and filters
  const fetchData = async () => {
    try {
      setLoading(true);

      // Add loan_status filter only if it's not empty
      const apiFilters = { ...filters };
      if (apiFilters.loan_status === "") {
        delete apiFilters.loan_status;
      }

      const response = await apiService.getData(
        pagination.page,
        pagination.perPage,
        apiFilters
      );

      setData(response.data || []);
      setPagination({
        ...pagination,
        totalPages: response.pagination?.total_pages || 0,
        totalRecords: response.pagination?.total_records || 0,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  // Fetch data on component mount and when pagination/filters change
  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.perPage, filters]);

  // Handle page change
  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    // Reset to first page when filters change
    setPagination({
      ...pagination,
      page: 1,
    });
  };

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];

    // Previous button
    pages.push(
      <Pagination.Prev
        key="prev"
        disabled={pagination.page === 1}
        onClick={() => handlePageChange(pagination.page - 1)}
      />
    );

    // First page
    if (pagination.page > 3) {
      pages.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );

      if (pagination.page > 4) {
        pages.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    // Pages around current page
    for (
      let i = Math.max(1, pagination.page - 2);
      i <= Math.min(pagination.totalPages, pagination.page + 2);
      i++
    ) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === pagination.page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Last page
    if (pagination.page < pagination.totalPages - 2) {
      if (pagination.page < pagination.totalPages - 3) {
        pages.push(<Pagination.Ellipsis key="ellipsis2" />);
      }

      pages.push(
        <Pagination.Item
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
        >
          {pagination.totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    pages.push(
      <Pagination.Next
        key="next"
        disabled={pagination.page === pagination.totalPages}
        onClick={() => handlePageChange(pagination.page + 1)}
      />
    );

    return <Pagination>{pages}</Pagination>;
  };

  return (
    <Container fluid>
      <h1 className="mb-4">Data Explorer</h1>

      <Card bg="dark" text="white" className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Filters</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Loan Status</Form.Label>
                <Form.Select
                  name="loan_status"
                  value={filters.loan_status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  {Object.entries(dataMappings.loanStatus).map(
                    ([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    )
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Records per page</Form.Label>
                <Form.Select
                  value={pagination.perPage}
                  onChange={(e) =>
                    setPagination({
                      ...pagination,
                      perPage: parseInt(e.target.value),
                      page: 1,
                    })
                  }
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-end">
              <Button variant="primary" onClick={fetchData}>
                Refresh Data
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card bg="dark" text="white">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Loan Data</h5>
          <div>
            <Badge bg="primary">
              Showing {data.length} of {pagination.totalRecords} records
            </Badge>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading data...</p>
            </div>
          ) : error ? (
            <div className="p-4">
              <div className="alert alert-danger">{error}</div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Age</th>
                    <th>Income</th>
                    <th>Ownership</th>
                    <th>Emp. Length</th>
                    <th>Intent</th>
                    <th>Grade</th>
                    <th>Amount</th>
                    <th>Int. Rate</th>
                    <th>Status</th>
                    <th>Def. History</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((loan) => (
                    <tr key={loan.id}>
                      <td>{loan.id}</td>
                      <td>{loan.person_age}</td>
                      <td>${loan.person_income.toLocaleString()}</td>
                      <td>
                        {dataMappings.homeOwnership[loan.person_home_ownership]}
                      </td>
                      <td>{loan.person_emp_length} yrs</td>
                      <td>{dataMappings.loanIntent[loan.loan_intent]}</td>
                      <td>{dataMappings.loanGrade[loan.loan_grade]}</td>
                      <td>${loan.loan_amnt.toLocaleString()}</td>
                      <td>{loan.loan_int_rate}%</td>
                      <td>
                        <Badge
                          bg={loan.loan_status === 0 ? "success" : "danger"}
                        >
                          {dataMappings.loanStatus[loan.loan_status]}
                        </Badge>
                      </td>
                      <td>
                        {
                          dataMappings.defaultOnFile[
                            loan.cb_person_default_on_file
                          ]
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-center">
            {renderPagination()}
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default DataExplorer;
