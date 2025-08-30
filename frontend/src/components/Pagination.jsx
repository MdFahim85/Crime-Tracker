import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ setPage, prev, page, next }) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage((prev) => prev - 1)}
        disabled={!prev}
        className="flex items-center gap-2 h-9 px-3 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Previous
      </Button>

      <Badge
        variant="secondary"
        className="px-4 py-2 bg-slate-100 text-slate-700"
      >
        Page {page}
      </Badge>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!next}
        className="flex items-center gap-2 h-9 px-3 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        Next
        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </div>
  );
}
