import { cn } from "@/lib/utils";

const passwordChecks = [
  { label: "10+ characters", test: (value: string) => value.length >= 10 },
  { label: "Uppercase", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Lowercase", test: (value: string) => /[a-z]/.test(value) },
  { label: "Number", test: (value: string) => /[0-9]/.test(value) },
  { label: "Symbol", test: (value: string) => /[^A-Za-z0-9]/.test(value) }
];

export function getPasswordStrength(password: string) {
  return passwordChecks.filter((check) => check.test(password)).length;
}

export function PasswordStrength({ password }: Readonly<{ password: string }>) {
  const strength = getPasswordStrength(password);
  const label = strength <= 2 ? "Weak" : strength <= 4 ? "Good" : "Strong";

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-1">
        {passwordChecks.map((check, index) => (
          <div
            key={check.label}
            className={cn(
              "h-1.5 rounded-full bg-muted",
              index < strength && strength <= 2 && "bg-destructive",
              index < strength && strength > 2 && strength < 5 && "bg-accent",
              index < strength && strength === 5 && "bg-primary"
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Password strength: {label}</span>
        <span>{strength}/5 rules met</span>
      </div>
    </div>
  );
}
