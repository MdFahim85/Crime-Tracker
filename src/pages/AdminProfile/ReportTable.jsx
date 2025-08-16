import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportTable({ reports }) {
  const [localReports, setLocalReports] = useState(reports);

  const handleDelete = (id) => {
    setLocalReports(localReports.filter((r) => r.id !== id));
  };

  const handleApprove = (id) => {
    setLocalReports(
      localReports.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  return (
    <div className="w-full max-w-8xl p-2 sm:p-6 bg-slate-100 shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Crime Reports</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden sm:table-cell">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Crime Type</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localReports.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="hidden sm:table-cell">{r.id}</TableCell>
              <TableCell>{r.title}</TableCell>
              <TableCell>{r.crimeType}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {new Date(r.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    r.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {r.status}
                </span>
              </TableCell>
              <TableCell className="flex gap-2 items-center justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={r.status === "approved"}
                  onClick={() => handleApprove(r.id)}
                >
                  {r.status === "pending" ? "Approve" : "Approved"}
                </Button>

                <Button
                  variant="destructive"
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
    </div>
  );
}
