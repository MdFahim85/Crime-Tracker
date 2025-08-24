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
import SuggestionTrigger from "./SuggestionTrigger";
import { useEffect, useState } from "react";
import ReportModal from "./ReportModal";
import NoReportFound from "../../components/NoReportFound";
import { useReports } from "../../hooks/useReports";
import API from "../../api/axios";

export default function PendingReportTable({ reports, fetchReports }) {
  const pendingReports = reports.filter((report) => report.status == "pending");
  const [suggestion, setSuggestion] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReject = async (id) => {
    try {
      await API.patch(`/reports/${id}/status`, {
        status: "rejected",
        suggestion,
      });
      setSuggestion("");
      fetchReports();
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (id) => {
    await API.patch(`/reports/${id}/status`, {
      status: "approved",
    });
    fetchReports();
  };

  if (pendingReports.length === 0) {
    return (
      <Card className="w-full h-fit max-w-8xl p-4 bg-slate-100 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Pending Reports</h2>
        <NoReportFound />
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
              <TableHead>Author</TableHead>
              <TableHead>Crime Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingReports.map((r, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {r.title}
                  <Button
                    variant="link"
                    onClick={() => setSelectedReport(r)}
                    className=" px-2 "
                  >
                    🔗
                  </Button>
                </TableCell>
                <TableCell>{r.user.username}</TableCell>
                <TableCell>{r.crimeType}</TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className="text-yellow-600 font-semibold">
                    {r.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(r._id)}
                  >
                    Approve
                  </Button>

                  <SuggestionTrigger
                    r={r}
                    handleSuggest={handleReject}
                    suggestion={suggestion}
                    setSuggestion={setSuggestion}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <ReportModal
          report={selectedReport}
          open={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      </div>
    </div>
  );
}
