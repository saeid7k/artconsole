import { ReactNode } from 'react';

function DataCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <h4 className="m-0">{title}</h4>
      {children}
    </div>
  )
}

export default DataCol
