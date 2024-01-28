import { useCallback, useEffect, useMemo, useState } from "react";
import { format, isValid, parse } from "date-fns";
import { isDate } from "lodash";
import { useDebounce } from "@uidotdev/usehooks";
import { useToast } from "../components/ui/use-toast";

type SerializableType =
  | string
  | number
  | boolean
  | null
  | Date
  | SerializableType[]
  | SerializableStateValue;

interface SerializableStateValue {
  [key: string]: SerializableType;
}

type CompressedType =
  | string
  | number
  | boolean
  | null
  | CompressedType[]
  | CompressedStateValue;

interface CompressedStateValue {
  [key: string]: CompressedType;
}

const compressDate = (date: Date) => format(date, "yyyyMMdd");

const decompressDate = (dateString: string) => {
  const parsedValue = parse(dateString, "yyyyMMdd", new Date());
  return isValid(parsedValue) ? parsedValue : dateString;
};

const compressValue = (value: SerializableType): CompressedType => {
  if (Array.isArray(value)) {
    return value.map(compressValue);
  } else if (isDate(value)) {
    return compressDate(value);
  } else if (value && typeof value === "object") {
    return compressObject(value);
  } else {
    return value;
  }
};

const compressObject = (obj: SerializableStateValue): CompressedStateValue =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value.map(compressValue)];
      } else if (isDate(value)) {
        return [key, compressDate(value)];
      } else {
        return [key, value];
      }
    })
  );

const decompressValue = (value: CompressedType): SerializableType => {
  if (Array.isArray(value)) {
    return value.map(decompressValue);
  } else if (typeof value === "string") {
    return decompressDate(value);
  } else if (value && typeof value === "object") {
    return decompressObject(value);
  } else {
    return value;
  }
};

const decompressObject = (obj: CompressedStateValue): SerializableStateValue =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value.map(decompressValue)];
      } else if (typeof value === "string") {
        return [key, decompressDate(value)];
      } else {
        return [key, value];
      }
    })
  );

export const useGloballySavedState = (
  stateValues: Record<string, SerializableType>,
  setStateValues: (newValues: Record<string, SerializableType>) => void,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  const [shouldSetNewLocalStorageValue, setShouldSetNewLocalStorageValue] =
    useState(false);

  const debouncedStateValues = useDebounce(stateValues, 1000);

  const debugString = useMemo(
    () => btoa(JSON.stringify(compressObject(debouncedStateValues))),
    [debouncedStateValues]
  );

  const parseNewDebugString = useCallback((input: string) => {
    try {
      const parsed = decompressObject(JSON.parse(atob(input)));
      setStateValues(parsed);
    } catch (e) {
      toast({
        title: "Error parsing debug string",
        description: "Please check the format and try again",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!shouldSetNewLocalStorageValue) return;
    localStorage.setItem("state", debugString);
    toast({
      title: "Saved current state",
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debugString]);

  useEffect(() => {
    const storedState = localStorage.getItem("state");
    if (storedState) {
      parseNewDebugString(storedState);
    }
    setShouldSetNewLocalStorageValue(true);
  }, [parseNewDebugString]);

  return [debugString, parseNewDebugString] as const;
};
