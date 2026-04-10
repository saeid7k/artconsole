import { ContactProps } from "@/types/contact";
import { InvoiceProps } from "@/types/invoice";
import { useQuery } from "@tanstack/react-query";
import { Card, Divider, Empty, Flex } from "antd";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import InvoiceNumberStack from "../Invoices/InvoiceNumberStack";
import FlexBox from "../Containers/FlexBox";
import StyledDate from "../StyledDate";
import InvoiceStatusTag from "../Invoices/InvoiceStatusTag";
import ArtworkTitleStack from "../Artworks/ArtworkTitleStack";
import { Link } from "@inertiajs/react";
import StyledCurrency from "../StyledCurrency";

type Props = {
  contact: ContactProps;
};

function ContactPurchases({ contact }: Props) {

  const invoicesQuery = useQuery({
    queryKey: ['contact', contact.id, 'invoices'],
    queryFn: () => axios.get(route('contacts.invoices', contact.id)).then(res => res.data),
    retry: false,
  });

  if (invoicesQuery.isLoading) {
    return <LoadingSpinner size="large" />
  }

  if (invoicesQuery.data && invoicesQuery.data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No purchases found" />
  }

  return (
    <div className="h-[65vh] overflow-y-auto">
      <div className="flex flex-col gap-3 mt-3 w-full">
        {invoicesQuery.data?.map((invoice: InvoiceProps) => {
          let artworks = invoice.artworks || [];
          let customItems = invoice.items ? invoice.items.filter(item => item.type === 'custom') : [];
          let extraItemsLength = (Math.max(artworks.length - 2, 0)) + customItems.length;
          return (
            /* Row */
            <Card
              size="small"
              key={invoice.id}
              className="w-full overflow-x-auto group hover:bg-primary/5 transition"
            >
              <div className="flex flex-col xl:flex-row gap-3 items-start xl:items-center">

                {/* Left Column */}
                <div className="flex flex-col xl:flex-row gap-3 xl:items-center grow" >
                  <FlexBox direction="col" alignItems="start" gap={0} >
                    <div className="label !mb-0 ps-2">Invoice #</div>
                    <InvoiceNumberStack invoice={invoice} showNewTag={false} />
                  </FlexBox>
                  <Divider vertical className="h-10 hidden xl:block" />

                  {/* Invoice Items */}
                  {invoice.items && invoice.items.length > 0 && (
                    <FlexBox
                      gap={3}
                      // className="w-max"
                      wrapping="wrap"
                    >
                      {artworks.slice(0, 2).map(artwork => (
                        <Link href={route('artworks.show', artwork.id)} key={artwork.id}>
                          <FlexBox
                            className="border !border-gray-500/0 hover:!border-gray-500/30 p-1 rounded transition"
                          >
                            <img
                              src={artwork.main_image_thumb_url ?? ''}
                              alt={artwork.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <ArtworkTitleStack artwork={artwork} showYear={false} showSigned={false} showConsignment={false} disableLinks />
                          </FlexBox>
                        </Link>
                      ))}
                      {extraItemsLength > 0 && (
                        <div
                          className="border border-light rounded py-1 px-2 content-center text-center leading-tight h-16 text-muted"
                        >
                          <div>+{extraItemsLength}</div>
                          <div>extra</div>
                          <div>item{extraItemsLength > 1 ? 's' : ''}</div>
                        </div>
                      )}
                    </FlexBox>
                  )}
                </div>

                {/* Right Column */}
                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                  <StyledCurrency value={invoice.total} />
                  <InvoiceStatusTag invoice={invoice} />
                  <StyledDate value={invoice.created_at} showTime={false} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  );
}

export default ContactPurchases;
