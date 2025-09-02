import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

function RegionFilter({ street, setStreet, regions }) {
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
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-sm">
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
