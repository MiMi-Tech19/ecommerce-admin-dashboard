
import {
  ArrowDownRight,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
}

export function MetricCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
}: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-700">
          <Icon size={20} />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          {positive ? (
            <ArrowUpRight size={16} className="text-emerald-600" />
          ) : (
            <ArrowDownRight size={16} className="text-red-600" />
          )}

          <span
            className={
              positive
                ? 'font-medium text-emerald-600'
                : 'font-medium text-red-600'
            }
          >
            {change}
          </span>

          <span className="text-slate-400">vs last period</span>
        </div>
      )}
    </article>
  );
}
