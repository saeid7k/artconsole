import loadingAnimation from "@animations/lottie/ai-loading.lottie";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import FlexBox from '../Containers/FlexBox';

type Props = {
  message?: string
  width?: number | string
  height?: number | string
}

function LoadingAi({ message, width = 100, height = 'auto' }: Props) {
  return (
    <FlexBox direction='col' >
      <DotLottieReact
        src={loadingAnimation}
        style={{
          width: width,
          height: height,
          aspectRatio: '1 / 1',
        }}
        autoplay
        loop
      />
      <div className='tracking-wider text-primary font-semibold'>
        {message || 'Loading...'}
      </div>
    </FlexBox>
  );
}

export default LoadingAi;
