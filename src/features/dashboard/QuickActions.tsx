import { Button, Card, CardHeader, CardTitle, Stack } from "../../dls";

// Quick actions (PRE-BUILT). Static, no data needed.
export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <Stack>
        <Button variant="primary" block>
          Transfer
        </Button>
        <Button variant="secondary" block>
          Pay a bill
        </Button>
        <Button variant="secondary" block>
          Add money
        </Button>
      </Stack>
    </Card>
  );
}
