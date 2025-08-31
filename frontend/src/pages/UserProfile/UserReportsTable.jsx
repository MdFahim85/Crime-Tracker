import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";
import NoReportFound from "../../components/NoReportFound";

function UserReportsTable({ reports }) {
  const getStatus = (report) => {
    const status = {};
    const reportStatus = report.status.toLowerCase();
    if (reportStatus == "pending") {
      status.color = "bg-yellow-500";
      status.icon = Clock;
    }
    if (reportStatus === "approved") {
      status.color = "bg-green-500";
      status.icon = CheckCircle;
    }
    if (reportStatus == "rejected") {
      status.color = "bg-red-500";
      status.icon = XCircle;
    }
    return status;
  };
  if (!reports.length) {
    return (
      <div className="flex justify-center items-center h-full">
        {" "}
        <NoReportFound />{" "}
      </div>
    );
  }
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="bg-gray-50/50 hover:bg-gray-50">
          <TableHead className="font-semibold text-gray-700 w-16">#</TableHead>
          <TableHead className="font-semibold text-gray-700">Title</TableHead>
          <TableHead className="font-semibold text-gray-700">
            Crime Type
          </TableHead>
          <TableHead className="hidden sm:table-cell font-semibold text-gray-700">
            Date
          </TableHead>
          <TableHead className="font-semibold text-gray-700">Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {reports.map((r, index) => {
          const status = getStatus(r);
          return (
            <TableRow
              key={index}
              className="group hover:bg-slate-50 transition-all duration-200"
            >
              <TableCell className="font-medium text-gray-600">
                {index + 1}
              </TableCell>
              <TableCell>
                <Link
                  to={`/crime/${r._id}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                >
                  <span className="truncate max-w-[200px]">{r.title}</span>
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                </Link>
              </TableCell>

              <TableCell>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200">
                  {r.crimeType}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="text-gray-700 text-sm">
                  {new Date(r.date).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${status.color} `}
                >
                  {" "}
                  <status.icon className="size-4" />
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default UserReportsTable;
