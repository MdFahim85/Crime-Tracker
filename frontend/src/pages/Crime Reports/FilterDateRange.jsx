import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

function FilterDateRange({ filterDate, setFilterDate }) {
  const dateRange = [
    "Today",
    "Yesterday",
    "Last week",
    "Last month",
    "Last year",
  ];
  useEffect(() => {
    if (filterDate === "Today") {
      setFilterDate("Today");
    } else if (filterDate === "Yesterday") {
      setFilterDate("Yesterday");
    } else if (filterDate === "Last week") {
      setFilterDate("Last week");
    } else if (filterDate === "Last month") {
      setFilterDate("Last month");
    } else if (filterDate === "Last year") {
      setFilterDate("Last year");
    }
  }, [filterDate]);

  return (
    <div>
      <Label htmlFor="type" className="mb-2 block">
        Search by date range
      </Label>

      <Select id="type" value={"" || filterDate} onValueChange={setFilterDate}>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="Search by date range" />
        </SelectTrigger>
        <SelectContent>
          {dateRange.map((range) => (
            <SelectItem key={range} value={range}>
              {range}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterDateRange;
