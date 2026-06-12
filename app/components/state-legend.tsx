// app/components/state-legend.tsx
import { STATE_CONFIG, StateId } from "@/lib/config/states";

export default function StateLegend() {
  return (
    <div className="flex flex-row gap-4 items-center text-sm">
      {(Object.keys(STATE_CONFIG) as StateId[]).map((key) => {
        const { icon: Icon, className, label } = STATE_CONFIG[key];
        return (
          <div key={key} className="flex items-center gap-1">
            <Icon size={16} className={className} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}