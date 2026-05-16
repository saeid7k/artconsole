import { ArtworkProps } from "@/types/artwork";
import { useQuery } from "@tanstack/react-query";
import { Card } from "antd";
import axios from "axios";
import ArtworkSelectCard from "../Artworks/ArtworkSelectCard";

function RecentArtworksWidget() {

  const { data, isLoading } = useQuery({
    queryKey: ['recent-artworks'],
    queryFn: () => axios.post(route('artworks.get-recent')).then(res => res.data),
    staleTime: Infinity
  });

  return (
    <Card
      title="Recent Artworks"
      loading={isLoading}
    >
      <div className="flex flex-col gap-2">
        {data && data.length > 0 && data.map((artwork: ArtworkProps) => (
          <ArtworkSelectCard
            key={artwork.id}
            artwork={artwork}
            size="sm"
          />
        ))}
      </div>
    </Card>
  )
}

export default RecentArtworksWidget;
