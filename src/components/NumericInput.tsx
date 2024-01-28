import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Input } from "./ui/input";
import { useDebounce } from "@uidotdev/usehooks";

export const NumericInput = ({
  number,
  onChange,
}: {
  number: number;
  onChange: (number: number) => void;
}) => {
  const [stringValue, setStringValue] = useState(number.toString());
  const debouncedStringValue = useDebounce(stringValue, 500);

  useEffect(() => {
    const numericValue = Number(debouncedStringValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  }, [debouncedStringValue, onChange]);

  return (
    <Input
      type="text"
      inputMode="numeric"
      id="startCount"
      pattern="[0-9]+([\.,][0-9]+)?"
      placeholder="12"
      className={cn("w-36", isNaN(Number(stringValue)) && "text-red-500")}
      value={stringValue}
      onChange={(e) => setStringValue(e.target.value)}
    />
  );
};
