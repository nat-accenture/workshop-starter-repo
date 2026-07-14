import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AppBar, DashboardLink, KitchenSinkLink } from "./components/AppBar";
import { Dashboard } from "./features/dashboard/Dashboard";
import { KitchenSink } from "./features/kitchen-sink/KitchenSink";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <AppBar nav={<KitchenSinkLink />} user />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/kitchen-sink"
            element={
              <>
                <AppBar nav={<DashboardLink />} />
                <KitchenSink />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
