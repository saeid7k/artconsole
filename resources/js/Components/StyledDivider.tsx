import { Divider } from "antd";

type Props = {
  variant?: 'default'|'light';
  rootClassName?: string;
  children?: React.ReactNode;
}

function StyledDivider({ variant = 'default', rootClassName = '', children }: Props) {
  const variantClasses = {
    default: '',
    light: 'text-muted font-light tracking-wide',
  }

  return (
    <Divider
      plain
      className={rootClassName}
    >
      <div className={variantClasses[variant]}>
        {children}
      </div>
    </Divider>
  )
}

export default StyledDivider;
