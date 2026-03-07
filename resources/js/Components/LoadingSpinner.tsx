import { Spin } from "antd";
import { twMerge } from "tailwind-merge";

type Props = {
  size?: 'small' | 'default' | 'large';
  color?: 'default' | 'white';
  className?: string;
}

function LoadingSpinner({ size = 'default', color = 'default', className }: Props) {

  const paddingSize = {
    small: 'p-1',
    default: 'p-3',
    large: 'p-5',
  }

  return (
    <div
      className={twMerge(
        "flex justify-center",
        paddingSize[size],
        className
      )}
    >
      <Spin
        size={size}
        styles={{
          indicator: {
            color: color === 'white' ? "#fff" : undefined
          }
        }}
      />
    </div>
  )
}

export default LoadingSpinner;
