import ArtworkStatusTag from "@/Components/ArtworkStatusTag";
import ArtworkTitleStack from "@/Components/ArtworkTitleStack";
import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import FormattedDimensions from "@/Components/FormattedDimensions";
import ImageGallery from "@/Components/ImageGallery";
import LocationStack from "@/Components/LocationStack";
import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { ArtworkProps } from "@/types/artwork";
import { formatCurrency } from "@/utils/formatter";
import { BrushIcon, MoneyBag01Icon, MoneyBag02Icon, PackageDimensions01Icon, PaintBucketIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";
import { Card, Divider, Tabs } from "antd";
import React from "react";

function Show ({ artwork }: { artwork: ArtworkProps }) {
  return (
    <div>
      <PageTitle
        breadcrumbItems={[
          { title: <Link href={route('artworks.index')}>Artworks</Link> },
          { title: artwork.title }]}
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <Card className="lg:w-1/2">
            <ImageGallery images={artwork.images} />
          </Card>
          <Card className="lg:w-1/2">
            <ArtworkTitleStack
              artwork={artwork}
              linkedTitle={false}
              size="large"
              serifTitle={true}
              className="mb-5"
            />
            <Divider />
            <DataCol>
              <DataRow
                icon={<HugeiconsIcon icon={PaintBucketIcon} size={18} />}
                label="Medium:"
                value={artwork.medium}
                labelClassName="min-w-[80px]"
              />
              <DataRow
                icon={<HugeiconsIcon icon={BrushIcon} size={18} />}
                label="Styles:"
                value={artwork.styles.join(', ')}
                labelClassName="min-w-[80px]"
              />
              <DataRow
                icon={<HugeiconsIcon icon={PackageDimensions01Icon} size={18} />}
                label="Size:"
                value={<FormattedDimensions dimensions={artwork.dimensions} />}
                labelClassName="min-w-[80px]"
              />
            </DataCol>
            <Divider />
            <DataCol gap={2} >
              <div className="flex items-start gap-2">
                {artwork.price ? (
                  <div className="text-lg">
                    {formatCurrency(artwork.price, 0)}
                  </div>
                ) : (
                  <div>
                    <em>Price on request</em>
                  </div>
                )}
                <ArtworkStatusTag status={artwork.status} />
              </div>
              <LocationStack
                location={artwork.location}
                showAddress
                clamped={false}
              />
            </DataCol>
            <div>{}</div>
          </Card>
        </div>
        <Card>
          Tabs
          <Tabs></Tabs>
        </Card>
      </div>
    </div>
  )
}

Show.layout = (page: React.ReactNode) => {
  return (
    <AppLayout children={page} />
  )
}

export default Show;
