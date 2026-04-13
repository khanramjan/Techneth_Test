import {
  BarChart3,
  Camera,
  ChevronLeft,
  Circle,
  Grip,
  Mail,
  Phone,
  Share2,
  Target,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { RailItem } from "@/types/dashboard";

type LeftRailProps = {
  brand: string;
  items: RailItem[];
};

const iconMap: Record<string, LucideIcon> = {
  "chevron-left": ChevronLeft,
  camera: Camera,
  target: Target,
  circle: Circle,
  users: Users,
  share: Share2,
  "bar-chart": BarChart3,
  user: UserRound,
  phone: Phone,
  mail: Mail,
  grid: Grip,
};

export function LeftRail({ brand, items }: LeftRailProps) {
  return (
    <aside className="rounded-[30px] bg-[#f4f5ef] p-2 sm:p-3 xl:min-h-[730px]">
      <div className="flex h-full flex-row gap-2 xl:flex-col xl:justify-between">
        <div className="flex items-center justify-center rounded-2xl bg-[#f9f9f4] p-4 text-3xl font-semibold leading-none text-[#26271f]">
          {brand}
        </div>
        <div className="flex flex-1 flex-row gap-2 overflow-x-auto no-scrollbar xl:flex-col xl:overflow-visible">
          {items.map((item) => {
            const Icon = iconMap[item.icon] ?? Circle;

            return (
              <button
                key={item.id}
                type="button"
                className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
                  item.active
                    ? "border-[#1f211a] bg-[#1f211a] text-white"
                    : "border-[#e0e1d8] bg-[#f9f9f4] text-[#55584f] hover:bg-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.dot ? (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ece54b]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
