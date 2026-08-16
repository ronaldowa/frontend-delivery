// Small status pill used by health/status surfaces.

import { CheckCircle2, ServerCrash } from "lucide-react";

type StatusBadgeProps = {
  online: boolean;
  label: string;
};

export function StatusBadge({ online, label }: StatusBadgeProps) {
  // Icon choice follows the same boolean state as the color treatment.
  const Icon = online ? CheckCircle2 : ServerCrash;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        online
          ? "bg-mint text-ink"
          : "bg-coral/15 text-coral"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </span>
  );
}
