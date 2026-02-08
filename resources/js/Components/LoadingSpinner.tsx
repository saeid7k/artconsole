import { Spin } from "antd";
import { twMerge } from "tailwind-merge";

type Props = {
  size?: 'small' | 'default' | 'large';
  color?: 'default' | 'white';
}

function LoadingSpinner({ size = 'default', color = 'default' }: Props) {

  const paddingSize = {
    small: 'p-1',
    default: 'p-3',
    large: 'p-5',
  }

  return (
    <div
      className={twMerge(
        "flex justify-center",
        paddingSize[size]
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
