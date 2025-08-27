import { Button } from "@/components/ui/button";
export function Pagination({ setPage, prev, page, next }) {
  return (
    <div className="flex gap-2 justify-center my-4">
      <Button
        size="icon"
        variant="ghost"
        className="hover:translate-x-1 shadow-md"
        onClick={() => setPage((prev) => prev - 1)}
        disabled={!prev}
      >
        {"⬅️"}
      </Button>
      <span className="px-2 py-1 text-slate-500">
        <span className="font-normal text-slate-900">{page}</span>
      </span>
      <Button
        size="icon"
        variant="ghost"
        className="hover:translate-x-1 shadow-md"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={!next}
      >
        {"➡️"}
      </Button>
    </div>
  );
}
