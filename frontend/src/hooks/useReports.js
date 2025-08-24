import { useState, useEffect } from "react";
import API from "../api/axios";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports");
      setReports(response.data.reports);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { reports, loading, error, fetchReports };
}
