import { Switch } from "@/components/ui/switch";
import { useThemeMode } from "@/providers/theme-provider";

export function ThemeSwitch() {
  const { mode, setMode } = useThemeMode();

  return (
    <Switch
      value={mode === "dark"}
      onValueChange={(value) => {
        setMode(value ? "dark" : "light");
      }}
    />
  );
}