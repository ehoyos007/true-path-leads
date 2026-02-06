import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { StatusFilter } from "./types";

interface AdminFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (val: StatusFilter) => void;
}

export function AdminFilters({ search, onSearchChange, statusFilter, onStatusFilterChange }: AdminFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
      <div className="flex gap-2">
        {(["all", "synced", "failed"] as const).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusFilterChange(s)}
          >
            {s === "all" ? "All" : s === "synced" ? "Synced" : "Not Synced"}
          </Button>
        ))}
      </div>
    </div>
  );
}
