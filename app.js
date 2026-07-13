// Meridian dashboard - app layer.
// This composes the design contract (dls/) and the data contract (data/)
// into the screen. Two widgets are built for you (balance summary, quick
// actions). Three are HOOKS you complete in the workshop with SpectrumOS.

import {
  getAccounts,
  getTransactions,
  getCategories,
  formatSGD,
} from "./data/api.js";

// ============================================================
// Balance summary (PRE-BUILT) - reads accounts from the mock API.
// ============================================================
function renderAccounts(accounts) {
  const el = document.getElementById("accounts");
  if (!el) return;
  el.innerHTML = accounts.map(accountCard).join("");
}

function accountCard(account) {
  const up = account.changePct7d >= 0;
  const pillClass = up ? "mrdn-pill--positive" : "mrdn-pill--negative";
  const pillText = `${up ? "+" : ""}${account.changePct7d}%`;
  return `
    <div class="mrdn-card account-card">
      <div class="mrdn-card__header">
        <span class="mrdn-card__title">${account.name}</span>
        <span class="mrdn-pill ${pillClass}">${pillText}</span>
      </div>
      <div class="mrdn-stat">
        <span class="mrdn-stat__label">${account.accountNumberMasked}</span>
        <span class="mrdn-stat__value">${formatSGD(account.balanceMinor)}</span>
      </div>
    </div>`;
}

// ============================================================
// HOOK 1 - Recent transactions.  Brief: FEATURE-BRIEFS #1
// Fill #transactions. Data: getTransactions() (+ getCategories() for labels).
// Components: mrdn-list, mrdn-row, mrdn-row__icon, mrdn-row__body, mrdn-amount.
// Money: use formatSGD(amountMinor). Credits get class "mrdn-amount is-credit".
// Done when: the card lists recent transactions with merchant, category and a signed amount.
// ============================================================
function renderTransactions(transactions, categories) {
  // TODO: build me with /spec-quick. Remove the empty state in #transactions.
}

// ============================================================
// HOOK 2 - Spend by category (this month).  Brief: FEATURE-BRIEFS #2
// Fill #spend. Data: getTransactions() + getCategories() where isSpending === true.
// Components: mrdn-row, mrdn-progress, mrdn-amount.
// Done when: each spending category shows its total and a proportional bar.
// ============================================================
function renderSpendByCategory(transactions, categories) {
  // TODO: build me with /spec-quick.
}

// ============================================================
// HOOK 3 - Savings goal.  Brief: FEATURE-BRIEFS #3
// Fill #savings. Data: the savings account from getAccounts() (has account.goal.targetMinor).
// Components: mrdn-stat, mrdn-progress, mrdn-pill--accent.
// Done when: it shows saved of target and a progress bar toward the goal.
// ============================================================
function renderSavingsGoal(accounts) {
  // TODO: build me with /spec-quick.
}

// ============================================================
// Boot: load everything from the API, then render.
// ============================================================
async function boot() {
  try {
    const [accounts, transactions, categories] = await Promise.all([
      getAccounts(),
      getTransactions(),
      getCategories(),
    ]);

    renderAccounts(accounts); // built

    // The three workshop hooks (currently no-ops until you build them):
    renderTransactions(transactions, categories);
    renderSpendByCategory(transactions, categories);
    renderSavingsGoal(accounts);
  } catch (err) {
    console.error("Meridian dashboard failed to load", err);
  }
}

boot();
