import { useEffect, useState } from "react";
import { getAccounts, getCategories, getTransactions } from "../../data/api";
import type { Account, Category, Transaction } from "../../data/types";

interface DashboardData {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: Error | null;
}

const EMPTY: DashboardData = {
  accounts: [],
  transactions: [],
  categories: [],
  loading: true,
  error: null,
};

// Loads all three endpoints in parallel once, mirroring the original boot().
// Returns loading/error alongside the data so widgets can render real states.
export function useDashboardData(): DashboardData {
  const [state, setState] = useState<DashboardData>(EMPTY);

  useEffect(() => {
    let alive = true;
    Promise.all([getAccounts(), getTransactions(), getCategories()])
      .then(([accounts, transactions, categories]) => {
        if (alive) setState({ accounts, transactions, categories, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (alive) {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err : new Error(String(err)),
          }));
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  return state;
}
