import {
  Dispatch,
  memo,
  SetStateAction,
  useDeferredValue,
  useEffect,
} from "react";
import { NumericInput } from "./components/NumericInput";
import { useSavedState } from "./lib/useGloballySavedState";
import { DatePicker } from "./components/DatePicker";
import { Calendar } from "./components/ui/calendar";
import { Delta, makeDeltas } from "./lib/makeDeltas";
import { makeAggregationDays } from "./lib/makeAggregationDays";
import { makeBalances } from "./lib/makeBalances";
import { Chart } from "./components/Chart";
import { Card, CardContent } from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { twc } from "react-twc";

declare global {
  interface Window {
    setTheme: () => void;
  }
}

const FormFieldSet = twc.div`flex flex-col items-start gap-1.5`;

const App = () => {
  const [checkpointDate, setCheckpointDate] = useSavedState(
    "checkpointDate",
    new Date(),
    str => new Date(JSON.parse(str))
  );

  const [checkpointAmount, setCheckpointAmount] = useSavedState(
    "checkpointAmount",
    12
  );

  const [ptoDays, setPtoDays] = useSavedState<Date[]>("ptoDays", [], str =>
    (JSON.parse(str) as string[]).map(value => new Date(value))
  );

  const [lookaheadDays, setLookaheadDays] = useSavedState("lookaheadDays", 500);
  const [daysPerAggregationPeriod, setDaysPerAggregationPeriod] = useSavedState(
    "daysPerAggregationPeriod",
    14
  );
  const [aggregationAmount, setAggregationAmount] = useSavedState(
    "aggregationAmount",
    0.808
  );

  const deferredPtoDays = useDeferredValue(ptoDays);

  const [theme, setTheme] = useSavedState("theme", "auto", s => s);

  useEffect(() => {
    window.setTheme();
  }, [theme]);

  return (
    <div className="p-8 sm:p-12 flex flex-col gap-y-8 max-w-screen-xl">
      <div className="prose leading-snug dark:prose-invert">
        <div className="flex w-full justify-between items-center mb-8">
          <h1 className="mb-0">PTO Calculator</h1>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="auto">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p>
          This tool helps you keep track of your balance of paid time off over
          the course of a long period of time. It's designed to work with the
          way my company does PTO, but it might work for yours, too.
        </p>
        <p>Here's how this tool works:</p>
        <ul>
          <li>
            Enter the date when you last accrued PTO and the amount of PTO you
            had on that day.
          </li>
          <li>Click on the calendar to mark days off.</li>
          <li>Hover over the chart to see your balance on any given day.</li>
        </ul>
        <p>
          Everything you enter will be saved to your browser's local storage.
        </p>
      </div>
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-8">
            <div className="flex gap-8 flex-col">
              <FormFieldSet>
                <Label>Checkpoint PTO Balance</Label>
                <NumericInput
                  number={checkpointAmount}
                  onChange={setCheckpointAmount}
                />
              </FormFieldSet>
              <FormFieldSet>
                <Label>Checkpoint PTO Date</Label>
                <DatePicker date={checkpointDate} setDate={setCheckpointDate} />
              </FormFieldSet>
            </div>
            <Calendar
              mode="multiple"
              numberOfMonths={3}
              selected={ptoDays}
              onSelect={days => setPtoDays(days || [])}
              className="rounded-md border"
              modifiers={{ checkpoint: checkpointDate ? [checkpointDate] : [] }}
              modifiersClassNames={{
                checkpoint: "border-2 border-gray-900",
                selected: "!bg-green-200 !hover:bg-green-800 text-green-800 ",
              }}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-4">
          <Deltas
            checkpointDate={checkpointDate}
            checkpointAmount={checkpointAmount}
            ptoDays={deferredPtoDays}
            lookaheadDays={lookaheadDays}
            daysPerAggregationPeriod={daysPerAggregationPeriod}
            aggregationAmount={aggregationAmount}
          />
        </CardContent>
      </Card>
      <Settings
        lookaheadDays={lookaheadDays}
        daysPerAggregationPeriod={daysPerAggregationPeriod}
        aggregationAmount={aggregationAmount}
        setLookaheadDays={setLookaheadDays}
        setDaysPerAggregationPeriod={setDaysPerAggregationPeriod}
        setAggregationAmount={setAggregationAmount}>
        <p className="prose dark:prose-invert">
          Made by <a href="https://jameslittle.me">James Little</a>
        </p>
      </Settings>
    </div>
  );
};

const Deltas = memo(
  ({
    checkpointDate,
    checkpointAmount,
    ptoDays,

    lookaheadDays,
    daysPerAggregationPeriod,
    aggregationAmount,
  }: {
    checkpointDate: Date;
    checkpointAmount: number;
    ptoDays: Date[];

    lookaheadDays: number;
    daysPerAggregationPeriod: number;
    aggregationAmount: number;
  }) => {
    const aggregationDays = makeAggregationDays(
      lookaheadDays,
      daysPerAggregationPeriod,
      checkpointDate
    );
    const deltas: Delta[] = makeDeltas(
      lookaheadDays,
      checkpointDate,
      ptoDays,
      aggregationDays,
      aggregationAmount
    );
    const balances = makeBalances(checkpointAmount, deltas);
    return <Chart balances={balances} />;
  }
);

const Settings = memo(
  ({
    lookaheadDays,
    setLookaheadDays,
    daysPerAggregationPeriod,
    setDaysPerAggregationPeriod,
    aggregationAmount,
    setAggregationAmount,
    children,
  }: {
    lookaheadDays: number;
    setLookaheadDays: Dispatch<SetStateAction<number>>;
    daysPerAggregationPeriod: number;
    setDaysPerAggregationPeriod: Dispatch<SetStateAction<number>>;
    aggregationAmount: number;
    setAggregationAmount: Dispatch<SetStateAction<number>>;
    children: any;
  }) => {
    return (
      <Sheet>
        <div className="w-full flex justify-between">
          {children}
          <Button asChild>
            <SheetTrigger>Nitpicky Settings</SheetTrigger>
          </Button>
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

                  <Button
                    variant="destructive"
                    className="mt-8 justify-self-end"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}>
                    Clear Saved Data
                  </Button>
                </div>
              </>
            </SheetHeader>
          </SheetContent>
        </div>
      </Sheet>
    );
  }
);

export default App;
