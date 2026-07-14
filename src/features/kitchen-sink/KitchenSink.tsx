import { useEffect, useState } from "react";
import {
  Amount,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Chip,
  Cluster,
  Col,
  Grid,
  List,
  Pill,
  Progress,
  Row,
  RowBody,
  RowEnd,
  RowIcon,
  SectionTitle,
  Stack,
  Stat,
} from "../../dls";
import { useTheme } from "../../theme/ThemeProvider";

// The Kitchen Sink: every DLS token and component, rendered live, in light and
// dark. This is a reference frame around the DLS (like dls/preview.html). Colour
// swatches read the computed token values at runtime, so the page always
// reflects tokens.css and re-reads whenever the theme changes.

const COLOR_TOKENS = [
  "--color-brand",
  "--color-primary",
  "--color-primary-strong",
  "--color-primary-tint",
  "--color-positive",
  "--color-positive-tint",
  "--color-negative",
  "--color-negative-tint",
  "--color-warning",
  "--color-warning-tint",
  "--color-accent",
  "--color-accent-tint",
  "--color-ink",
  "--color-ink-soft",
  "--color-muted",
  "--color-surface",
  "--color-surface-sunken",
  "--color-canvas",
  "--color-line",
] as const;

export function KitchenSink() {
  return (
    <main className="ks-wrap">
      <div className="ks-head">
        <h1>Kitchen sink</h1>
        <p>
          Every token and component in the Meridian DLS, rendered live. Values are
          read from the design system at runtime, so this page always reflects{" "}
          <code>dls/tokens.css</code> and <code>dls/components.css</code>. Toggle
          the theme and the swatches update.
        </p>
      </div>

      <section className="ks-section">
        <SectionTitle>Colour tokens</SectionTitle>
        <p className="ks-note">
          Live hex is read from the active theme. Switch to dark and watch every
          value change.
        </p>
        <Swatches />
      </section>

      <section className="ks-section">
        <SectionTitle>Type scale</SectionTitle>
        <TypeRow label="display">
          <span style={{ fontSize: "var(--text-display)", fontWeight: "var(--weight-bold)", letterSpacing: "-0.01em" }}>Meridian</span>
        </TypeRow>
        <TypeRow label="3xl">
          <span style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-bold)" }}>Good morning, Alex</span>
        </TypeRow>
        <TypeRow label="2xl">
          <span style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)" }}>$8,412.90</span>
        </TypeRow>
        <TypeRow label="xl">
          <span style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-semibold)" }}>Recent activity</span>
        </TypeRow>
        <TypeRow label="lg">
          <span style={{ fontSize: "var(--text-lg)" }}>Holiday fund</span>
        </TypeRow>
        <TypeRow label="md">
          <span style={{ fontSize: "var(--text-md)" }}>Quick actions</span>
        </TypeRow>
        <TypeRow label="base">
          <span style={{ fontSize: "var(--text-base)" }}>Coffee House, Orchard Road</span>
        </TypeRow>
        <TypeRow label="sm">
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-muted)" }}>Yesterday at 8:14 AM</span>
        </TypeRow>
        <TypeRow label="xs">
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Savings</span>
        </TypeRow>
      </section>

      <section className="ks-section">
        <SectionTitle>Spacing scale (4px base)</SectionTitle>
        {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
          <div className="ks-scale-row" key={n}>
            <span className="ks-scale-label">space-{n}</span>
            <span className="ks-space-bar" style={{ width: `var(--space-${n})` }} />
          </div>
        ))}
      </section>

      <section className="ks-section">
        <SectionTitle>Radius</SectionTitle>
        <Cluster>
          {(["sm", "md", "lg", "pill"] as const).map((r) => (
            <div key={r}>
              <div className="ks-radius-box" style={{ borderRadius: `var(--radius-${r})` }} />
              <span className="ks-swatch__name">{r}</span>
            </div>
          ))}
        </Cluster>
      </section>

      <section className="ks-section">
        <SectionTitle>Elevation</SectionTitle>
        <div className="ks-elevation">
          {["1", "2", "3"].map((n) => (
            <div className="ks-elevation__card" key={n} style={{ boxShadow: `var(--shadow-${n})` }}>
              shadow-{n}
            </div>
          ))}
        </div>
      </section>

      <section className="ks-section">
        <SectionTitle>Buttons</SectionTitle>
        <p className="ks-note">
          Tab to a button to see the <code>:focus-visible</code> ring. Hit targets
          are at least 44px.
        </p>
        <Cluster>
          <Button variant="primary">Transfer</Button>
          <Button variant="secondary">Pay a bill</Button>
          <Button variant="ghost">See all</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </Cluster>
        <div style={{ maxWidth: "20rem", marginTop: "var(--space-5)" }}>
          <Stack>
            <Button variant="primary" block>
              Block button
            </Button>
            <Button variant="secondary" block>
              Block secondary
            </Button>
          </Stack>
        </div>
      </section>

      <section className="ks-section">
        <SectionTitle>Pills</SectionTitle>
        <Cluster>
          <Pill>Pending</Pill>
          <Pill tone="positive">On track</Pill>
          <Pill tone="negative">Over budget</Pill>
          <Pill tone="accent">Savings</Pill>
        </Cluster>
        <div style={{ marginTop: "var(--space-6)" }}>
          <SectionTitle>Chips</SectionTitle>
        </div>
        <Cluster>
          <Chip active>All</Chip>
          <Chip>Dining</Chip>
          <Chip>Transport</Chip>
          <Chip>Bills</Chip>
        </Cluster>
      </section>

      <section className="ks-section">
        <SectionTitle>Amounts</SectionTitle>
        <p className="ks-note">
          SGD, en-SG, tabular so columns align. Credits read positive;{" "}
          <code>is-over</code> marks a breached limit.
        </p>
        <div style={{ maxWidth: "24rem" }}>
          <Card>
            <List>
              <Row>
                <RowBody primary="Debit (money out)" />
                <RowEnd>
                  <Amount>-$6.20</Amount>
                </RowEnd>
              </Row>
              <Row>
                <RowBody primary="Credit (money in)" />
                <RowEnd>
                  <Amount tone="credit">+$4,800.00</Amount>
                </RowEnd>
              </Row>
              <Row>
                <RowBody primary="Over a limit" />
                <RowEnd>
                  <Amount tone="over">-$1,240.50</Amount>
                </RowEnd>
              </Row>
            </List>
          </Card>
        </div>
      </section>

      <section className="ks-section">
        <SectionTitle>Card, stat, list, progress, avatar</SectionTitle>
        <Grid>
          <Col span={6}>
            <Card>
              <CardHeader>
                <CardTitle>Everyday account</CardTitle>
                <Pill tone="positive">+2.4%</Pill>
              </CardHeader>
              <Stat
                label="Available balance"
                value="$8,412.90"
                delta="+$320 this week"
                deltaTone="positive"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <CardHeader>
                <CardTitle>Rainy day fund</CardTitle>
                <Pill tone="negative">-1.1%</Pill>
              </CardHeader>
              <Stat
                label="Available balance"
                value="$2,150.00"
                delta="-$24 this week"
                deltaTone="negative"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
                <Avatar aria-hidden="true">AT</Avatar>
              </CardHeader>
              <List>
                <Row>
                  <RowIcon>C</RowIcon>
                  <RowBody primary="Coffee House" secondary="Dining · Yesterday" />
                  <RowEnd>
                    <Amount>-$6.20</Amount>
                  </RowEnd>
                </Row>
                <Row>
                  <RowIcon>S</RowIcon>
                  <RowBody primary="Salary" secondary="Income · 1 Jul" />
                  <RowEnd>
                    <Amount tone="credit">+$4,800.00</Amount>
                  </RowEnd>
                </Row>
              </List>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <CardHeader>
                <CardTitle>Holiday fund</CardTitle>
                <Pill tone="accent">Savings</Pill>
              </CardHeader>
              <Stack>
                <Stat label="$3,600 of $5,000" />
                <Progress value={72} label="Holiday fund" />
                <Progress value={40} label="Sample" />
                <Progress value={95} label="Sample" />
              </Stack>
            </Card>
          </Col>
        </Grid>
      </section>

      <section className="ks-section">
        <SectionTitle>Layout grid (12-col → 6 on tablet → 1 on mobile)</SectionTitle>
        <p className="ks-note">
          Resize the window: at 900px the grid drops to 6 columns, at 640px
          everything stacks. This is the responsive behaviour contract.
        </p>
        <Grid>
          {([12, 8, 4, 6, 6, 4, 4, 4] as const).map((span, i) => (
            <Col span={span} key={i}>
              <div className="ks-cell">col-{span}</div>
            </Col>
          ))}
        </Grid>
      </section>
    </main>
  );
}

function TypeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ks-type-row">
      <span className="ks-type-label">{label}</span>
      {children}
    </div>
  );
}

function Swatches() {
  const { theme } = useTheme();
  const [values, setValues] = useState<Record<string, string>>({});

  // Re-read the computed token values whenever the theme flips.
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const token of COLOR_TOKENS) {
      next[token] = styles.getPropertyValue(token).trim();
    }
    setValues(next);
  }, [theme]);

  return (
    <div className="ks-swatches">
      {COLOR_TOKENS.map((token) => (
        <div className="ks-swatch" key={token}>
          <div className="ks-swatch__chip" style={{ background: `var(${token})` }} />
          <span className="ks-swatch__name">{token.replace("--color-", "")}</span>
          <span className="ks-swatch__val">{values[token]}</span>
        </div>
      ))}
    </div>
  );
}
