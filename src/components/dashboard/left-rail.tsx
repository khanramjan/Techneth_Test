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
  activeItemId: number;
  onSelect: (itemId: number) => void;
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

export function LeftRail({ brand, items, activeItemId, onSelect }: LeftRailProps) {
  const primaryItems = items.filter((item) => item.id <= 8);
  const quickItems = items.filter((item) => item.id > 8);

  const renderRailButton = (item: RailItem, compact = false) => {
    const Icon = iconMap[item.icon] ?? Circle;
    const isActive = item.id === activeItemId;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelect(item.id)}
        className={`relative inline-flex shrink-0 items-center justify-center rounded-xl border transition ${
          compact ? "h-9 w-9" : "h-11 w-11"
        } ${
          isActive
            ? "border-[#25271f] bg-[#25271f] text-white shadow-[0_8px_14px_rgba(33,35,27,0.24)]"
            : "border-[#e0e1d8] bg-[#f9f9f4] text-[#585b52] hover:bg-white"
        }`}
      >
        <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {item.dot ? (
          <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#ece54b]" />
        ) : null}
      </button>
    );
  };

  return (
    <aside className="rounded-[30px] bg-[#f4f5ef] p-2.5 sm:p-3 xl:min-h-[730px]">
      <div className="flex h-full flex-row gap-2 overflow-x-auto no-scrollbar xl:flex-col xl:justify-between xl:overflow-visible">
        <div className="flex flex-row items-center gap-2 xl:flex-col xl:items-stretch">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f5ef]">
            {brand.trim().toLowerCase() === "o" ? (
              <div className="relative h-7 w-7">
                <span className="absolute left-[6px] top-[8px] h-4 w-4 rounded-full border-[2.5px] border-[#20221a]" />
                <span className="absolute right-[4px] top-[4px] h-1.5 w-1.5 rounded-full bg-[#20221a]" />
              </div>
            ) : (
              <span className="text-2xl font-semibold leading-none text-[#26271f]">{brand}</span>
            )}
          </div>

          <div className="flex flex-row gap-2 xl:flex-col">
            {primaryItems.map((item) => renderRailButton(item))}
          </div>
        </div>

        <div className="flex flex-row gap-2 rounded-2xl border border-[#e1e2d8] bg-[#f8f8f3] p-1.5 xl:flex-col">
          {quickItems.map((item) => renderRailButton(item, true))}
        </div>
      </div>
    </aside>
  );
}
