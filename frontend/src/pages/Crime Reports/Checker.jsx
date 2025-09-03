import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function Checker({
  state,
  setState,
  setArr,
  active,
  setActive,
}) {
  useEffect(() => {
    const arr = [];
    for (const key of Object.keys(state)) {
      arr.push({ key, value: state[key] });
    }
    setArr(arr);
    for (const key of Object.keys(state)) {
      if (state[key]) {
        if (!active.includes(key)) {
          setActive((prev) => [...prev, key]);
        }
      } else {
        setActive((prev) => prev.filter((type) => type != key));
      }
    }
  }, [state, setActive]);

  console.log(active);

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-62 flex justify-between">
            <span className="text-slate-600  font-normal">
              {active.length
                ? active.map((type) => (
                    <span className="text-wrap" key={type}>
                      {type}{" "}
                    </span>
                  ))
                : "Select a crime type"}
            </span>
            <ChevronDown className="text-slate-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuCheckboxItem
            checked={state.theft}
            onCheckedChange={() => setState({ ...state, theft: !state.theft })}
          >
            Theft
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={state.assault}
            onCheckedChange={() =>
              setState({ ...state, assault: !state.assault })
            }
          >
            Assault
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={state.robbery}
            onCheckedChange={() =>
              setState({ ...state, robbery: !state.robbery })
            }
          >
            Robbery
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={state.murder}
            onCheckedChange={() =>
              setState({ ...state, murder: !state.murder })
            }
          >
            Murder
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={state.vandalism}
            onCheckedChange={() =>
              setState({ ...state, vandalism: !state.vandalism })
            }
          >
            Vandalism
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={state.drugs}
            onCheckedChange={() => setState({ ...state, drugs: !state.drugs })}
          >
            Drugs
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={state.other}
            onCheckedChange={() => setState({ ...state, other: !state.other })}
          >
            Other
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
