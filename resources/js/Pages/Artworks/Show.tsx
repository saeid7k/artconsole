import ArtworkTitleStack from "@/Components/ArtworkTitleStack";
import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import FormattedDimensions from "@/Components/FormattedDimensions";
import ImageGallery from "@/Components/ImageGallery";
import PageTitle from "@/Components/PageTitle";
import AppLayout from "@/Layouts/AppLayout";
import { ArtworkProps } from "@/types/artwork";
import { BrushIcon, PackageDimensions01Icon, PaintBucketIcon } from "@hugeicons/core-free-icons";
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
                label="Dimensions:"
                value={<FormattedDimensions dimensions={artwork.dimensions} />}
                labelClassName="min-w-[80px]"
              />
            </DataCol>
            <Divider />
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
