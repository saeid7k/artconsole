import { ContactProps } from "@/types/contact";
import { router } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty } from "antd";
import axios from "axios";
import ContactStack from "../Contacts/ContactStack";
import FlexBox from "../Containers/FlexBox";

function TopSellingArtistsWidget() {

  const { data, isLoading } = useQuery({
    queryKey: ['top-selling-artists'],
    queryFn: () => axios.post(route('contacts.top-selling-artists')).then(res => res.data),
    staleTime: Infinity
  });

  return (
    <Card
      title="Top Selling Artists"
      loading={isLoading}
      extra={
        data && data.length > 0 && (
          <Button type="link" size="small"
            onClick={() => router.visit(route('contacts.index', {
              relationship: 'artist'
            }))}
          >
            View All
          </Button>
        )
      }
      className={isLoading ? 'h-[295px]' : ''}
    >
      {
        data?.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No artworks found" />
      }

      <div className="flex flex-col gap-1">
        {data && data.length > 0 && data.map((artist: ContactProps) => (
          <FlexBox key={artist.id}
            justifyContent="between"
            gap={2}
            className="hover:bg-gray-500/5 p-2"
          >
            <ContactStack
              contact={artist}
              rootClassName="grow"
            />
            <div className="text-lg font-light">{artist.sold_arts_count}</div>
          </FlexBox>
        ))}
      </div>
    </Card>
  )
}

export default TopSellingArtistsWidget;
