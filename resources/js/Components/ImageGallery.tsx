import colors from "@/Themes/theme";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Carousel, Image } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef, useState } from "react";
import imagePlaceholder from '~/resources/images/image-placeholder.svg';

type Props = {
  images: Array<{
    id: string;
    file_name: string;
    urls: {
      original: string;
      thumb: string;
    };
  }>;
};

function ImageGallery({ images }: Props) {

  const carouselRef = useRef<CarouselRef>(null);
  const [openImageIndex, setOpenImageIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesUrl = images.map((img) => img.urls.original);

  return (
    <div>

      {/* Image carousel */}

      {images.length > 0 && (
        <div className="relative">
          <Carousel
            ref={carouselRef}
            dots={false}
            afterChange={(current) => setCurrentImageIndex(current)}
            className="h-[440px]"
          >
            {images.map((image, index) => (
              <div key={image.id} className="[&_.ant-image-cover]:!opacity-0"
              >
                <img
                  src={image.urls.original}
                  className="max-h-[440px] !w-auto max-w-full mx-auto cursor-pointer"
                  onClick={() => setOpenImageIndex(index)}
                />
              </div>
            ))}
          </Carousel>
          <Button
            className="absolute top-1/2 right-2 -translate-y-1/2 opacity-30 hover:opacity-80"
            size="small"
            shape="circle"
            onClick={() => carouselRef.current?.next()}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Button>
          <Button
            className="absolute top-1/2 left-2 -translate-y-1/2 opacity-30 hover:opacity-80"
            size="small"
            shape="circle"
            onClick={() => carouselRef.current?.prev()}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
          </Button>
        </div>
      )}
      {images.length === 0 && (
        <img
          src={imagePlaceholder}
          alt="No image available"
          className="block max-h-[300px] !w-auto max-w-full mx-auto opacity-50"
        />
      )}

      {/* Thumbnail */}

      {images.length > 1 && (
        <div className="w-full mt-2 pb-1 overflow-x-auto flex gap-2 gallery-thumbnails">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="flex-shrink-0 w-10 h-10 sm:w-20 sm:h-20 rounded overflow-hidden"
              style={{
                border: index === currentImageIndex ? `2px solid ${colors.primary[500]}` : '2px solid transparent',
              }}
            >
              <img
                src={image.urls.thumb}
                alt={image.file_name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => carouselRef.current?.goTo(index)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}

      <div>
        <Image.PreviewGroup
          items={imagesUrl}
          preview={{
            visible: openImageIndex !== null,
            current: openImageIndex ?? 0,
            onVisibleChange: (visible) => {
              if (!visible) setOpenImageIndex(null);
            },
            onChange: (current) => {
              setOpenImageIndex(current);
              carouselRef.current?.goTo(current, true);
            },
          }}
        />
      </div>
    </div>
  )
}

export default ImageGallery;
