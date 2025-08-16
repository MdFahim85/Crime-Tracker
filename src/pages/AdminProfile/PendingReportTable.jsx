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

export default function PendingReportTable({ reports }) {
  const [localReports, setLocalReports] = useState(
    reports.filter((r) => r.status === "pending")
  );

  const handleDelete = (id) => {
    setLocalReports(localReports.filter((r) => r.id !== id));
  };

  const handleApprove = (id) => {
    setLocalReports(
      localReports.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  return (
    <div className="w-full max-w-6xl p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Pending Reports</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localReports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.location}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-sm bg-yellow-200 text-yellow-800">
                    {r.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(r.id)}
                  >
                    Approve
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
    </div>
  );
}
