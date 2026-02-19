import { ArrowLeft01Icon, ArrowLeft02Icon, ArrowLeftDoubleIcon, ArrowRight01Icon, ArrowRight02Icon, ArrowRight03Icon, ArrowRightDoubleIcon, CheckmarkCircleIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Empty, Input, message, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import ColumnTitle from "../Containers/ColumnTitle";
import LoadingSpinner from "../LoadingSpinner";
import ArtworkTitleStack from "./ArtworkTitleStack";
import { twMerge } from "tailwind-merge";
import ArtworkSelectCard from "./ArtworkSelectCard";

function ArtworkSelector() {

  const [searchTerm, setSearchTerm] = useState('');
  const [loadMoreUrl, setLoadMoreUrl] = useState<string | null>(null);
  const [sourceItems, setSourceItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [checkedSourceItems, setCheckedSourceItems] = useState<any[]>([]);
  const [checkedSelectedItems, setCheckedSelectedItems] = useState<any[]>([]);
  const [allSourceCount, setAllSourceCount] = useState(0);

  const searchArtworksMutation = useMutation({
    mutationFn: ({searchTerm, all = false, setAsSelected = false}: {searchTerm: string, all?: boolean, setAsSelected?: boolean}) => axios.post(route('artworks.search'), {
      query: searchTerm,
      all: all
    }).then(res => res.data),
    onSuccess: (response, variables) => {
      setSourceItems(response.data);
      setLoadMoreUrl(response.next_page_url || null);
      setAllSourceCount(response.total);
      if (variables.setAsSelected) {
        setSelectedItems(prev => [...prev, ...response.data.filter((s: any) => !prev.find((p: any) => p.id === s.id))]);
        setCheckedSourceItems([]);
      }
    },
    onError: (err) => {
      console.error('Failed to search artworks:', err);
    }
  })

  useEffect(() => {
    searchArtworksMutation.mutate({searchTerm});
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

  function toggleCheckSource(artwork: any) {
    setCheckedSourceItems(prev => {
      if (prev.find((p: any) => p.id === artwork.id)) {
        return prev.filter(p => p.id !== artwork.id);
      } else {
        return [...prev, artwork];
      }
    })
  }

  function toggleCheckSelected(artwork: any) {
    setCheckedSelectedItems(prev => {
      if (prev.find((p: any) => p.id === artwork.id)) {
        return prev.filter(p => p.id !== artwork.id);
      } else {
        return [...prev, artwork];
      }
    })
  }

  function handleSelect() {
    setSelectedItems(prev => [...prev, ...checkedSourceItems.filter(c => !prev.find((p: any) => p.id === c.id))]);
    setCheckedSourceItems([]);
  }

  function handleDeselect() {
    setSelectedItems(prev => prev.filter(p => !checkedSelectedItems.find((c: any) => c.id === p.id)));
    setCheckedSelectedItems([]);
  }

  function handleSelectAll() {
    searchArtworksMutation.mutate({ searchTerm, all: true, setAsSelected: true });
  }

  function handleClearSelection() {
    setSelectedItems([]);
    setCheckedSelectedItems([]);
  }

  return (
    <div
      className="grid grid-cols-24 gap-3 min-w-[800px]"
    >
      <div className="col-span-10" >
        <ColumnTitle>Source</ColumnTitle>
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
          {sourceItems.length === 0 && !searchArtworksMutation.isPending && (
            <Empty description="No artworks found" />
          )}
          {sourceItems.length > 0 && sourceItems.map((artwork: any) => (
            <ArtworkSelectCard
              key={artwork.id}
              artwork={artwork}
              checkedItems={checkedSourceItems}
              onClick={toggleCheckSource}
            />
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
            icon={<HugeiconsIcon icon={ArrowRight01Icon} />}
            iconPlacement="end"
            onClick={handleSelect}
            disabled={checkedSourceItems.length === 0}
          >
            Select {checkedSourceItems.length > 0 && `(${checkedSourceItems.length})`}
          </Button>
          <Button
            type="primary"
            icon={<HugeiconsIcon icon={ArrowLeft01Icon} />}
            iconPlacement="start"
            onClick={handleDeselect}
            disabled={checkedSelectedItems.length === 0}
          >
            Deselect {checkedSelectedItems.length > 0 && `(${checkedSelectedItems.length})`}
          </Button>
          <Button
            type="default"
            icon={<HugeiconsIcon icon={ArrowRightDoubleIcon} />}
            iconPlacement="end"
            onClick={handleSelectAll}
            disabled={sourceItems.length === 0}
            className="mt-3"
          >
            <div>Select All <span className="text-primary font-bold">({allSourceCount})</span></div>
          </Button>
          <Button
            type="default"
            onClick={handleClearSelection}
            disabled={selectedItems.length === 0}
            icon={<HugeiconsIcon icon={ArrowLeftDoubleIcon} />}
            iconPlacement="start"
          >
            Clear Selection
          </Button>
        </div>
      </div>
      <div className="col-span-10" >
        <ColumnTitle>Selected ({selectedItems.length})</ColumnTitle>
        <div className="flex flex-col gap-1 mt-2 h-[400px] overflow-y-auto">
          {selectedItems.length === 0 && (
            <Empty description="No artworks selected yet" className="mt-5" />
          )}
          {selectedItems.length > 0 && selectedItems.map((artwork: any) => (
            <ArtworkSelectCard
              key={artwork.id}
              artwork={artwork}
              checkedItems={checkedSelectedItems}
              onClick={toggleCheckSelected}
              size="small"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtworkSelector;
