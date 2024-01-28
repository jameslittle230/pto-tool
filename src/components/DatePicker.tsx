import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

export const DatePicker = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className={cn(
          "w-[280px] justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
      >
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(day) => {
          day && setDate(day);
        }}
        initialFocus
      />
    </PopoverContent>
  </Popover>
);
