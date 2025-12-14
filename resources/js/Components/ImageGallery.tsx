import { Carousel, Image } from "antd";
import { CarouselRef } from "antd/es/carousel";
import { useRef, useState } from "react";

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
  const imagesUrl = images.map((img) => img.urls.original);

  return (
    <div>

      {/* Image carousel */}

      <Carousel
        ref={carouselRef}
        dots={false}
      >
        {images.map((image, index) => (
          <div key={image.id} className="[&_.ant-image-cover]:!opacity-0"
          >
            <img
              src={image.urls.original}
              className="max-h-[400px] !w-auto max-w-full mx-auto cursor-pointer"
              onClick={() => setOpenImageIndex(index)}
            />
          </div>
        ))}
      </Carousel>

      {/* Thumbnail */}

      {images.length > 1 && (
        <div className="w-full mt-2 pb-1 overflow-x-auto flex gap-2 gallery-thumbnails">
          {images.map((image, index) => (
            <div key={image.id} className="flex-shrink-0 w-20 h-20 border rounded overflow-hidden">
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
