import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { firstFridayOfMonth } from "./lib/utils";
import { Textarea } from "./components/ui/textarea";
import { twc } from "react-twc";
import { Chart } from "./components/Chart";
import { DatePicker } from "./components/DatePicker";
import { useDateSet } from "./lib/useDateSet";
import { NumericInput } from "./components/NumericInput";
import { makeAggregationDays } from "./lib/makeAggregationDays";
import { makeDeltas } from "./lib/makeDeltas";
import { makeBalances } from "./lib/makeBalances";
import { useGloballySavedState } from "./lib/useGloballySavedState";
import { useToast } from "./components/ui/use-toast";
import { Toaster } from "./components/ui/toaster";

const Panel = twc.div`rounded-md border shadow p-4 bg-gray-50`;

const FormFieldSet = twc.div`flex flex-col items-start gap-1.5`;

function App() {
  const [checkpointDate, setCheckpointDate] = useState(
    firstFridayOfMonth(new Date())
  );
  const [checkpointAmount, setCheckpointAmount] = useState(12);
  const [vacationDays, toggleVacationDay, setVacationDays] = useDateSet();

  const [lookaheadDays, setLookaheadDays] = useState(365);
  const [daysPerAggregationPeriod, setDaysPerAggregationPeriod] = useState(14);
  const [aggregationAmount, setAggregationAmount] = useState(0.808);

  const { toast } = useToast();

  const aggregationDays = useMemo(
    () =>
      makeAggregationDays(
        lookaheadDays,
        daysPerAggregationPeriod,
        checkpointDate
      ),
    [checkpointDate, daysPerAggregationPeriod, lookaheadDays]
  );

  const deltas = useMemo(
    () =>
      makeDeltas(
        lookaheadDays,
        checkpointDate,
        vacationDays,
        aggregationDays,
        aggregationAmount
      ),
    [
      aggregationAmount,
      aggregationDays,
      checkpointDate,
      lookaheadDays,
      vacationDays,
    ]
  );

  const balances = useMemo(
    () => makeBalances(checkpointAmount, deltas),
    [deltas, checkpointAmount]
  );

  const [debugString, parseDebugString] = useGloballySavedState(
    {
      checkpointDate,
      checkpointAmount,
      vacationDays,
      lookaheadDays,
      daysPerAggregationPeriod,
      aggregationAmount,
    },
    (state) => {
      console.log("asdf");
      state.checkpointDate &&
        setCheckpointDate(new Date(state.checkpointDate as string));
      state.checkpointAmount &&
        setCheckpointAmount(state.checkpointAmount as number);
      state.vacationDays && setVacationDays(state.vacationDays as Date[]);
      state.lookaheadDays && setLookaheadDays(state.lookaheadDays as number);
      state.daysPerAggregationPeriod &&
        setDaysPerAggregationPeriod(state.daysPerAggregationPeriod as number);
      state.aggregationAmount &&
        setAggregationAmount(state.aggregationAmount as number);
    },
    toast
  );

  return (
    <div className="p-8 sm:p-12 flex flex-col gap-y-8 max-w-screen-xl">
      <div className="prose leading-snug">
        <h1>PTO Calculator</h1>
        <p>
          Workday is potentially the worst possible interface for visualizing
          your vacation days. Here's a better one.
        </p>
        <p>Here's how it works:</p>
        <ul>
          <li>
            Enter the date when you last accrued PTO and the amount of PTO you
            had on that day.
          </li>
          <li>Click on the calendar to mark days off.</li>
          <li>Hover over the chart to see your balance on any given day.</li>
        </ul>
      </div>
      <Panel className="flex flex-col gap-8 sm:flex-row sm:gap-12">
        <FormFieldSet>
          <Label htmlFor="startcount">Checkpoint PTO Balance</Label>
          <NumericInput
            number={checkpointAmount}
            onChange={setCheckpointAmount}
          />
        </FormFieldSet>
        <FormFieldSet>
          <Label>Checkpoint Date</Label>
          <DatePicker date={checkpointDate} setDate={setCheckpointDate} />
        </FormFieldSet>
      </Panel>
      <Panel className="max-h-[60vh] overflow-auto flex flex-col sm:flex-row gap-4 items-center">
        <Calendar
          mode="single"
          month={checkpointDate}
          numberOfMonths={lookaheadDays / 30}
          disableNavigation
          showOutsideDays={false}
          modifiers={{
            checkpoint: checkpointDate ? [checkpointDate] : [],
            vacation: Array.from(vacationDays.values()),
            aggregation: aggregationDays,
          }}
          modifiersClassNames={{
            checkpoint: "border-2 border-gray-900",
            vacation: "!bg-green-200 !hover:bg-green-800 text-green-800",
            aggregation:
              "bg-red-200 border-2 border-red-200 text-accent-foreground",
          }}
          onDayClick={(day: Date) => toggleVacationDay(day)}
        />
        <Button
          className="m-4"
          onClick={() => {
            setLookaheadDays(lookaheadDays + 30);
          }}
        >
          Add another month
        </Button>
      </Panel>
      <Panel className="h-[30vh] w-full">
        <Chart
          balances={balances}
          checkpointDate={checkpointDate}
          lookaheadDays={lookaheadDays}
        />
      </Panel>
      <Sheet>
        <div className="w-full flex justify-between">
          <p className="prose">
            Made by <a href="https://jameslittle.me">James Little</a>
          </p>
          <Button asChild>
            <SheetTrigger>Nitpicky Settings</SheetTrigger>
          </Button>
        </div>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Nitpicky Settings</SheetTitle>
            <>
              <div className="flex flex-col gap-y-4">
                <FormFieldSet>
                  <Label>Lookahead Days</Label>
                  <NumericInput
                    number={lookaheadDays}
                    onChange={setLookaheadDays}
                  />
                </FormFieldSet>
                <FormFieldSet>
                  <Label>Days per Aggregation Period</Label>
                  <NumericInput
                    number={daysPerAggregationPeriod}
                    onChange={setDaysPerAggregationPeriod}
                  />
                </FormFieldSet>
                <FormFieldSet>
                  <Label>Aggregation Amount</Label>
                  <NumericInput
                    number={aggregationAmount}
                    onChange={setAggregationAmount}
                  />
                </FormFieldSet>
                <FormFieldSet>
                  <Label>Raw Data</Label>
                  <Textarea
                    className="font-mono"
                    value={debugString}
                    onChange={(e) => {
                      parseDebugString(e.target.value);
                    }}
                  />
                </FormFieldSet>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(debugString);
                    toast({
                      title: "Copied to clipboard",
                    });
                  }}
                >
                  Copy to Clipboard
                </Button>
                <Button
                  variant="destructive"
                  className="mt-8 justify-self-end"
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Clear Saved Data
                </Button>
              </div>
            </>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <Toaster />
    </div>
  );
}

export default App;
