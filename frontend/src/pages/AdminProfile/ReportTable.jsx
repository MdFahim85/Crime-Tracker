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
import API from "../../api/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Pagination } from "../../components/Pagination";
import {
  FileText,
  Filter,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function ReportTable({ fetchReports }) {
  const [filter, setFilter] = useState("all");
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
      console.log(error);
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
      console.log(error);
      toast.error("Failed to delete the report.");
    }
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const filterOptions = [
    { value: "all", label: "All", icon: FileText },
    { value: "approved", label: "Approved", icon: CheckCircle },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "rejected", label: "Rejected", icon: XCircle },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 px-8 py-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Crime Reports
              </h2>
              <p className="text-sm text-gray-600">
                Monitor and manage incident reports
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-2">
              {filterOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.value}
                    size="sm"
                    variant="outline"
                    onClick={() => setFilter(option.value)}
                    className={`transition-all duration-200 ${
                      filter === option.value
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mx-4">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No reports found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filter
            </p>
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700 w-16">
                  #
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Title
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Author
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Crime Type
                </TableHead>
                <TableHead className="hidden sm:table-cell font-semibold text-gray-700">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReports.map((r, index) => {
                const globalIndex = (page - 1) * 10 + index + 1;

                return (
                  <TableRow
                    key={index}
                    className="group hover:bg-slate-50 transition-all duration-200"
                  >
                    <TableCell className="font-medium text-gray-600">
                      {globalIndex}
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/crime/${r._id}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                      >
                        <span className="truncate max-w-[200px]">
                          {r.title}
                        </span>
                        <ExternalLink className="h-4 w-4 flex-shrink-0" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">
                        {r.user?.username}
                      </span>
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
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(
                          r.status
                        )}`}
                      >
                        {getStatusIcon(r.status)}
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(r._id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {filteredReports.length && (next || prev) && (
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <Pagination setPage={setPage} prev={prev} page={page} next={next} />
        </div>
      )}
    </div>
  );
}
