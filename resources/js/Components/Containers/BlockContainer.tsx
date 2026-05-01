import { twMerge } from "tailwind-merge";

type Props = {
  borderStyle?: 'dashed' | 'solid' | 'dotted';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  background?: 'light' | 'soft' | 'none';
  className?: string;
  children: React.ReactNode;
}

function BlockContainer({ background = 'light', borderStyle = 'dashed', rounded = 'md', className, children }: Props) {
  return (
    <div
      className={twMerge(
        'border rounded p-2 w-max max-w-full',
        `bg-${background}`,
        `rounded-${rounded}`,
        `!border-${borderStyle}`,
        className
      )}
    >
      {children}
    </div>
  )
}

export default BlockContainer;
