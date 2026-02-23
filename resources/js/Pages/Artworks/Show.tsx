import ArtworkStatusTag from "@/Components/Artworks/ArtworkStatusTag";
import ArtworkTabs from "@/Components/Artworks/ArtworkTabs";
import ArtworkTitleStack from "@/Components/Artworks/ArtworkTitleStack";
import DataCol from "@/Components/Containers/DataCol";
import DataRow from "@/Components/Containers/DataRow";
import FlexBox from "@/Components/Containers/FlexBox";
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
import { BarCode02Icon, BrushIcon, Folder02Icon, GooglePhotosIcon, PackageDimensions01Icon, PaintBucketIcon, Stamp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";
import { Card, Divider } from "antd";
import React from "react";
import { twMerge } from "tailwind-merge";
import ArtworkToolbar from "./Partials/ArtworkToolbar";

function Show ({ artwork }: { artwork: ArtworkProps }) {

  const images = () => {
    let imgs = artwork.images || [];
    let mainImage = imgs.find((img: any) => img.is_main);
    let sortedImages = [];
    if (mainImage) {
      sortedImages.push(mainImage);
    }
    sortedImages.push(...imgs.filter((img: any) => !img.is_main));
    return sortedImages;
  };

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
              artwork.images?.length === 0 ? 'hidden lg:block' : ''
            )}
            styles={{
              body:{
                padding: '16px'
              }
            }}
          >
            <ImageGallery images={images()} />
          </Card>

          {/* Details */}

          <Card className="lg:w-1/2 grow sm:max-h-[580px] overflow-y-auto">
            <FlexBox justifyContent="between" alignItems="start" >
              <ArtworkTitleStack
                artwork={artwork}
                linkedTitle={false}
                size="large"
                serifTitle={true}
                rootClassName="mb-5"
              />
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
            </FlexBox>
            <TextboxExpandable content={artwork.description || 'No description.'} />
            <Divider />
            <div className="flex flex-col 2xl:flex-row gap-2">
              <DataCol className="2xl:w-1/2">
                <DataRow
                  icon={<HugeiconsIcon icon={Folder02Icon} size={18} />}
                  label="Category:"
                  value={getArtworkCategoryLabel(artwork.category)}
                  labelClassName="min-w-[80px]"
                />
                <DataRow
                  icon={<HugeiconsIcon icon={GooglePhotosIcon} size={18} />}
                  label="Subject:"
                  value={artwork.subjects?.join(', ')}
                  labelClassName="min-w-[80px]"
                />
                <DataRow
                  icon={<HugeiconsIcon icon={PaintBucketIcon} size={18} />}
                  label="Mediums:"
                  value={artwork.mediums?.join(', ')}
                  labelClassName="min-w-[80px]"
                />
                <DataRow
                  icon={<HugeiconsIcon icon={BrushIcon} size={18} />}
                  label="Styles:"
                  value={artwork.styles?.join(', ')}
                  labelClassName="min-w-[80px]"
                />
                <DataRow
                  icon={<HugeiconsIcon icon={PackageDimensions01Icon} size={18} />}
                  label="Size:"
                  value={<FormattedDimensions dimensions={artwork.dimensions || null} showDepth />}
                  labelClassName="min-w-[80px]"
                />
                {/* Price & Location */}
                <div className="my-3">
                  <LocationStack
                    location={artwork.location}
                    showTitle
                    showAddress
                    clamped={false}
                    boxed
                  />
                </div>
              </DataCol>
              <DataCol className="2xl:w-1/2">
                <DataRow
                  icon={<HugeiconsIcon icon={BarCode02Icon} size={18} />}
                  label="SKU:"
                  value={artwork.sku}
                  labelClassName="min-w-[80px]"
                />
                <DataRow
                  icon={<HugeiconsIcon icon={Stamp01Icon} size={18} />}
                  label="Provenance:"
                  value={artwork.provenance}
                  labelClassName="min-w-[80px]"
                />
              </DataCol>
            </div>
          </Card>
        </div>

        {/* Tabs */}

        <Card className="[&_.ant-card-body]:p-2 [&_.ant-card-body]:sm:p-5" >
          <ArtworkTabs artwork={artwork} />
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
