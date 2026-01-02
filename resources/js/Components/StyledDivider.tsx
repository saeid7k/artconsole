import { Divider } from "antd";

type Props = {
  variant?: 'default'|'light';
  children?: React.ReactNode;
}

function StyledDivider({ variant = 'default', children }: Props) {

  const variantClasses = {
    default: '',
    light: 'text-muted font-light tracking-wide',
  }

  return (
    <Divider
      plain
    >
      <div className={variantClasses[variant]}>
        {children}
      </div>
    </Divider>
  )
}

export default StyledDivider;
