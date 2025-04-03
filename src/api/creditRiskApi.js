// src/api/creditRiskApi.js
import axios from "axios";

const API_BASE_URL = "https://risk-predictions.appsprojectbook.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  checkHealth: () => api.get("/health"),

  // Data summary
  getDataSummary: () => api.get("/data/summary"),

  // Get paginated data
  getData: (page = 1, perPage = 100, filters = {}) => {
    const params = { page, per_page: perPage, ...filters };
    return api.get("/data", { params });
  },

  // Make prediction
  predict: (data) => api.post("/ml/predict", data),
};

// Data mapping utilities
export const dataMappings = {
  homeOwnership: {
    0: "OWN",
    1: "MORTGAGE",
    2: "RENT",
    3: "OTHER",
  },
  loanIntent: {
    0: "EDUCATION",
    1: "MEDICAL",
    2: "VENTURE",
    3: "PERSONAL",
    4: "HOMEIMPROVEMENT",
    5: "DEBTCONSOLIDATION",
  },
  loanGrade: {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
    5: "F",
    6: "G",
  },
  defaultOnFile: {
    0: "N",
    1: "Y",
  },
  loanStatus: {
    0: "Non-Default",
    1: "Default",
  },
};

// Reverse mappings for encoding
export const reverseMappings = {
  homeOwnership: Object.entries(dataMappings.homeOwnership).reduce(
    (acc, [key, value]) => {
      acc[value] = parseInt(key);
      return acc;
    },
    {}
  ),
  loanIntent: Object.entries(dataMappings.loanIntent).reduce(
    (acc, [key, value]) => {
      acc[value] = parseInt(key);
      return acc;
    },
    {}
  ),
  loanGrade: Object.entries(dataMappings.loanGrade).reduce(
    (acc, [key, value]) => {
      acc[value] = parseInt(key);
      return acc;
    },
    {}
  ),
  defaultOnFile: Object.entries(dataMappings.defaultOnFile).reduce(
    (acc, [key, value]) => {
      acc[value] = parseInt(key);
      return acc;
    },
    {}
  ),
};

export default apiService;
