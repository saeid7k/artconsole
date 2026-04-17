import { twMerge } from "tailwind-merge";

type Props = {
  borderStyle?: 'dashed' | 'solid' | 'dotted';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  background?: 'light' | 'soft' | 'none';
  children: React.ReactNode;
}

function BlockContainer({ background = 'light', borderStyle = 'dashed', rounded = 'md', children }: Props) {
  return (
    <div
      className={twMerge(
        'border rounded p-2 w-max',
        `bg-${background}`,
        `rounded-${rounded}`,
        `!border-${borderStyle}`
      )}
    >
      {children}
    </div>
  )
}

export default BlockContainer;
