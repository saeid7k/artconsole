import { twMerge } from "tailwind-merge";
import FlexBox from "./Containers/FlexBox";

type Props = {
  images: string[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: (index: number) => void;
  selectedIndex?: number;
  setSelectedIndex?: (index: number) => void;
  className?: string;
}

function ImageGroupFlex({ images, size = 'sm', onClick, selectedIndex, setSelectedIndex, className }: Props) {

  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-20 h-20',
    md: 'w-30 h-30',
    lg: 'w-50 h-50',
    xl: 'w-100 h-100'
  }

  return (
    <FlexBox wrapping="wrap" gap={2}
      className="p-1"
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={twMerge(
            "flex-shrink-0 overflow-hidden",
            sizeClasses[size],
            selectedIndex === index ? "ring-3 ring-primary" : "",
            className
          )}
          onClick={onClick ? () => onClick(index) : undefined}
        >
          <img
            src={image}
            alt={`Image ${index}`}
            className={twMerge(
              "w-full h-full object-cover rounded",
              onClick ? "cursor-pointer hover:scale-105 hover:brightness-110 transition" : ""
            )}
          />
        </div>
      ))}
    </FlexBox>
  )
}

export default ImageGroupFlex
