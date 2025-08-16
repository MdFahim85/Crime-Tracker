import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { approveReport, deleteReport } from "../../feature/reportSlice";
import { Link } from "react-router-dom";

export default function PendingReportTable() {
  const reports = useSelector((state) => state.report.reports);
  const pendingReports = reports.filter((report) => report.status == "pending");
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteReport(id));
  };

  const handleApprove = (id) => {
    dispatch(approveReport(id));
  };

  if (pendingReports.length === 0) {
    return (
      <Card className="w-full h-fit max-w-8xl p-4 bg-slate-100 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Reports</h2>
        <p className="text-gray-500">No reports Pending.</p>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-8xl p-6 bg-slate-100 shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Pending Reports</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingReports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Link to={`/crime/${r.id}`} className="block w-full h-full">
                    {r.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/crime/${r.id}`} className="block w-full h-full">
                    {r.title}
                  </Link>
                </TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded text-sm bg-yellow-200 text-yellow-800">
                    {r.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(r.id)}
                  >
                    Approve
                  </Button>

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
      </div>
    </div>
  );
}
