import { ArrowLeft02Icon, ArrowRight02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Empty, Input, message, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ColumnTitle from "../Containers/ColumnTitle";
import LoadingSpinner from "../LoadingSpinner";
import ArtworkTitleStack from "./ArtworkTitleStack";

function ArtworkSelector() {

  const [sourceItems, setSourceItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadMoreUrl, setLoadMoreUrl] = useState<string | null>(null);

  const searchArtworksMutation = useMutation({
    mutationFn: (searchTerm: string) => axios.post(route('artworks.search'), {
      query: searchTerm
    }).then(res => res.data),
    onSuccess: (response) => {
      setSourceItems(response.data);
      setLoadMoreUrl(response.next_page_url || null);
    },
    onError: (err) => {
      console.error('Failed to search artworks:', err);
    }
  })

  useEffect(() => {
    searchArtworksMutation.mutate(searchTerm);
  }, []);

  const loadMoreMutation = useMutation({
    mutationFn: () => axios.post(loadMoreUrl!).then(res => res.data),
    onSuccess: (response) => {
      setSourceItems(prev => [...prev, ...response.data]);
      setLoadMoreUrl(response.next_page_url || null);
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.message || 'Failed to load more artworks');
    }
  })

  return (
    <div
      className="border-dashed border-2 border-soft p-3 rounded"
    >
      <div
        className="grid grid-cols-24 gap-3"
      >
        <div className="col-span-10" >
          <ColumnTitle>Source</ColumnTitle>
          <Space.Compact className="w-full">
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => {setSearchTerm(''); searchArtworksMutation.mutate('')}}
              onPressEnter={() => searchArtworksMutation.mutate(searchTerm)}
              placeholder="Search artworks..."
              allowClear
            />
            <Button
              type="default"
              onClick={() => searchArtworksMutation.mutate(searchTerm)}
              icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
            >
            </Button>
          </Space.Compact>
          <div className="flex flex-col gap-2 mt-2 h-[400px] overflow-y-auto">
            {searchArtworksMutation.isPending && (<LoadingSpinner size="large" />)}
            {sourceItems.length === 0 && !searchArtworksMutation.isPending && (
              <Empty description="No artworks found" />
            )}
            {sourceItems.length > 0 && sourceItems.map((artwork: any) => (
              <div key={artwork.id}
                className="flex border"
              >
                <img
                  src={artwork.main_image_thumb_url}
                  alt={artwork.title}
                  className="w-20 aspect-square object-cover"
                />
                <div
                  className="p-1"
                >
                  <ArtworkTitleStack artwork={artwork} showSigned={false} showEdition={false} showConsignment={false} disableLinks />
                </div>
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
        <div className="col-span-4" >
          <div className="flex flex-col gap-2 mt-20">
            <Button
              type="primary"
              icon={<HugeiconsIcon icon={ArrowRight02Icon} />}
              iconPlacement="end"
            >
              Select
            </Button>
            <Button
              type="primary"
              icon={<HugeiconsIcon icon={ArrowLeft02Icon} />}
              iconPlacement="start"
            >
              Deselect
            </Button>
            <Button
              type="default"
              className="mt-3"
            >
              Clear Selection
            </Button>
          </div>
        </div>
        <div className="col-span-10" >
          <ColumnTitle>Selected</ColumnTitle>
        </div>
      </div>
    </div>
  );
}

export default ArtworkSelector;
