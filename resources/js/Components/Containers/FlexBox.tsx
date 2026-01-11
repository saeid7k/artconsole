import { twMerge } from "tailwind-merge";

type Props = {
  direction?: 'row' | 'col';
  gap?: number;
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  className?: string;
  children: React.ReactNode;
}

function FlexBox({
  direction = 'row',
  gap = 1,
  justifyContent = 'start',
  alignItems = 'center',
  className,
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
