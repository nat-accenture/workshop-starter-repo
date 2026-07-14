import { useMemo } from "react";
import {
  Amount,
  Card,
  CardHeader,
  CardTitle,
  Progress,
  Row,
  RowBody,
  RowEnd,
  Stack,
} from "../../dls";
import { formatSGD } from "../../../data/api";
import type { Category, Transaction } from "../../../data/types";
import { yearMonth } from "../../lib/format";

interface CategoryTotal {
  category: Category;
  totalMinor: number;
}

// HOOK 2 - Spend by category, this month (FEATURE-BRIEFS #2).
// Groups spending (isSpending categories only) for the latest month present in
// the data, shows each total with a proportional bar, biggest first. Income and
// transfers are excluded by the isSpending flag.
export function SpendByCategory({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const totals = useMemo(
    () => spendByCategory(transactions, categories),
    [transactions, categories],
  );

  if (totals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spend by category</CardTitle>
        </CardHeader>
        <div className="empty-state">
          <p className="empty-state__title">No spending yet</p>
          <p className="empty-state__body">This month is clear so far.</p>
        </div>
      </Card>
    );
  }

  const max = totals[0].totalMinor;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend by category</CardTitle>
      </CardHeader>
      <Stack>
        {totals.map(({ category, totalMinor }) => (
          <div key={category.id}>
            <Row>
              <RowBody primary={category.label} />
              <RowEnd>
                <Amount>{formatSGD(totalMinor)}</Amount>
              </RowEnd>
            </Row>
            <Progress
              value={(totalMinor / max) * 100}
              label={`${category.label} spend`}
            />
          </div>
        ))}
      </Stack>
    </Card>
  );
}

function spendByCategory(
  transactions: Transaction[],
  categories: Category[],
): CategoryTotal[] {
  const spending = new Map(
    categories.filter((c) => c.isSpending).map((c) => [c.id, c]),
  );

  // "This month" = the latest month present in the data, so the demo stays
  // stable regardless of the real calendar date.
  const latestMonth = transactions.reduce(
    (max, t) => (t.postedAt > max ? t.postedAt : max),
    "",
  ).slice(0, 7);

  const byCategory = new Map<string, number>();
  for (const t of transactions) {
    if (!spending.has(t.categoryId)) continue;
    if (yearMonth(t.postedAt) !== latestMonth) continue;
    byCategory.set(
      t.categoryId,
      (byCategory.get(t.categoryId) ?? 0) + Math.abs(t.amountMinor),
    );
  }

  return [...byCategory.entries()]
    .map(([id, totalMinor]) => ({ category: spending.get(id)!, totalMinor }))
    .sort((a, b) => b.totalMinor - a.totalMinor);
}
