import { Sun, Moon } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@school-management/utils";

interface ThemeToggleProps {
  className?: string;
  theme?: string;
  onThemeChange?: (theme: string) => void;
}

export function ThemeToggle({ className, theme = "light", onThemeChange }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(className)}
      onClick={() => onThemeChange?.(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}