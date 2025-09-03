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
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Pagination } from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";

function UserReportsTable({ view }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reports/my?page=${page}&limit=10`);
      setReports(res.data.reports);
      setNext(res.data.next);
      setPrev(res.data.prev);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setReports([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page]);

  const filteredReports = reports.filter((r) =>
    view !== "submitted" ? r.status === view : r
  );

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
  if (!filteredReports.length) {
    return (
      <div className="flex justify-center items-center h-full">
        {" "}
        <NoReportFound />{" "}
      </div>
    );
  }
  return (
    <>
      {!loading ? (
        <>
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
                  Crime Type
                </TableHead>
                <TableHead className="hidden sm:table-cell font-semibold text-gray-700">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReports.map((r, index) => {
                const status = getStatus(r);
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
          {filteredReports.length && (next || prev) && (
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <Pagination
                setPage={setPage}
                prev={prev}
                page={page}
                next={next}
              />
            </div>
          )}
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}

export default UserReportsTable;
