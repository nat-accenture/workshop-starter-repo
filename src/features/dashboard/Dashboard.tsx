import { Card, CardHeader, CardTitle, Col, Grid, Skeleton, Stack } from "../../dls";
import { useDashboardData } from "../../hooks/useDashboardData";
import { Balances, BalancesSkeleton } from "./Balances";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { SavingsGoal } from "./SavingsGoal";
import { SpendByCategory } from "./SpendByCategory";

export function Dashboard() {
  const { accounts, transactions, categories, loading, error } = useDashboardData();

  return (
    <main className="dashboard">
      <div className="dashboard__head">
        <h1>Good morning, Alex</h1>
        <p className="dashboard__sub">Here is your money at a glance.</p>
      </div>

      {error ? (
        <Card>
          <div className="empty-state">
            <p className="empty-state__title">We could not load your dashboard</p>
            <p className="empty-state__body">Please try again in a moment.</p>
          </div>
        </Card>
      ) : (
        <Grid>
          <Col span={12} aria-label="Account balances">
            {loading ? <BalancesSkeleton /> : <Balances accounts={accounts} />}
          </Col>

          <Col span={8}>
            {loading ? (
              <LoadingCard title="Recent activity" />
            ) : (
              <RecentActivity transactions={transactions} categories={categories} />
            )}
          </Col>

          <Col span={4}>
            <QuickActions />
          </Col>

          <Col span={6}>
            {loading ? (
              <LoadingCard title="Spend by category" />
            ) : (
              <SpendByCategory transactions={transactions} categories={categories} />
            )}
          </Col>

          <Col span={6}>
            {loading ? (
              <LoadingCard title="Savings goal" />
            ) : (
              <SavingsGoal accounts={accounts} />
            )}
          </Col>
        </Grid>
      )}
    </main>
  );
}

function LoadingCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Stack>
        <Skeleton variant="line" />
        <Skeleton variant="line" />
        <Skeleton variant="line" />
      </Stack>
    </Card>
  );
}
