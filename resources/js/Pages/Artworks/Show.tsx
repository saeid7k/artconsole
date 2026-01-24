import ActivityLogs from "@/Components/ActivityLogs";
import ArtworkStatusTag from "@/Components/Artworks/ArtworkStatusTag";
import ArtworkTitleStack from "@/Components/Artworks/ArtworkTitleStack";
import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import FormattedDimensions from "@/Components/FormattedDimensions";
import ImageGallery from "@/Components/ImageGallery";
import LocationStack from "@/Components/Locations/LocationStack";
import PageTitle from "@/Components/PageTitle";
import TextboxExpandable from "@/Components/TextboxExpandable";
import { getArtworkCategoryLabel } from "@/constants/artworkCategories";
import { ArtworkShowProvider } from "@/contexts/ArtworkShowContext";
import AppLayout from "@/Layouts/AppLayout";
import { ArtworkProps } from "@/types/artwork";
import { formatCurrency } from "@/utils/formatHelper";
import { BarCode02Icon, BrushIcon, Folder02Icon, GooglePhotosIcon, PackageDimensions01Icon, PaintBucketIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";
import { Card, Divider, Tabs } from "antd";
import React from "react";
import { twMerge } from "tailwind-merge";
import ArtworkToolbar from "./Partials/ArtworkToolbar";
import ArtworkImages from "@/Components/Artworks/ArtworkImages";

function Show ({ artwork }: { artwork: ArtworkProps }) {
  return (
    <ArtworkShowProvider value={{ artwork }}>
      <PageTitle
        breadcrumbItems={[
          { title: <Link href={route('artworks.index')}>Artworks</Link> },
          { title: artwork.title }
        ]}
        toolbar={<ArtworkToolbar artwork={artwork} />}
      />
      <div className="flex flex-col gap-3">

        {/* Main Content */}

        <div className="flex flex-col lg:flex-row gap-3 w-full">
          {/* Gallery */}

          <Card
            className={twMerge("lg:w-1/2 lg:max-w-[600px]",
              artwork.images.length === 0 ? 'hidden lg:block' : ''
            )}
          >
            <ImageGallery images={artwork.images} />
          </Card>

          {/* Details */}

          <Card className="lg:w-1/2 grow max-h-[580px] overflow-y-auto">
            <ArtworkTitleStack
              artwork={artwork}
              linkedTitle={false}
              size="large"
              serifTitle={true}
              className="mb-5"
            />
            <TextboxExpandable content={artwork.description || 'No description.'} />
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
                value={<FormattedDimensions dimensions={artwork.dimensions || null} showDepth />}
                labelClassName="min-w-[80px]"
              />
              {/* Price & Location */}
              <div className="flex flex-wrap gap-5 mt-3">
                <div className="flex items-start gap-2">
                  {artwork.price ? (
                    <div className="text-lg">
                      {formatCurrency(artwork.price, 2)}
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
                  showTitle
                  showAddress
                  clamped={false}
                  boxed
                />
              </div>
            </DataCol>
            <Divider />
            <DataCol gap={2} >
              <DataRow
                icon={<HugeiconsIcon icon={Folder02Icon} size={18} />}
                label="Category:"
                value={getArtworkCategoryLabel(artwork.category)}
                labelClassName="min-w-[80px]"
              />
              <DataRow
                icon={<HugeiconsIcon icon={GooglePhotosIcon} size={18} />}
                label="Subject:"
                value={artwork.subject}
                labelClassName="min-w-[80px]"
              />
              <DataRow
                icon={<HugeiconsIcon icon={BarCode02Icon} size={18} />}
                label="SKU:"
                value={artwork.sku || 'N/A'}
                labelClassName="min-w-[80px]"
              />
            </DataCol>
            <div>{}</div>
          </Card>
        </div>

        {/* Tabs */}

        <Card>
          <Tabs>
            <Tabs.TabPane tab="Images" key="images">
              <ArtworkImages artwork={artwork} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Documents" key="documents">
            </Tabs.TabPane>
            <Tabs.TabPane tab="Financial" key="financial">
            </Tabs.TabPane>
            <Tabs.TabPane tab="History" key="history">
              <ActivityLogs modelType="artwork" modelId={artwork.id} key={artwork.updated_at} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </ArtworkShowProvider>
  )
}

Show.layout = (page: React.ReactNode) => {
  return (
    <AppLayout children={page} />
  )
}

export default Show;
