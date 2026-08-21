import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Beach = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  entranceFee: unknown;
  googleMapsUrl: string | null;
  avgRating: unknown;
};

export function BeachCard({ beach }: { beach: Beach }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          <Link href={`/beaches/${beach.slug}`} className="hover:underline">
            {beach.name}
          </Link>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{beach.location}</p>
      </CardHeader>
      <CardContent className="flex-1 space-y-3 text-sm">
        <p className="line-clamp-2 text-muted-foreground">{beach.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          {beach.entranceFee ? <Badge variant="secondary">₱{String(beach.entranceFee)} entry</Badge> : null}
          {beach.avgRating ? <Badge variant="outline">★ {String(beach.avgRating)}</Badge> : null}
          {beach.googleMapsUrl ? (
            <a href={beach.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
              View on Google Maps →
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
