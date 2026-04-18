import { ReactNode } from 'react';

type Props = {
  title?: string;
  gap?: number;
  className?: string;
  children?: ReactNode;
}

function DataCol({ title, gap = 1, className = '', children = null }: Props) {
  return (
    <div className={`flex flex-col gap-${gap} ${className}`}>
      {title && <h4 className="font-semibold !m-0">{title}</h4>}
      {children}
    </div>
  )
}

export default DataCol
