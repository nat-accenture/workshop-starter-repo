import { Button } from "../dls";
import { useTheme } from "../theme/ThemeProvider";
import { MoonIcon, SunIcon } from "./icons";

// Shows the icon for the theme you would switch TO, matching the original app.
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
