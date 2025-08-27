import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NoReportFound from "../../components/NoReportFound";
import API from "../../api/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pagination } from "../../components/Pagination";

export default function ReportTable({ fetchReports }) {
  const [filter, setFilter] = useState("all"); //
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [loading, setLoading] = useState(true);

  const fetchPageRep = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/reports?page=${page}&limit=10`);
      setReports(response.data.reports);
      setNext(response.data.next);
      setPrev(response.data.prev);
      setLoading(false);
    } catch (error) {
      setReports([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageRep();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/reports/${id}`);
      console.log(res);
      toast.success("Report deleted successfully.");
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete the report.");
    }
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="w-full max-w-8xl p-2 sm:p-6 bg-slate-100 shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Crime Reports</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setFilter("all")}
            className={`${filter === "all" ? "bg-slate-500 text-white" : ""}`}
          >
            All
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setFilter("approved")}
            className={`${
              filter === "approved" ? "bg-slate-500 text-white" : ""
            }`}
          >
            Approved
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setFilter("rejected")}
            className={`${
              filter === "rejected" ? "bg-slate-500 text-white" : ""
            }`}
          >
            Rejected
          </Button>
        </div>
      </div>
      {filteredReports.length === 0 ? (
        <NoReportFound />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Crime Type</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((r, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Link to={`/crime/${r._id}`} className="block w-full h-full">
                    {r.title} 🔗
                  </Link>
                </TableCell>
                <TableCell>{r.user.username}</TableCell>
                <TableCell>{r.crimeType}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(r.date).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className={
                    r.status === "approved"
                      ? "text-green-600 font-semibold"
                      : r.status === "pending"
                      ? "text-yellow-600 font-semibold"
                      : r.status === "rejected"
                      ? "text-red-600 font-semibold"
                      : ""
                  }
                >
                  {r.status}
                </TableCell>

                <TableCell className="flex gap-2">
                  <Button
                    variant="second"
                    size="sm"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {next || prev ? (
        <Pagination setPage={setPage} prev={prev} page={page} next={next} />
      ) : (
        ""
      )}
    </div>
  );
}
