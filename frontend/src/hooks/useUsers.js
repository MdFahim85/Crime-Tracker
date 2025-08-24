import { useState, useEffect } from "react";
import API from "../api/axios";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users");
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setError(err || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, fetchUsers };
}
