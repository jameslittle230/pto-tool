import { useEffect, useState } from "react";

export const useSavedState = <T>(
  key: string,
  initialValue: T,
  parser?: { (arg0: string): T }
) => {
  const stateHookValue = useState<T>(() => {
    const storedValue = window.localStorage.getItem(key);
    if (parser) {
      return storedValue ? parser(storedValue) : initialValue;
    }
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  const value = stateHookValue[0];

  useEffect(() => {
    window.localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }, [value]);

  return stateHookValue;
};
