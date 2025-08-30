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
import API from "../../api/axios";
import {
  Clock,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  User,
  FileText,
} from "lucide-react";

export default function PendingReportTable({ fetchReports }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports");
      setReports(response.data.reports);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setReports([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendReports();
  }, []);

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
    try {
      await API.patch(`/reports/${id}/status`, {
        status: "approved",
      });
      fetchReports();
    } catch (error) {
      console.log(error);
      fetchReports();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center rounded-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">
            Loading pending reports...
          </p>
        </div>
      </div>
    );
  }

  if (pendingReports.length === 0) {
    return (
      <Card className="w-full h-fit bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Pending Reports
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-10 bg-green-100 rounded-xl mb-4 text-center flex flex-col justify-center items-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>No Pending Reports</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/80 backdrop-blur-sm shadow-xl border border-blue-100 rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Pending Reports
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {pendingReports.length} report
              {pendingReports.length !== 1 ? "s" : ""} awaiting review
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <span className="text-yellow-700 text-sm font-medium">
            Action Required
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-25 to-slate-25 rounded-xl border border-blue-50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50/50 border-b border-blue-100 hover:bg-blue-50/70">
                <TableHead className="font-semibold text-gray-700 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Title
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Author
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Crime Type
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingReports.map((r, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-blue-25 transition-colors duration-200 border-b border-blue-50/50"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {r.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReport(r)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {r.user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700">{r.user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {r.crimeType}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(r.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
                        {r.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(r._id)}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>

                      <SuggestionTrigger
                        r={r}
                        handleSuggest={handleReject}
                        suggestion={suggestion}
                        setSuggestion={setSuggestion}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ReportModal
        report={selectedReport}
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </Card>
  );
}
