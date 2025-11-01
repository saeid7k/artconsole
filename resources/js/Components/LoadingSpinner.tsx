import { Spin } from "antd";

type Props = {
  size?: 'small' | 'default' | 'large';
}

function LoadingSpinner({ size = 'default' }: Props) {
  return (
    <div className="flex justify-center p-5">
      <Spin size={size} />
    </div>
  )
}

export default LoadingSpinner;
