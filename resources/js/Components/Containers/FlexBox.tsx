import { twMerge } from "tailwind-merge";

type Props = {
  direction?: 'row' | 'col';
  gap?: number;
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  wrapping?: 'wrap' | 'nowrap' | 'wrap-reverse';
  className?: string;
  children: React.ReactNode;
}

function FlexBox({
  direction = 'row',
  gap = 1,
  justifyContent = 'start',
  alignItems = 'center',
  wrapping = 'nowrap',
  className,
  children,
  ...props
}: Props) {

  return (
    <div
      className={twMerge(
        'flex items-center gap-1 w-full',
        `flex-${direction}`,
        `justify-${justifyContent}`,
        `items-${alignItems}`,
        `flex-${wrapping}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default FlexBox;
