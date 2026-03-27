import { Divider } from "antd";

type Props = {
  variant?: 'default'|'light';
  dashed?: boolean;
  lineColor?: 'soft' | 'light';
  rootClassName?: string;
  children?: React.ReactNode;
}

function StyledDivider({ variant = 'default', dashed = false, lineColor = 'light', rootClassName = '', children }: Props) {
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
    >
      <div className={variantClasses[variant]}>
        {children}
      </div>
    </Divider>
  )
}

export default StyledDivider;
