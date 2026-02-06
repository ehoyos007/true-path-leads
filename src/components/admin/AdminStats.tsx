import { Card, CardContent } from "@/components/ui/card";

interface AdminStatsProps {
  total: number;
  synced: number;
  failed: number;
}

export function AdminStats({ total, synced, failed }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold text-foreground">{total}</p>
          <p className="text-sm text-muted-foreground">Total Leads</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold text-primary">{synced}</p>
          <p className="text-sm text-muted-foreground">CRM Synced</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold text-destructive">{failed}</p>
          <p className="text-sm text-muted-foreground">Not Synced</p>
        </CardContent>
      </Card>
    </div>
  );
}
