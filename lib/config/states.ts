// lib/config/states.ts
import { CircleCheck, CircleX, Clock, HandCoins, LucideIcon } from "lucide-react";

export type StateId = "ACCETTATO" | "RIFIUTATO" | "ATTESA" | "PAGATO";

export const STATE_CONFIG: Record<StateId, { icon: LucideIcon; className: string; label: string }> = {
  ACCETTATO: { icon: CircleCheck, className: "text-green-500",  label: "Accettato" },
  RIFIUTATO: { icon: CircleX,     className: "text-red-500",    label: "Rifiutato" },
  ATTESA:    { icon: Clock,       className: "text-yellow-500", label: "In attesa" },
  PAGATO:    { icon: HandCoins,   className: "text-blue-500",   label: "Pagato"    },
};