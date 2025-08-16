import { Card } from "@/components/ui/card";
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

export default function ReportTable() {
  const reports = useSelector((state) => state.report.reports);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteReport(id));
  };

  if (reports.length === 0) {
    return (
      <Card className="w-full h-fit max-w-8xl p-4 bg-slate-100 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Crime Reports</h2>
        <p className="text-gray-500">No reports Found.</p>
      </Card>
    );
  }

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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="hidden sm:table-cell">{r.id}</TableCell>
              <TableCell>{r.title}</TableCell>
              <TableCell>{r.crimeType}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {new Date(r.date).toLocaleDateString()}
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
    </div>
  );
}
