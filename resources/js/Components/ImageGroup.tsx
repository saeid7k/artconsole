import { twMerge } from "tailwind-merge";

type Props = {
  images: string[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function ImageGroup({ images, size = 'sm', className }: Props) {

  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const imageRows = () => {
    let rowOne: string[] = [];
    let rowTwo: string[] = [];
    images.forEach((src, index) => {
      if (index % 2 === 0) {
        rowOne.push(src);
      } else {
        rowTwo.push(src);
      }
    })
    return [rowOne, rowTwo];
  }

  return (
    <>
      {images.length > 0 && (
        <div
          className={twMerge(
            'w-full pb-1 overflow-x-auto no-scrollbar',
            className
          )}
        >
          <div className="flex flex-col gap-1">
            {imageRows().map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {
                  row.map((src, index) => (
                    <div
                      key={src}
                      className={twMerge(
                        "flex-shrink-0 overflow-hidden",
                        sizeClasses[size]
                      )}
                    >
                      <img
                        src={src}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGroup;
