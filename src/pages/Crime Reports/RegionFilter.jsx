import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegionFilter({ street, setStreet }) {
  const regions = useSelector((state) => state.region.regionList);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (street) {
      const filtered = regions.filter((region) =>
        region.name.toLowerCase().includes(street.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(regions);
    }
  }, [street, regions]);

  const handleSelect = (region) => {
    setStreet(region.name);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Only hide if not clicking on suggestions
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Label id="region" className="block text-slate-700 mb-2 text-xl">
        Search by region
      </Label>
      <Input
        id="region"
        name="region"
        type="text"
        placeholder="Gulshan, Banani...."
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-slate-100 border rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
          {suggestions.map((region) => (
            <li
              key={region.name}
              className="p-2 cursor-pointer hover:bg-slate-200"
              onMouseDown={() => handleSelect(region)}
            >
              {region.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RegionFilter;
