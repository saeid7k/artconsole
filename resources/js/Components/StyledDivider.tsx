import { Divider } from "antd";

type Props = {
  variant?: 'default'|'light';
  size?: 'small' | 'middle' | 'medium' | 'large';
  dashed?: boolean;
  lineColor?: 'soft' | 'light';
  rootClassName?: string;
  children?: React.ReactNode;
}

function StyledDivider({ variant = 'default', size, dashed = false, lineColor = 'light', rootClassName = '', children }: Props) {
  const variantClasses = {
    default: '',
    light: 'text-muted font-light tracking-wide',
  }

  const lineColorClasses = {
    soft: 'border-soft',
    light: '',
  }

  return (
    <Divider
      plain
      className={rootClassName + ' ' + lineColorClasses[lineColor]}
      dashed={dashed}
      size={size || undefined}
    >
      <div className={variantClasses[variant]}>
        {children}
      </div>
    </Divider>
  )
}

export default StyledDivider;
