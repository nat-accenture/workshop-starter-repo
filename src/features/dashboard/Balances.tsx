import { Card, CardHeader, Pill, Skeleton, Stack, Stat } from "../../dls";
import { formatSGD } from "../../../data/api";
import type { Account } from "../../../data/types";

// Balance summary (PRE-BUILT in the original). Renders the account strip that
// the behaviour contract asserts on: #accounts > .account-card x3.
export function Balances({ accounts }: { accounts: Account[] }) {
  return (
    <div className="account-strip" id="accounts">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
  const up = account.changePct7d >= 0;
  return (
    <div className="mrdn-card account-card">
      <div className="mrdn-card__header">
        <span className="mrdn-card__title">{account.name}</span>
        <Pill tone={up ? "positive" : "negative"}>
          {`${up ? "+" : ""}${account.changePct7d}%`}
        </Pill>
      </div>
      <Stat
        label={account.accountNumberMasked}
        value={formatSGD(account.balanceMinor)}
      />
    </div>
  );
}

// Shimmering placeholder while balances load.
export function BalancesSkeleton() {
  return (
    <div className="account-strip">
      {[0, 1, 2].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton variant="title" />
          </CardHeader>
          <Stack>
            <Skeleton variant="line" />
            <Skeleton variant="stat" />
          </Stack>
        </Card>
      ))}
    </div>
  );
}
