import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataCardProps {
  value: number;
  label: string;
  variant: "positive" | "neutral" | "negative";
}

export const DataCard = ({ value, label, variant }: DataCardProps) => {
  let classNames = "";

  if (variant === "positive") {
    classNames = "bg-green-100 text-green-500";
  } else if (variant === "neutral") {
    classNames = "bg-gray-100 text-gray-500";
  } else if (variant === "negative") {
    classNames = "bg-red-100 text-red-500";
  }

  return (
    <Card className={classNames}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
