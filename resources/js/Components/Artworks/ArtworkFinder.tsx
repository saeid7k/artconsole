import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Empty, Input, message, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import ArtworkSelectCard from "./ArtworkSelectCard";

type Props = {
  onSelect?: (artwork: any) => void;
}

function ArtworkFinder({ onSelect }: Props) {

  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loadMoreUrl, setLoadMoreUrl] = useState<string | null>(null);

  const searchArtworksMutation = useMutation({
    mutationFn: ({searchTerm}: {searchTerm: string}) => axios.post(route('artworks.search'), {
      query: searchTerm,
      all: false
    }).then(res => res.data),
    onSuccess: (response) => {
      setItems(response.data);
      setLoadMoreUrl(response.next_page_url || null);
    },
    onError: (err) => {
      console.error('Failed to search artworks:', err);
    }
  })

  const loadMoreMutation = useMutation({
    mutationFn: () => axios.post(loadMoreUrl!, {
      query: searchTerm,
    })
      .then(res => res.data),
    onSuccess: (response) => {
      setItems(prev => [...prev, ...response.data]);
      setLoadMoreUrl(response.next_page_url || null);
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to load more artworks');
    }
  })

  useEffect(() => {
    searchArtworksMutation.mutate({searchTerm});
  }, [])

  return (
    <div>
      <Space.Compact className="w-full">
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => {setSearchTerm(''); searchArtworksMutation.mutate({searchTerm: ''})}}
          onPressEnter={() => searchArtworksMutation.mutate({searchTerm})}
          placeholder="Search artworks..."
          allowClear
        />
        <Button
          type="default"
          onClick={() => searchArtworksMutation.mutate({searchTerm})}
          icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        >
        </Button>
      </Space.Compact>
      <div className="flex flex-col gap-2 mt-2 h-[400px] overflow-y-auto">
        {searchArtworksMutation.isPending && (<LoadingSpinner size="large" />)}
        {items.length === 0 && !searchArtworksMutation.isPending && (
          <Empty description="No artworks found" />
        )}
        {items.length > 0 && items.map((artwork: any) => (
          <div
            key={artwork.id}
            onClick={() => onSelect && onSelect(artwork)}
          >
            <ArtworkSelectCard
              artwork={artwork}
            />
          </div>
        ))}
        <div className="mx-1 mb-3">
          <Button
            variant="outlined"
            color="primary"
            className="w-full"
            disabled={!loadMoreUrl}
            loading={loadMoreMutation.isPending}
            onClick={() => loadMoreMutation.mutate()}
          >
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ArtworkFinder;
