import {
  Card,
  CardHeader,
  CardTitle,
  Pill,
  Progress,
  Stack,
} from "../../dls";
import { formatSGD } from "../../../data/api";
import type { Account } from "../../../data/types";
import { useCountUp } from "../../hooks/useCountUp";

// HOOK 3 - Savings goal (FEATURE-BRIEFS #3).
// Shows progress toward the Holiday fund: saved of target, how much is left,
// and a progress bar.
export function SavingsGoal({ accounts }: { accounts: Account[] }) {
  const savings =
    accounts.find((a) => a.goal) ?? accounts.find((a) => a.type === "savings");

  if (!savings?.goal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings goal</CardTitle>
        </CardHeader>
        <div className="empty-state">
          <p className="empty-state__title">No goal set</p>
          <p className="empty-state__body">Set a savings goal to track it here.</p>
        </div>
      </Card>
    );
  }

  const saved = savings.balanceMinor;
  const target = savings.goal.targetMinor;
  const pct = target > 0 ? Math.round((saved / target) * 100) : 0;
  const remaining = Math.max(0, target - saved);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings goal</CardTitle>
        <Pill tone="accent">{savings.goal.label}</Pill>
      </CardHeader>
      <Stack>
        <div className="mrdn-stat">
          <span className="mrdn-stat__label">
            {formatSGD(saved)} of {formatSGD(target)}
          </span>
          <span className="mrdn-stat__value">
            <AnimatedPercent value={pct} />
          </span>
        </div>
        <Progress value={pct} label={`${savings.goal.label} progress`} />
        <span className="app-caption">{formatSGD(remaining)} to go</span>
      </Stack>
    </Card>
  );
}

// Counts the percentage up on load; lands exactly on the true value.
function AnimatedPercent({ value }: { value: number }) {
  const current = useCountUp(value);
  return <>{Math.round(current)}%</>;
}
