import { ArtworkProps } from "@/types/artwork";
import { ContactProps } from "@/types/contact";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Empty, Masonry } from "antd";
import axios from "axios";
import { useState } from "react";
import ArtworkCard from "../Artworks/ArtworkCard";
import LoadingSpinner from "../LoadingSpinner";

function ContactArtworks({ contact }: { contact: ContactProps }) {

  const [data, setData] = useState<any[]>([]);
  const [loadMoreUrl, setLoadMoreUrl] = useState<string | null>(null);

  const artworksQuery = useQuery({
    queryKey: ['contact-artworks', contact.id],
    queryFn: () => axios.post(route('artworks.search'), {
      artist_id: contact.id,
      per_page: 10,
    })
      .then(res => {
        setData(res.data.data || []);
        setLoadMoreUrl(res.data.next_page_url || null);
        return res.data;
      }),
    enabled: !!contact.id
  });

  const loadMoreMutation = useMutation({
    mutationKey: ['contact-artworks-load-more', contact.id, loadMoreUrl],
    mutationFn: () => axios.post(loadMoreUrl!, {
      artist_id: contact.id,
      per_page: 10,
    }),
    onSuccess: (response) => {
      setData(prev => [...prev, ...(response.data.data || [])]);
      setLoadMoreUrl(response.data.next_page_url || null);
    },
    onError: (err: any) => {
      console.error('Failed to load more artworks:', err);
    }
  })

  return (
    <div>
      {artworksQuery.isLoading ? (
        <LoadingSpinner size="large" />
      ) : data.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No artworks found for this contact." />
      ) : (
        <>
          <Masonry
            columns={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4, xxxl: 5 }}
            gutter={{ xs: 16, sm: 16, md: 16, lg: 16, xl: 16, xxl: 16, xxxl: 16 }}
            items={data.map((a: ArtworkProps) => ({
              key: a.id,
              data: a
            }))}
            itemRender={(data) => (
              <ArtworkCard artwork={data?.data} />
            )}
          />
          {loadMoreUrl && (
            <div className="mt-4">
              <Button
                onClick={() => loadMoreMutation.mutate()}
                disabled={artworksQuery.isLoading}
                loading={loadMoreMutation.isPending}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ContactArtworks;
