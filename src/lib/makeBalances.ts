import { Delta } from "./makeDeltas";

export type DateBalance = {
  date: Date;
  amount: number;
};

export const makeBalances = (
  checkpointAmount: number,
  deltas: Delta[]
): DateBalance[] => {
  const output = [];
  let curr = checkpointAmount;
  for (const { date, delta } of deltas) {
    curr += delta;
    curr = Math.min(curr, 30);
    output.push({ date, amount: curr });
  }
  return output;
};
