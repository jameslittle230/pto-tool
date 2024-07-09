import { useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [stringValue, setStringValue] = useState(number.toString());
  const debouncedStringValue = useDebounce(stringValue, 500);

  useEffect(() => {
    const numericValue = Number(debouncedStringValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  }, [debouncedStringValue, onChange]);

  useEffect(() => {
    const inputRefCurrent = inputRef.current;

    if (!inputRefCurrent) {
      return;
    }

    const listenerFunction = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setStringValue(val => String(Number(val) + 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setStringValue(val => String(Number(val) - 1));
      }
    };

    inputRefCurrent.addEventListener("keydown", listenerFunction);
    return () => {
      inputRefCurrent.removeEventListener("keydown", listenerFunction);
    };
  }, [inputRef]);

  return (
    <Input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      id="startCount"
      pattern="[0-9]+([\.,][0-9]+)?"
      placeholder="12"
      className={cn("w-36", isNaN(Number(stringValue)) && "text-red-500")}
      value={stringValue}
      onChange={e => setStringValue(e.target.value)}
    />
  );
};
