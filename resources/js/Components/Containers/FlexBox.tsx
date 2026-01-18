import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLAttributes<HTMLDivElement> & {
  direction?: 'row' | 'col';
  gap?: number;
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  wrapping?: 'wrap' | 'nowrap' | 'wrap-reverse';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function FlexBox({
  direction = 'row',
  gap = 1,
  justifyContent = 'start',
  alignItems = 'center',
  wrapping = 'nowrap',
  className,
  style,
  children,
  ...props
}: Props) {

  return (
    <div
      className={twMerge(
        'flex items-center gap-1',
        `flex-${direction}`,
        `justify-${justifyContent}`,
        `items-${alignItems}`,
        `flex-${wrapping}`,
        `gap-${gap}`,
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

export default FlexBox;
