import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

function OptionList({ crimeType, setCrimeType, label }) {
  const crimeTypes = [
    "Select a crime type",
    "Theft",
    "Assault",
    "Robbery",
    "Murder",
    "Vandalism",
    "Drug-related",
    "Other",
  ];

  return (
    <div>
      <Label htmlFor="type" className="mb-2 block">
        {label}
      </Label>

      <Select id="type" value={crimeType} onValueChange={setCrimeType}>
        <SelectTrigger className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {crimeTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default OptionList;
