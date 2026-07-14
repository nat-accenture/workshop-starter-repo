import { useMemo } from "react";
import {
  Amount,
  Card,
  CardHeader,
  CardTitle,
  List,
  Row,
  RowBody,
  RowEnd,
  RowIcon,
} from "../../dls";
import { formatSGD } from "../../../data/api";
import type { Category, Transaction } from "../../../data/types";
import { formatShortDate, initials } from "../../lib/format";

// HOOK 1 - Recent activity (FEATURE-BRIEFS #1).
// Lists the latest transactions with merchant, category, date and a signed
// amount. Money in reads positive/green; money out reads negative.
export function RecentActivity({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  const rows = useMemo(
    // Most recent first.
    () => [...transactions].sort((a, b) => b.postedAt.localeCompare(a.postedAt)),
    [transactions],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      {rows.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__title">Nothing here</p>
          <p className="empty-state__body">No recent activity to show.</p>
        </div>
      ) : (
        <List>
          {rows.map((txn) => (
            <TransactionRow
              key={txn.id}
              txn={txn}
              category={categoryById.get(txn.categoryId)}
            />
          ))}
        </List>
      )}
    </Card>
  );
}

function TransactionRow({
  txn,
  category,
}: {
  txn: Transaction;
  category?: Category;
}) {
  const isCredit = txn.amountMinor > 0;
  return (
    <Row>
      <RowIcon>{initials(txn.merchant)}</RowIcon>
      <RowBody
        primary={txn.merchant}
        secondary={`${category?.label ?? "Other"} · ${formatShortDate(txn.postedAt)}`}
      />
      <RowEnd>
        <Amount tone={isCredit ? "credit" : "default"}>
          {formatSGD(txn.amountMinor, { signed: true })}
        </Amount>
      </RowEnd>
    </Row>
  );
}
