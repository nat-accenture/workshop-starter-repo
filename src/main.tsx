import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// The design contract loads first (tokens, then components), then the app shell
// chrome. Every visual value in the app resolves back to these DLS files.
import "../dls/tokens.css";
import "../dls/components.css";
import "./styles/app.css";

import App from "./App";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Meridian: #root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
