import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { deleteReport } from "../../feature/reportSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ReportTable() {
  const reports = useSelector((state) => state.report.reports);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState("all"); //

  const handleDelete = (id) => {
    dispatch(deleteReport(id));
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

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
        <p className="text-gray-500">No reports Found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Crime Type</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="hidden sm:table-cell">{r.id}</TableCell>
                <TableCell>
                  <Link to={`/crime/${r.id}`} className="block w-full h-full">
                    {r.title} 🔗
                  </Link>
                </TableCell>
                <TableCell>{r.user}</TableCell>
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
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
