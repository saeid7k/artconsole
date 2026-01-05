import ArtworkStatusTag from "@/Components/ArtworkStatusTag";
import ArtworkTitleStack from "@/Components/ArtworkTitleStack";
import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import FormattedDimensions from "@/Components/FormattedDimensions";
import ImageGallery from "@/Components/ImageGallery";
import LocationStack from "@/Components/LocationStack";
import PageTitle from "@/Components/PageTitle";
import TextboxExpandable from "@/Components/TextboxExpandable";
import { getArtworkCategoryLabel } from "@/constants/artworkCategories";
import AppLayout from "@/Layouts/AppLayout";
import { ArtworkProps } from "@/types/artwork";
import { formatCurrency } from "@/utils/formatter";
import { BarCode02Icon, BrushIcon, Folder02Icon, GooglePhotosIcon, PackageDimensions01Icon, PaintBucketIcon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, router } from "@inertiajs/react";
import { Button, Card, Divider, Tabs, Tooltip } from "antd";
import React, { useState } from "react";
import ArtworkFormDrawer from "./Partials/ArtworkFormDrawer";
import { twMerge } from "tailwind-merge";
import ActivityLogs from "@/Components/ActivityLogs";
import { ArtworkShowProvider } from "@/contexts/ArtworkShowContext";

function Show ({ artwork }: { artwork: ArtworkProps }) {

  // Edit Drawer

  const [showEditDrawer, setShowEditDrawer] = useState(false)

  return (
    <ArtworkShowProvider value={{ artwork }}>
      <PageTitle
        breadcrumbItems={[
          { title: <Link href={route('artworks.index')}>Artworks</Link> },
          { title: artwork.title }
        ]}
        toolbar={
          <div>
            <Tooltip title="Edit Artwork" mouseEnterDelay={1} >
              <Button
                type="text"
                shape="square"
                onClick={() => setShowEditDrawer(true)}
                disabled={!artwork.abilities.update}
              >
                <HugeiconsIcon icon={PencilEdit02Icon} size={20} />
                Edit
              </Button>
            </Tooltip>
          </div>
        }
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

          <Card className="lg:w-1/2 grow max-h-[550px] overflow-y-auto">
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
                value={<FormattedDimensions dimensions={artwork.dimensions} showDepth />}
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
            <Tabs.TabPane tab="Description" key="description">
            </Tabs.TabPane>
            <Tabs.TabPane tab="Images" key="images">
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
      <ArtworkFormDrawer
        artwork={artwork}
        show={showEditDrawer}
        onClose={() => { setShowEditDrawer(false); router.reload() }}
        mode="update"
      />
    </ArtworkShowProvider>
  )
}

Show.layout = (page: React.ReactNode) => {
  return (
    <AppLayout children={page} />
  )
}

export default Show;
