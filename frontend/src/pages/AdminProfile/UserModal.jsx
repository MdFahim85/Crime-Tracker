import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import API from "../../api/axios";
import NoReportFound from "../../components/NoReportFound";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, ExternalLink, XCircle } from "lucide-react";
import { Pagination } from "../../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function UserModal({ userId, open, onClose }) {
  if (!userId) return null;
  const [userReports, setUserReports] = useState([]);
  const [page, setPage] = useState(1);
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [loading, setLoading] = useState(false);

  const handleDetails = async (id) => {
    try {
      setLoading(true);
      const res = await API.get(`/users/${id}/reports?page=${page}&limit=10`);
      console.log(res.data.reports);
      setUserReports(res.data.reports);
      setNext(res.data.next);
      setPrev(res.data.prev);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setUserReports([]);
    }
  };

  useEffect(() => {
    handleDetails(userId);
  }, [page]);

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-3xl rounded-2xl p-8 bg-gray-50 shadow-2xl border-0 overflow-hidden">
        {userReports.length ? (
          !loading ? (
            <>
              <Table className="w-full ">
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
                  {userReports.map((r, index) => {
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
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
                          >
                            {" "}
                            <status.icon className="size-3" />
                            {r.status.charAt(0).toUpperCase() +
                              r.status.slice(1)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {userReports.length && (next || prev) && (
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
          )
        ) : (
          <NoReportFound />
        )}
      </DialogContent>
    </Dialog>
  );
}
