import { ArtworkProps } from "@/types/artwork";
import { useQuery } from "@tanstack/react-query";
import { Button, Card } from "antd";
import axios from "axios";
import ArtworkStack from "../Artworks/ArtworkStack";
import { router } from "@inertiajs/react";

function RecentArtworksWidget() {

  const { data, isLoading } = useQuery({
    queryKey: ['recent-artworks'],
    queryFn: () => axios.post(route('artworks.get-recent'), { limit: 3 }).then(res => res.data),
    staleTime: Infinity
  });

  return (
    <Card
      title="Recent Artworks"
      loading={isLoading}
      extra={
        data && data.length > 0 && (
          <Button type="link" size="small"
            onClick={() => router.visit(route('artworks.index'))}
          >
            View All
          </Button>
        )
      }
      className={isLoading ? 'h-[295px]' : ''}
    >
      <div className="flex flex-col gap-2">
        {data && data.length > 0 && data.map((artwork: ArtworkProps) => (
          <div>
            <ArtworkStack
              key={artwork.id}
              artwork={artwork}
              size="sm"
              variant="outline"
              rounded
              onClick={() => router.visit(route('artworks.show', artwork.id))}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RecentArtworksWidget;
