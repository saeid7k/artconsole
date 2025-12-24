import { ReactNode } from 'react';

type Props = {
  title?: string;
  gap?: number;
  children?: ReactNode;
}

function DataCol({ title, gap = 1, children = null }: Props) {
  return (
    <div className={`flex flex-col gap-${gap}`}>
      {title && <h4 className="m-0">{title}</h4>}
      {children}
    </div>
  )
}

export default DataCol
